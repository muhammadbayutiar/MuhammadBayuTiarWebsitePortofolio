// Contact API route
// Successful responses are only returned after email delivery succeeds.

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContactForm } from '@/utils/validation';
import { checkAdvancedRateLimit } from '@/utils/advancedRateLimit';
import { checkForSpam, type BehavioralData } from '@/utils/spamDetection';
import { logger } from '@/utils/logger';
import { storeSubmission } from '@/utils/submissionStorage';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const CONTACT_SERVICE_UNAVAILABLE_MESSAGE = 'Contact service is temporarily unavailable. Please try again later.';

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  honeypot?: unknown;
  turnstileToken?: unknown;
  behavioral?: {
    formLoadTime?: unknown;
    firstInteractionTime?: unknown;
    interactionCount?: unknown;
  };
}

// Timeout wrapper
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Secure IP extraction
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    const clientIP = ips[0];
    
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(clientIP) || /^[0-9a-f:]+$/i.test(clientIP)) {
      return clientIP;
    }
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  
  return 'unknown';
}

// HTML escape (only escaping for email display)
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Verify Cloudflare Turnstile token (FAIL-OPEN strategy)
async function verifyTurnstile(token: string, ip: string): Promise<{
  success: boolean;
  score: number;  // Add to spam score if failed
}> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return { success: true, score: 0 };
  }

  try {
    const response = await withTimeout(
      fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: ip,
        }),
      }),
      5000,
      'Turnstile verification timeout'
    );

    const data = await response.json();
    
    if (data.success === true) {
      return { success: true, score: 0 };
    } else {
      // FAIL-OPEN: Don't block, just add to spam score
      return { success: false, score: 20 };
    }
  } catch (error) {
    logger.error('Turnstile verification failed', {
      component: 'contactAPI',
      error: error instanceof Error ? error.message : 'Unknown',
    });
    // FAIL-OPEN: On error, allow but add small score
    return { success: false, score: 10 };
  }
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    logger.info('Contact form submission received', {
      component: 'contactAPI',
      requestId,
    });

    if (!resend || !process.env.RESEND_API_KEY) {
      logger.error('RESEND_API_KEY not configured', {
        component: 'contactAPI',
        requestId,
      });
      return NextResponse.json(
        { success: false, error: CONTACT_SERVICE_UNAVAILABLE_MESSAGE },
        { status: 503 }
      );
    }

    const ip = getClientIP(request);
    
    if (ip === 'unknown') {
      logger.warn('Could not determine client IP', {
        component: 'contactAPI',
        requestId,
      });
    }

    const body = await withTimeout<ContactRequestBody>(
      request.json(),
      5000,
      'Request body parsing timeout'
    );
    
    const { name, email, message, honeypot, turnstileToken, behavioral } = body;

    // PROTECTION LAYER 1: Honeypot (only obvious bots)
    if (honeypot) {
      logger.info('Bot detected via honeypot', {
        component: 'contactAPI',
        requestId,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid submission.' },
        { status: 400 }
      );
    }

    // Trim inputs only (NO sanitization - validation handles security)
    const formData = {
      name: typeof name === 'string' ? name.trim() : '',
      email: typeof email === 'string' ? email.trim() : '',
      message: typeof message === 'string' ? message.trim() : '',
    };

    // PROTECTION LAYER 2: Input validation (strict validation, no sanitization)
    const validation = validateContactForm(formData);
    if (!validation.valid) {
      logger.info('Validation failed', {
        component: 'contactAPI',
        requestId,
        error: validation.error,
      });
      
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // PROTECTION LAYER 3: Turnstile (FAIL-OPEN)
    let turnstileScore = 0;
    if (typeof turnstileToken === 'string' && turnstileToken.length > 0) {
      const turnstileResult = await verifyTurnstile(turnstileToken, ip);
      turnstileScore = turnstileResult.score;
      
      if (!turnstileResult.success) {
        logger.warn('Turnstile verification failed (adding to spam score)', {
          component: 'contactAPI',
          requestId,
          scoreAdded: turnstileScore,
        });
      }
    }

    // PROTECTION LAYER 4: BALANCED spam detection
    const behavioralData: BehavioralData | undefined = behavioral ? {
      formLoadTime: typeof behavioral.formLoadTime === 'number' ? behavioral.formLoadTime : undefined,
      firstInteractionTime: typeof behavioral.firstInteractionTime === 'number' ? behavioral.firstInteractionTime : undefined,
      submissionTime: Date.now(),
      interactionCount: typeof behavioral.interactionCount === 'number' ? behavioral.interactionCount : undefined,
    } : undefined;

    const spamCheck = checkForSpam(formData, behavioralData);
    const finalScore = Math.min(spamCheck.score + turnstileScore, 100);
    
    // Determine tier based on final score
    let tier: 'safe' | 'suspicious' | 'high-risk';
    if (finalScore < 40) {
      tier = 'safe';
    } else if (finalScore < 75) {
      tier = 'suspicious';
    } else {
      tier = 'high-risk';
    }
    
    logger.info('Spam check completed', {
      component: 'contactAPI',
      requestId,
      score: finalScore,
      tier,
      signals: spamCheck.signals,
    });

    // PROTECTION LAYER 5: Rate limiting
    const rateLimit = await checkAdvancedRateLimit(ip, formData.email);
    
    // Log rate limit mode
    logger.info('Rate limit check', {
      component: 'contactAPI',
      requestId,
      mode: 'memory',
      allowed: rateLimit.allowed,
    });
    
    if (!rateLimit.allowed) {
      logger.warn('Rate limit exceeded', {
        component: 'contactAPI',
        requestId,
        reason: rateLimit.reason,
      });
      
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // Escape HTML for email display only
    const escapedName = escapeHtml(formData.name);
    const escapedEmail = escapeHtml(formData.email);
    const escapedMessage = escapeHtml(formData.message).replace(/\n/g, '<br>');

    // CRITICAL FIX: Generate subject with tier tag
    const subjectPrefix = tier === 'safe' ? '[SAFE]' : tier === 'suspicious' ? '[SUSPICIOUS]' : '[HIGH-RISK]';
    const emailSubject = `${subjectPrefix} New Contact from ${formData.name}`;

    // Send email with retry and timeout (ALL TIERS - NO EXCEPTIONS)
    const sendEmail = async () => {
      return await withTimeout(
        resend!.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: 'muhammadbayutiar@gmail.com',
          replyTo: formData.email,
          subject: emailSubject,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { 
                    background: ${tier === 'high-risk' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : tier === 'suspicious' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)'}; 
                    color: white; 
                    padding: 20px; 
                    border-radius: 8px 8px 0 0; 
                  }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                  .field { margin-bottom: 20px; }
                  .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
                  .value { background: white; padding: 12px; border-radius: 6px; border-left: 3px solid ${tier === 'high-risk' ? '#dc2626' : tier === 'suspicious' ? '#f59e0b' : '#06b6d4'}; word-wrap: break-word; }
                  .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                  .alert { 
                    background: ${tier === 'high-risk' ? '#fee2e2' : tier === 'suspicious' ? '#fef3c7' : '#dbeafe'}; 
                    border-left: 4px solid ${tier === 'high-risk' ? '#dc2626' : tier === 'suspicious' ? '#f59e0b' : '#06b6d4'};
                    padding: 12px; 
                    border-radius: 6px; 
                    margin-top: 10px; 
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2 style="margin: 0;">${subjectPrefix} Contact Form Submission</h2>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">From:</div>
                      <div class="value">${escapedName}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email:</div>
                      <div class="value"><a href="mailto:${escapedEmail}">${escapedEmail}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">Message:</div>
                      <div class="value">${escapedMessage}</div>
                    </div>
                    <div class="footer">
                      <p>This message was sent from your portfolio contact form.</p>
                      <p>Sent at: ${new Date().toLocaleString()}</p>
                      <p>Request ID: ${requestId}</p>
                      <div class="alert">
                        <p><strong>Spam Analysis:</strong></p>
                        <p>Risk Level: <strong>${tier.toUpperCase()}</strong></p>
                        <p>Score: ${finalScore}/100</p>
                        ${spamCheck.signals.length > 0 ? `<p>Signals: ${spamCheck.signals.join(', ')}</p>` : '<p>No suspicious signals detected</p>'}
                        ${tier === 'high-risk' ? '<p style="color: #dc2626; font-weight: bold;">⚠️ HIGH-RISK: Manual review recommended</p>' : ''}
                        ${tier === 'suspicious' ? '<p style="color: #f59e0b; font-weight: bold;">⚠️ SUSPICIOUS: Monitor for patterns</p>' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        }),
        10000,
        'Email sending timeout'
      );
    };

    let emailResult;
    let emailSent = false;
    let emailId: string | undefined;

    try {
      emailResult = await retryWithBackoff(sendEmail, 3, 1000);
      const { data, error } = emailResult;

      if (error) {
        logger.error('Email sending error', {
          component: 'contactAPI',
          requestId,
          tier,
          error: error.message || 'Unknown',
        });
        emailSent = false;
      } else {
        emailSent = true;
        emailId = data?.id;
        
        logger.info('Email sent successfully', {
          component: 'contactAPI',
          requestId,
          emailId,
          tier,
          score: finalScore,
        });
      }
    } catch (error) {
      logger.error('Failed to send email after retries', {
        component: 'contactAPI',
        requestId,
        tier,
        error: error instanceof Error ? error.message : 'Unknown',
      });
      emailSent = false;
    }

    // Best-effort local backup for non-serverless environments.
    await storeSubmission({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      score: finalScore,
      tier,
      signals: spamCheck.signals,
      ip: ip !== 'unknown' ? ip : undefined,
      emailSent,
      emailId,
    });

    // If email failed, return error to user
    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: CONTACT_SERVICE_UNAVAILABLE_MESSAGE },
        { status: 503 }
      );
    }

    const duration = Date.now() - startTime;
    
    logger.info('Submission processed successfully', {
      component: 'contactAPI',
      requestId,
      tier,
      score: finalScore,
      duration,
      stored: true,
      emailSent: true,
    });
    
    return NextResponse.json(
      { success: true },
      { 
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error('Contact form error', {
      component: 'contactAPI',
      requestId,
      error: errorMessage,
      stack: errorStack,
    });
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;
    
    if (errorMessage.includes('timeout')) {
      userMessage = 'Request timeout. Please try again.';
      statusCode = 504;
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      userMessage = 'Network error. Please check your connection.';
      statusCode = 503;
    } else if (errorMessage.includes('parsing')) {
      userMessage = 'Invalid request format.';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { success: false, error: userMessage },
      { status: statusCode }
    );
  }
}

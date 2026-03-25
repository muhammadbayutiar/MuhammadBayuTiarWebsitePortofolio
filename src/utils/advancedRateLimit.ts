// Simple in-memory rate limiting.
// This is intentionally instance-local and should not be treated as distributed protection.

import { logger } from './logger';

// Rate limit configurations
const RATE_LIMITS = {
  perIP: {
    max: 3,
    window: 60 * 60 * 1000, // 1 hour
  },
  perEmail: {
    max: 5,
    window: 24 * 60 * 60 * 1000, // 24 hours
  },
  burst: {
    max: 2,
    window: 60 * 1000, // 1 minute
  },
};

// Fallback in-memory storage
interface RateLimitEntry {
  count: number;
  resetTime: number;
  timestamps: number[];
}

const fallbackStore = new Map<string, RateLimitEntry>();
let hasLoggedMemoryMode = false;

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of fallbackStore.entries()) {
    if (now > value.resetTime) {
      fallbackStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

cleanupTimer.unref?.();

function logMemoryMode() {
  if (!hasLoggedMemoryMode) {
    hasLoggedMemoryMode = true;
    logger.warn('Using in-memory rate limiting only', {
      component: 'advancedRateLimit',
      distributed: false,
    });
  }
}

function checkBurst(identifier: string): boolean {
  const key = `burst:${identifier}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMITS.burst.window;

  const entry = fallbackStore.get(key);
  if (!entry) {
    fallbackStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMITS.burst.window,
      timestamps: [now],
    });
    return true;
  }

  // Filter recent timestamps
  entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);
  entry.timestamps.push(now);
  entry.count = entry.timestamps.length;

  return entry.count <= RATE_LIMITS.burst.max;
}

// Check standard rate limit
async function checkStandardLimit(
  identifier: string,
  config: { max: number; window: number }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const entry = fallbackStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.window;
    fallbackStore.set(identifier, {
      count: 1,
      resetTime,
      timestamps: [now],
    });
    return { allowed: true, remaining: config.max - 1, resetTime };
  }

  if (entry.count >= config.max) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  fallbackStore.set(identifier, entry);
  return { allowed: true, remaining: config.max - entry.count, resetTime: entry.resetTime };
}

// Main rate limit check with all layers
export async function checkAdvancedRateLimit(
  ip: string,
  email?: string
): Promise<{
  allowed: boolean;
  reason?: string;
  remaining: number;
  resetTime: number;
}> {
  logMemoryMode();

  // Layer 1: Burst protection (fastest, most restrictive)
  const burstAllowed = checkBurst(ip);
  if (!burstAllowed) {
    logger.warn('Burst rate limit exceeded', {
      component: 'advancedRateLimit',
      ip: ip.substring(0, 10) + '...',
    });
    return {
      allowed: false,
      reason: 'Too many requests in short time',
      remaining: 0,
      resetTime: Date.now() + RATE_LIMITS.burst.window,
    };
  }

  // Layer 2: Per-IP rate limit
  const ipLimit = await checkStandardLimit(`ip:${ip}`, RATE_LIMITS.perIP);
  if (!ipLimit.allowed) {
    logger.warn('IP rate limit exceeded', {
      component: 'advancedRateLimit',
      ip: ip.substring(0, 10) + '...',
    });
    return {
      allowed: false,
      reason: 'Too many requests from this IP',
      remaining: 0,
      resetTime: ipLimit.resetTime,
    };
  }

  // Layer 3: Per-Email rate limit (if email provided)
  if (email) {
    const emailLimit = await checkStandardLimit(`email:${email}`, RATE_LIMITS.perEmail);
    if (!emailLimit.allowed) {
      logger.warn('Email rate limit exceeded', {
        component: 'advancedRateLimit',
        email: email.split('@')[0] + '@...', // Partial email for privacy
      });
      return {
        allowed: false,
        reason: 'Too many requests from this email',
        remaining: 0,
        resetTime: emailLimit.resetTime,
      };
    }
  }

  // All checks passed
  return {
    allowed: true,
    remaining: ipLimit.remaining,
    resetTime: ipLimit.resetTime,
  };
}

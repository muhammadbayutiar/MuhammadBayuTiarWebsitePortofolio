// PRODUCTION-GRADE validation with enhanced security

// Expanded disposable email list
const DISPOSABLE_EMAIL_DOMAINS = [
  'mailinator.com', 'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'maildrop.cc',
  'trashmail.com', 'yopmail.com', 'getnada.com', 'emailondeck.com',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
  'guerrillamail.de', 'spam4.me', 'mailnesia.com', 'mytemp.email',
  'mintemail.com', 'dispostable.com', 'trashmail.net', 'mohmal.com',
  'guerrillamailblock.com', 'spamgourmet.com', 'mailcatch.com',
];

// Suspicious patterns that might indicate attacks
const SUSPICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i, // Event handlers like onclick=
  /\bselect\b.*\bfrom\b/i, // SQL injection
  /\bunion\b.*\bselect\b/i,
  /\bdrop\b.*\btable\b/i,
  /\binsert\b.*\binto\b/i,
  /\bdelete\b.*\bfrom\b/i,
  /\bexec\b.*\(/i,
  /\beval\b.*\(/i,
];

// Maximum lengths to prevent DoS
const MAX_LENGTHS = {
  name: 100,
  email: 254, // RFC 5321 standard
  message: 5000,
};

export function isValidEmail(email: string): boolean {
  // More comprehensive email regex (RFC 5322 simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Additional checks
  const [localPart, domain] = email.split('@');
  
  // Local part shouldn't start or end with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  
  // Domain should have at least one dot
  if (!domain.includes('.')) {
    return false;
  }
  
  // Domain shouldn't start or end with hyphen
  if (domain.startsWith('-') || domain.endsWith('-')) {
    return false;
  }
  
  return true;
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

export function containsSuspiciousContent(text: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(text));
}

export function validateContactForm(data: {
  name: string;
  email: string;
  message: string;
}): { valid: boolean; error?: string } {
  // Type check
  if (typeof data.name !== 'string' || typeof data.email !== 'string' || typeof data.message !== 'string') {
    return { valid: false, error: 'Invalid input format' };
  }

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (data.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (data.name.length > MAX_LENGTHS.name) {
    return { valid: false, error: `Name must be less than ${MAX_LENGTHS.name} characters` };
  }

  // Check for suspicious content in name
  if (containsSuspiciousContent(data.name)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  if (data.email.length > MAX_LENGTHS.email) {
    return { valid: false, error: 'Email is too long' };
  }

  if (!isValidEmail(data.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (isDisposableEmail(data.email)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  // Validate message
  if (!data.message || data.message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }

  if (data.message.trim().length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' };
  }

  if (data.message.length > MAX_LENGTHS.message) {
    return { valid: false, error: `Message must be less than ${MAX_LENGTHS.message} characters` };
  }

  // Check for suspicious content in message
  if (containsSuspiciousContent(data.message)) {
    return { valid: false, error: 'Message contains invalid content' };
  }

  // Check for excessive URLs (spam indicator)
  const urlCount = (data.message.match(/https?:\/\//gi) || []).length;
  if (urlCount > 3) {
    return { valid: false, error: 'Message contains too many links' };
  }

  return { valid: true };
}

// Production-safe structured logging utility
// Sanitizes sensitive data and provides consistent log format

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

// Sensitive fields to redact
const SENSITIVE_FIELDS = ['password', 'token', 'apiKey', 'secret', 'authorization'];

function sanitizeData(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? sanitizeData(context) : {};

  const logEntry = {
    timestamp,
    level,
    message,
    ...(sanitizedContext as Record<string, unknown>),
  };

  // In production, this would go to a logging service (Datadog, Sentry, etc.)
  // For now, use console with structured format
  const logString = JSON.stringify(logEntry);

  switch (level) {
    case 'error':
      console.error(logString);
      break;
    case 'warn':
      console.warn(logString);
      break;
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(logString);
      }
      break;
    default:
      console.log(logString);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
};

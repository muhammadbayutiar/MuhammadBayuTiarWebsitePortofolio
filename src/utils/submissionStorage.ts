// Lightweight local backup storage for contact form submissions.
// This is best-effort only and is not relied on for production delivery.
//
// ⚠️ SERVERLESS WARNING:
// This file-based storage is NOT suitable for serverless environments (Vercel, AWS Lambda, etc.)
// where the filesystem is ephemeral and read-only in production.
//
// For serverless deployments, consider:
// - Database (PostgreSQL, MongoDB, Supabase)
// - External storage (S3, Google Cloud Storage)
// - Logging service (Datadog, Sentry)
//
// The contact API is designed to work even if storage fails (email still sends).

import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './logger';

export interface StoredSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  score: number;
  tier: 'safe' | 'suspicious' | 'high-risk';
  signals: string[];
  timestamp: string;
  ip?: string;
  emailSent: boolean;
  emailId?: string;
}

const STORAGE_DIR = path.join(process.cwd(), 'data');
const STORAGE_FILE = path.join(STORAGE_DIR, 'submissions.json');

// Check if we're in a serverless environment
function isServerlessEnvironment(): boolean {
  return !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.RAILWAY_ENVIRONMENT
  );
}

// Ensure storage directory exists
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    // In serverless, this will likely fail - that's expected
    if (isServerlessEnvironment()) {
      logger.warn('Storage directory creation failed (expected in serverless)', {
        component: 'submissionStorage',
        environment: 'serverless',
      });
    } else {
      logger.error('Failed to create storage directory', {
        component: 'submissionStorage',
        error: error instanceof Error ? error.message : 'Unknown',
      });
    }
    throw error;
  }
}

// Read all submissions from file.
async function readSubmissions(): Promise<StoredSubmission[]> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Validate structure
    if (!Array.isArray(parsed)) {
      logger.error('Submissions file is not an array', {
        component: 'submissionStorage',
      });
      return [];
    }
    
    return parsed;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    
    // File doesn't exist yet - this is normal
    if (err.code === 'ENOENT') {
      return [];
    }
    
    // In serverless, filesystem access will fail - this is expected
    if (isServerlessEnvironment() && (err.code === 'EROFS' || err.code === 'EACCES')) {
      logger.warn('File read failed in serverless environment (expected)', {
        component: 'submissionStorage',
        environment: 'serverless',
      });
      return [];
    }
    
    logger.error('Failed to read submissions file', {
      component: 'submissionStorage',
      error: error instanceof Error ? error.message : 'Unknown',
      code: err.code,
    });
    return [];
  }
}

// Write submissions to file.
async function writeSubmissions(submissions: StoredSubmission[]): Promise<void> {
  try {
    await ensureStorageDir();
    
    // Atomic write: write to temp file first, then rename
    const tempFile = `${STORAGE_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(submissions, null, 2), 'utf-8');
    await fs.rename(tempFile, STORAGE_FILE);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    
    // In serverless, filesystem writes will fail - this is expected
    if (isServerlessEnvironment() && (err.code === 'EROFS' || err.code === 'EACCES')) {
      logger.warn('File write failed in serverless environment (expected)', {
        component: 'submissionStorage',
        environment: 'serverless',
      });
      throw error;
    }
    
    logger.error('Failed to write submissions file', {
      component: 'submissionStorage',
      error: error instanceof Error ? error.message : 'Unknown',
      code: err.code,
    });
    throw error;
  }
}

// Store a new submission (CRITICAL: Does not throw - API continues even if storage fails)
export async function storeSubmission(submission: Omit<StoredSubmission, 'id' | 'timestamp'>): Promise<void> {
  try {
    if (isServerlessEnvironment()) {
      logger.warn('Skipping local submission storage in serverless environment', {
        component: 'submissionStorage',
        environment: 'serverless',
      });
      return;
    }

    const submissions = await readSubmissions();
    
    const newSubmission: StoredSubmission = {
      ...submission,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    submissions.push(newSubmission);
    
    await writeSubmissions(submissions);
    
    logger.info('Submission stored successfully', {
      component: 'submissionStorage',
      id: newSubmission.id,
      tier: newSubmission.tier,
      emailSent: newSubmission.emailSent,
    });
  } catch (error) {
    logger.error('Failed to store submission backup', {
      component: 'submissionStorage',
      error: error instanceof Error ? error.message : 'Unknown',
      tier: submission.tier,
      emailSent: submission.emailSent,
    });
  }
}

// Get all submissions (for admin review)
export async function getAllSubmissions(): Promise<StoredSubmission[]> {
  return readSubmissions();
}

// Get submissions by tier
export async function getSubmissionsByTier(tier: 'safe' | 'suspicious' | 'high-risk'): Promise<StoredSubmission[]> {
  const submissions = await readSubmissions();
  return submissions.filter(s => s.tier === tier);
}

// Get recent submissions (last N)
export async function getRecentSubmissions(count: number = 50): Promise<StoredSubmission[]> {
  const submissions = await readSubmissions();
  return submissions.slice(-count).reverse();
}

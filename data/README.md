# Contact Form Submissions Storage

This directory stores contact form submissions in JSON format for backup and review purposes.

## ⚠️ SERVERLESS WARNING

**This file-based storage is NOT compatible with serverless environments (Vercel, AWS Lambda, Netlify, etc.)**

Serverless platforms have:
- **Ephemeral filesystems** - Files are lost after each function execution
- **Read-only filesystems** - Cannot write to disk in production
- **No persistent storage** - Data does not persist between deployments

### For Serverless Deployments

The contact API is designed to work even if storage fails:
- ✅ Emails are still sent successfully
- ✅ Submissions are logged (viewable in platform logs)
- ✅ No API errors occur

### Recommended Alternatives for Production

For persistent storage in serverless environments, use:

1. **Database Solutions:**
   - PostgreSQL (Vercel Postgres, Supabase)
   - MongoDB (MongoDB Atlas)
   - MySQL (PlanetScale)

2. **External Storage:**
   - AWS S3
   - Google Cloud Storage
   - Cloudflare R2

3. **Logging Services:**
   - Datadog
   - Sentry
   - LogRocket

## File Structure

- `submissions.json` - All contact form submissions with metadata (local development only)

## Submission Format

Each submission contains:
- `id` - Unique identifier
- `name` - Sender's name
- `email` - Sender's email
- `message` - Message content
- `score` - Spam detection score (0-100)
- `tier` - Risk level: 'safe', 'suspicious', or 'high-risk'
- `signals` - Array of detected spam signals
- `timestamp` - ISO 8601 timestamp
- `ip` - Client IP address (optional)
- `emailSent` - Whether email was successfully sent
- `emailId` - Resend email ID (if sent)

## Security

⚠️ **IMPORTANT**: This file contains user data and should NEVER be committed to version control.

The `submissions.json` file is automatically added to `.gitignore`.

## Usage

### Local Development

Submissions are automatically stored by the contact API route. No manual intervention required.

### Production (Serverless)

File storage will fail gracefully. Emails will still be sent. Consider implementing a database solution for persistent storage.

### Manual Review

For manual review or admin access in local development, you can:
- Read the file directly
- Use utility functions in `src/utils/submissionStorage.ts`

```typescript
import { getAllSubmissions, getSubmissionsByTier } from '@/utils/submissionStorage';

// Get all submissions
const all = await getAllSubmissions();

// Get only high-risk submissions
const highRisk = await getSubmissionsByTier('high-risk');
```

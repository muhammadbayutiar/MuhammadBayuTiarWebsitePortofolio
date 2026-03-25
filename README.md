# Elite Portfolio

Personal portfolio site built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## What is included

- Landing page with animated sections and a 4.5 second loading screen
- Projects listing and project detail pages
- Contact form backed by a Next.js API route and Resend
- Local in-memory rate limiting for the contact endpoint
- Static media served from `public/`

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Resend

## Requirements

- Node.js 18+
- npm

## Environment variables

Create `.env.local` from `.env.example`.

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
RESEND_API_KEY=re_your_api_key_here
```

Notes:

- `NEXT_PUBLIC_SITE_URL` should be the deployed site origin used for metadata.
- `RESEND_API_KEY` is required if you want the contact form to send email in production.
- If `RESEND_API_KEY` is missing, the contact API responds with a service-unavailable error instead of crashing.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run lint
npm run build
```

## Deploy

This project is set up for Vercel, but it can run anywhere that supports Next.js.

Before deployment:

1. Set `NEXT_PUBLIC_SITE_URL`
2. Set `RESEND_API_KEY` if the contact form should be active
3. Verify all required media files in `public/` are committed

## Project structure

```text
src/
  app/
    api/contact/
    projects/
  components/
  data/
  utils/
public/
data/
```

## Contact form behavior

- Success is returned only after email delivery succeeds
- Failed delivery returns an error response to the frontend
- Local JSON backup storage is best-effort only and is skipped in serverless environments
- Rate limiting is instance-local in memory and should not be treated as distributed protection

# OpenCourseMap

OpenCourseMap is a Next.js + Supabase MVP for discovering only free-to-enroll AI learning resources and tracking progress centrally after users enroll on provider sites.

## Included in this scaffold

- Next.js App Router project structure
- public catalog pages
- protected dashboard, recommendations, profile, and my-courses pages
- admin pages for ingestion review and resources
- matching API route handlers
- deterministic recommendation and skill-gap logic
- ingestion adapter interfaces and demo connectors
- Supabase schema migration, RLS policies, seed data, and edge-function stubs
- Vitest and Playwright configuration with initial tests

## Local run

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in Supabase values if available.
3. Start the app:
   `npm run dev`

Without Supabase env vars, the app runs against demo data from `lib/db/demo-data.ts`.

## Verification

Run:

- `npm run typecheck`
- `npm run test`
- `npm run lint`
- `npm run test:e2e`

## Supabase migration and seed

If you have the Supabase CLI installed:

1. `supabase db reset`
2. `psql "$SUPABASE_DB_URL" -f supabase/seed.sql`

Or copy the files into the Supabase SQL editor in order:

1. `supabase/migrations/202603151230_initial_schema.sql`
2. `supabase/seed.sql`

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Set the environment variables from `.env.example`.
3. Deploy the Next.js app.

### Supabase

1. Create a project.
2. Enable Google and email/password auth.
3. Apply the migration and seed files.
4. Deploy edge functions from `supabase/functions/`.
5. Schedule ingestion and recompute jobs using Supabase Cron.

## Future improvements

- replace demo repository calls with live Supabase queries
- persist admin candidate approval into `resources` and `courses`
- add file uploads for completion evidence
- add proper auth actions and session-aware middleware
- deepen E2E coverage once OAuth is live

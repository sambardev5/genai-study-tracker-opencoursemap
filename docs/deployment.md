# Deployment

## Frontend

Deploy the Next.js app to Vercel Hobby.

Required env vars:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, or `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `CRON_SECRET`
- `ADMIN_EMAILS`

The auth routes are server-backed, so production login works with either env naming scheme. `NEXT_PUBLIC_*` is only needed if you later add direct browser-side Supabase usage.

## Backend

Provision Supabase and apply:

1. `supabase/migrations/202603151230_initial_schema.sql`
2. `supabase/seed.sql`

Then configure:

- Google OAuth in Supabase Auth
- email/password auth
- Supabase Auth redirect URLs:
  - `https://genaicoursepath.com/auth/callback`
  - `https://www.genaicoursepath.com/auth/callback`
  - `http://localhost:3000/auth/callback`
- edge functions for ingestion and recomputation
- scheduled jobs that call the edge functions with `CRON_SECRET`

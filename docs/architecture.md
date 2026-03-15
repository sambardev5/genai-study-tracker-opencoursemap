# Architecture

OpenCourseMap is structured as a single Next.js repository with three layers:

1. `app/` contains App Router pages and route handlers.
2. `lib/` contains domain types, validation, recommendation logic, ingestion adapters, and a repository abstraction.
3. `supabase/` contains SQL migrations, seed data, and edge-function placeholders for ingestion and recomputation jobs.

The repository currently runs in demo mode from `lib/db/demo-data.ts` when Supabase env vars are absent. That keeps the workspace runnable locally before infrastructure is provisioned. Once Supabase is connected, the repository layer is the seam to replace demo-backed reads and writes with real database calls.

# Codex-Ready Implementation Prompt

Build a production-quality MVP web application called **OpenCourseMap**.

## Product goal
A free public website that helps users discover **only free-to-enroll learning resources** for:
- LLM
- SLM
- MCP
- Generative AI
- Machine Learning
- related subtopics

The platform must:
1. Aggregate free course/resource URLs from approved web sources.
2. Let users sign up with Google or email/password.
3. Let users open the provider link to register/enroll on the provider site.
4. Let users track their own progress centrally inside our app.
5. Show recommended learning paths from beginner to advanced/professional.
6. Show dashboards for completion metrics, topic coverage, and skill gaps.
7. Be deployable on free-tier infrastructure for MVP.

---

## Important product constraints
- Do **not** promise automatic enrollment or automatic completion sync from third-party learning providers unless an official API exists for that provider.
- Use our app as the **system of record** for enrollment/progress/completion status.
- The app may store:
  - `not_started`
  - `bookmarked`
  - `enrolled_external`
  - `in_progress`
  - `completed`
  - optional `completion_evidence_url`
  - optional `completion_notes`
- Discovery must use an **allowlist of sources** and respect provider Terms and robots.txt.
- Prioritize structured metadata when available, especially **Schema.org Course/CourseInstance**.
- Only list resources that are **free to access or free to sign up** at the time of ingestion.
- If a resource later becomes paid, mark it inactive rather than deleting history.

---

## Required tech stack
Use this stack unless there is a compelling engineering reason not to:

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** for UI primitives
- **Recharts** for dashboard charts

### Backend
- **Supabase**
  - Postgres database
  - Supabase Auth
  - Row Level Security (RLS)
  - Storage (optional, only for screenshots/evidence uploads)
  - Edge Functions for ingestion or verification jobs when needed
  - pg_cron / Supabase Cron for scheduled refresh jobs

### Deployment
- Frontend on **Vercel Hobby**
- Backend on **Supabase free tier**

### Auth
- Google OAuth
- Email/password auth

### Testing
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E: Playwright

### Observability
- Basic structured logs
- Error boundaries
- Optional Sentry integration behind env flag

---

## Why this stack
Use these facts as grounding for implementation decisions:
- Next.js supports the App Router and is designed for deployment on Vercel; Vercel states you can start for free. citeturn865130search4turn865130search16
- Supabase Auth supports password and social login methods, including Google OAuth. citeturn865130search1turn865130search17
- Supabase provides official guidance for using Auth with Next.js App Router. citeturn865130search13
- Supabase Cron is backed by Postgres scheduling and can run recurring jobs. citeturn865130search6turn865130search10turn865130search22
- Schema.org defines `Course`, `CourseInstance`, and related properties like `courseMode`, which can support course metadata extraction. citeturn865130search7turn865130search3turn865130search15turn865130search23

---

## Core MVP capabilities

### 1) Public discovery experience
- Landing page with value proposition
- Search bar
- Filters:
  - topic
  - level (beginner/intermediate/advanced)
  - provider
  - language
  - duration bucket
  - free certificate available (boolean/unknown)
  - self-paced/live/cohort if known
- Course detail pages
- Topic pages for LLM, SLM, MCP, Generative AI, ML, prompt engineering, RAG, vector databases, fine-tuning, AI agents, evaluation, MLOps, responsible AI, statistics, Python foundations

### 2) User accounts
- Sign up with Google
- Sign up with email/password
- Sign in / sign out
- Profile page
- User preferences:
  - learning goals
  - skill level
  - weekly study hours
  - preferred topics
  - preferred providers

### 3) Learning tracker
Users can:
- bookmark a course
- mark as enrolled on provider site
- mark in progress
- mark completed
- add completion notes
- add completion evidence URL or optional uploaded proof
- manually add completion date

### 4) Recommendations engine
Provide recommendations based on:
- selected goal
- current level
- topics already completed
- prerequisite graph
- missing foundational topics

Learning paths should support levels:
- basic
- amateur
- professional

Use a rule-based engine for MVP, not ML.

### 5) Dashboards
For each user show:
- total courses saved
- total started
- total completed
- completion rate
- study hours estimate
- topic breakdown chart
- provider breakdown chart
- level progression chart
- skill gap matrix
- “next best courses” recommendations

### 6) Admin / content ops
- Admin-only dashboard
- trigger ingestion run
- review pending resources
- approve/reject resources
- mark source as inactive
- inspect verification failures
- reclassify topics/levels

---

## Non-goals for MVP
- No automatic scraping of arbitrary websites.
- No browser automation for signing users up on third-party platforms.
- No claims of universal certificate verification.
- No social network/community features in MVP.
- No payment system.
- No mobile app.

---

## Allowed source ingestion model
Implement ingestion using a **source registry** with explicit connectors.

### Source registry table should support
- source name
- homepage URL
- source type (`rss`, `sitemap`, `api`, `manual`, `html_allowlisted`)
- robots/terms checked flag
- enabled flag
- fetch cadence
- parser strategy
- last successful fetch
- notes

### Ingestion strategies
1. **Manual curation**
   - admin enters course URL and metadata
2. **RSS or sitemap ingestion**
   - parse structured pages from allowlisted sites
3. **Structured metadata extraction**
   - JSON-LD / Microdata / OpenGraph / canonical metadata
4. **Provider-specific API connector** when official API exists
5. **HTML parsing on allowlisted pages only**
   - only if permitted

### Verification step
Each discovered resource must go through a verification pipeline:
- URL reachable
- canonical URL extracted
- title present
- topic assigned
- free-access status confirmed
- provider extracted
- duplicate detection passed
- human review if confidence below threshold

---

## Data model requirements
Design the database so it is normalized enough for maintainability but still practical.

Use UUID primary keys.
Use `created_at` and `updated_at` timestamps everywhere.
Use soft deletion where needed (`is_active`, `archived_at`).

### Main entities
- profiles
- auth identities handled by Supabase Auth
- providers
- sources
- source_runs
- resources (generic record for course/article/tutorial if we ever extend)
- courses (course-specific fields)
- topics
- course_topics
- learning_paths
- learning_path_items
- user_course_status
- user_topic_progress
- user_preferences
- recommendations_cache
- ingestion_candidates
- ingestion_issues
- skill_definitions
- course_skills
- user_skill_gaps

---

## SQL schema
Generate SQL migration files for the following schema.

```sql
-- Enable extensions as needed
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  headline text,
  current_level text check (current_level in ('basic','amateur','professional')),
  weekly_study_hours integer check (weekly_study_hours >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Providers
create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  website_url text,
  logo_url text,
  provider_type text check (provider_type in ('mooc','university','community','docs','video','other')) default 'other',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sources
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.providers(id) on delete set null,
  name text not null,
  base_url text not null,
  source_type text not null check (source_type in ('rss','sitemap','api','manual','html_allowlisted')),
  parser_key text not null,
  cadence text default 'daily',
  terms_reviewed boolean not null default false,
  robots_reviewed boolean not null default false,
  enabled boolean not null default true,
  last_success_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(name, base_url)
);

-- Source runs
create table if not exists public.source_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  status text not null check (status in ('queued','running','succeeded','failed','partial')),
  started_at timestamptz,
  finished_at timestamptz,
  discovered_count integer not null default 0,
  inserted_count integer not null default 0,
  updated_count integer not null default 0,
  rejected_count integer not null default 0,
  error_summary text,
  created_at timestamptz not null default now()
);

-- Topics
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text,
  parent_topic_id uuid references public.topics(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Skills
create table if not exists public.skill_definitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text,
  topic_id uuid references public.topics(id) on delete set null,
  level_hint text check (level_hint in ('basic','amateur','professional')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Resources
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null check (resource_type in ('course','tutorial','docs','video','path')) default 'course',
  provider_id uuid references public.providers(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  canonical_url text not null unique,
  title text not null,
  summary text,
  image_url text,
  language_code text,
  difficulty text check (difficulty in ('basic','amateur','professional','unknown')) default 'unknown',
  duration_hours numeric(6,2),
  is_free boolean not null default true,
  free_verification_status text not null check (free_verification_status in ('verified','suspected','unknown','expired')) default 'unknown',
  free_verified_at timestamptz,
  is_active boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Courses
create table if not exists public.courses (
  resource_id uuid primary key references public.resources(id) on delete cascade,
  external_course_id text,
  enrollment_url text not null,
  instructor_name text,
  course_mode text,
  has_certificate boolean,
  certificate_is_free boolean,
  prerequisite_text text,
  syllabus text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Course topics
create table if not exists public.course_topics (
  course_id uuid not null references public.courses(resource_id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (course_id, topic_id)
);

-- Course skills
create table if not exists public.course_skills (
  course_id uuid not null references public.courses(resource_id) on delete cascade,
  skill_id uuid not null references public.skill_definitions(id) on delete cascade,
  strength numeric(4,2) not null default 1.0,
  created_at timestamptz not null default now(),
  primary key (course_id, skill_id)
);

-- Learning paths
create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  target_level text not null check (target_level in ('basic','amateur','professional')),
  topic_id uuid references public.topics(id) on delete set null,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_path_items (
  id uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references public.learning_paths(id) on delete cascade,
  course_id uuid not null references public.courses(resource_id) on delete cascade,
  sequence_no integer not null,
  is_required boolean not null default true,
  rationale text,
  created_at timestamptz not null default now(),
  unique (learning_path_id, sequence_no),
  unique (learning_path_id, course_id)
);

-- User preferences
create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  goal_text text,
  preferred_level text check (preferred_level in ('basic','amateur','professional')),
  preferred_language_code text,
  wants_certificates boolean,
  prefers_self_paced boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User course status
create table if not exists public.user_course_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(resource_id) on delete cascade,
  status text not null check (status in ('not_started','bookmarked','enrolled_external','in_progress','completed')),
  percent_complete integer check (percent_complete between 0 and 100),
  enrolled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  completion_evidence_url text,
  completion_notes text,
  hours_spent numeric(6,2),
  rating integer check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- User topic progress (materialized/cache-like table maintained by jobs)
create table if not exists public.user_topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  completed_courses integer not null default 0,
  in_progress_courses integer not null default 0,
  total_hours numeric(8,2) not null default 0,
  proficiency_score numeric(6,2) not null default 0,
  gap_score numeric(6,2) not null default 0,
  calculated_at timestamptz not null default now(),
  unique (user_id, topic_id)
);

-- User skill gaps
create table if not exists public.user_skill_gaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skill_definitions(id) on delete cascade,
  coverage_score numeric(6,2) not null default 0,
  gap_score numeric(6,2) not null default 0,
  recommended_course_id uuid references public.courses(resource_id) on delete set null,
  calculated_at timestamptz not null default now(),
  unique (user_id, skill_id)
);

-- Recommendations cache
create table if not exists public.recommendations_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  context_hash text not null,
  recommendation_json jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, context_hash)
);

-- Ingestion candidates
create table if not exists public.ingestion_candidates (
  id uuid primary key default gen_random_uuid(),
  source_run_id uuid references public.source_runs(id) on delete set null,
  discovered_url text not null,
  canonical_url text,
  title text,
  metadata jsonb,
  parse_status text not null check (parse_status in ('new','parsed','rejected','needs_review','approved')) default 'new',
  rejection_reason text,
  confidence_score numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ingestion issues
create table if not exists public.ingestion_issues (
  id uuid primary key default gen_random_uuid(),
  source_run_id uuid references public.source_runs(id) on delete set null,
  candidate_id uuid references public.ingestion_candidates(id) on delete set null,
  issue_type text not null,
  severity text not null check (severity in ('info','warn','error')),
  message text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_resources_title_trgm on public.resources using gin (title gin_trgm_ops);
create index if not exists idx_resources_summary_trgm on public.resources using gin (summary gin_trgm_ops);
create index if not exists idx_resources_provider on public.resources(provider_id);
create index if not exists idx_resources_active_free on public.resources(is_active, is_free, difficulty);
create index if not exists idx_courses_enrollment_url on public.courses(enrollment_url);
create index if not exists idx_user_course_status_user on public.user_course_status(user_id, status);
create index if not exists idx_course_topics_topic on public.course_topics(topic_id);
create index if not exists idx_course_skills_skill on public.course_skills(skill_id);
```

---

## Required Row Level Security
Enable RLS on every user-owned table.

### Public-readable tables
Anyone can read:
- providers
- topics
- resources where `is_active = true` and `is_free = true`
- courses for active/free resources
- course_topics
- learning_paths where `is_published = true`
- learning_path_items for published paths

### User-private tables
A user can only access their own rows in:
- profiles (own row update/read)
- user_preferences
- user_course_status
- user_topic_progress
- user_skill_gaps
- recommendations_cache

### Admin-restricted tables
Only service role / admin users:
- sources
- source_runs
- ingestion_candidates
- ingestion_issues
- unpublished learning_paths

Use either a `profiles.is_admin boolean` or a dedicated role claim in JWT. Prefer claim-based check if implemented cleanly.

---

## API design
Use Next.js Route Handlers for the web app API surface. Use Supabase server client in route handlers.

### Public APIs
#### `GET /api/topics`
Returns active topics.

#### `GET /api/courses`
Query params:
- `q`
- `topic`
- `provider`
- `level`
- `language`
- `duration_bucket`
- `certificate`
- `mode`
- `page`
- `page_size`
- `sort` (`relevance`, `newest`, `duration_asc`, `duration_desc`, `popular`)

Response:
```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 0,
    "total_pages": 0
  },
  "facets": {
    "providers": [],
    "levels": [],
    "topics": []
  }
}
```

#### `GET /api/courses/:id`
Returns full course detail including related topics and recommended next courses.

#### `GET /api/learning-paths`
Returns published learning paths.

#### `GET /api/learning-paths/:slug`
Returns path details and ordered items.

### Authenticated user APIs
#### `GET /api/me`
Return profile + preferences summary.

#### `PATCH /api/me`
Update profile fields.

#### `GET /api/me/course-status`
Return all user statuses with optional filters.

#### `PUT /api/me/course-status/:courseId`
Upsert user course status.

Request body:
```json
{
  "status": "in_progress",
  "percent_complete": 45,
  "hours_spent": 5.5,
  "completion_notes": "Finished modules 1-3"
}
```

#### `GET /api/me/dashboard`
Return aggregated metrics for charts.

Response shape:
```json
{
  "summary": {
    "saved": 0,
    "started": 0,
    "completed": 0,
    "completion_rate": 0
  },
  "topic_breakdown": [],
  "provider_breakdown": [],
  "level_breakdown": [],
  "skill_gaps": [],
  "recommended_next": []
}
```

#### `GET /api/me/recommendations`
Return recommended courses and/or paths.

#### `PATCH /api/me/preferences`
Update user preferences.

### Admin APIs
#### `POST /api/admin/ingestion/run`
Trigger a source run.

#### `GET /api/admin/ingestion/candidates`
List candidates needing review.

#### `POST /api/admin/ingestion/candidates/:id/approve`
Approve candidate and convert to resource/course.

#### `POST /api/admin/ingestion/candidates/:id/reject`
Reject candidate with reason.

#### `PATCH /api/admin/resources/:id`
Admin updates metadata.

---

## Recommendation engine specification
Implement a deterministic rules engine.

### Inputs
- user preferred level
- goal text
- completed topics
- in-progress topics
- missing prerequisite topics
- available weekly study hours
- preferred providers/language

### Logic
1. Determine user baseline level.
2. Compute covered topics using completed courses.
3. Identify missing prerequisites for target topics.
4. Rank courses using weighted score:
   - topic match: 35%
   - level fit: 20%
   - prerequisite coverage improvement: 20%
   - provider preference: 10%
   - shorter duration bonus: 5%
   - certificate preference: 5%
   - freshness/free verification recency: 5%
5. Exclude already completed courses.
6. Prefer free-verified active courses.

### Skill gap algorithm (MVP)
For each target skill:
- sum course skill strengths for completed courses
- normalize score to 0..100
- derive gap score = `100 - coverage_score`
- recommend 1–3 courses with strongest alignment to missing skills

---

## Dashboard specification
Create the following charts with Recharts:
- Pie chart: course status distribution
- Bar chart: completed courses by topic
- Bar chart: courses by provider
- Line/area chart: completions over time
- Radar chart or horizontal bars: skill gap coverage

Also include KPI cards:
- total completed
- active in progress
- hours invested
- strongest topic
- weakest topic
- next recommended learning path

---

## UX requirements

### Public pages
- `/`
- `/courses`
- `/courses/[id]`
- `/topics/[slug]`
- `/paths`
- `/paths/[slug]`
- `/about`

### Auth pages
- `/login`
- `/signup`

### Authenticated pages
- `/dashboard`
- `/my-courses`
- `/recommendations`
- `/profile`

### Admin pages
- `/admin`
- `/admin/ingestion`
- `/admin/resources`

### UX notes
- Clear disclosure: “Enrollment happens on the provider website; progress tracking happens here.”
- Show “Verified free on <date>” badge where applicable.
- Show “Needs re-verification” badge if verification is stale.
- Provide quick actions on cards: Save, Mark Enrolled, Mark In Progress, Mark Completed.
- Ensure accessibility basics: semantic HTML, keyboard nav, labels, contrast.

---

## Search and filtering behavior
Use Postgres search + trigram for MVP.

Search ranking should prioritize:
1. exact title matches
2. title similarity
3. summary similarity
4. topic match
5. free verified recency

Pagination should be server-side.
Use stable sort ordering.

---

## Ingestion pipeline implementation details
Implement an ingestion framework with provider adapters.

### Adapter interface
Create an abstraction like:
```ts
export interface SourceAdapter {
  fetchCandidates(source: SourceConfig): Promise<RawCandidate[]>;
  parseCandidate(candidate: RawCandidate): Promise<ParsedCourseCandidate | ParsedRejection>;
  verifyCandidate(candidate: ParsedCourseCandidate): Promise<VerificationResult>;
}
```

### Initial adapters
- `manualAdapter`
- `rssAdapter`
- `sitemapAdapter`
- `htmlAllowlistedAdapter`

### Verification checks
- URL returns 200/30x
- canonical URL normalized
- content not obviously paid-only
- page contains course-like metadata
- topic classifier returns at least one topic
- duplicate title/url check

### Topic classification for MVP
Use deterministic keyword mapping with admin review fallback.
Example:
- “rag”, “retrieval augmented generation” -> RAG
- “prompt engineering” -> Prompt Engineering
- “model context protocol”, “mcp” -> MCP
- “small language model”, “slm” -> SLM

Do not claim semantic AI classification unless actually implemented.

---

## Repository structure
Use a monorepo or single repo. For MVP, use a single repo with clear folders.

```text
opencoursemap/
  app/
    (public)/
      page.tsx
      courses/
        page.tsx
        [id]/page.tsx
      topics/
        [slug]/page.tsx
      paths/
        page.tsx
        [slug]/page.tsx
      about/page.tsx
    (auth)/
      login/page.tsx
      signup/page.tsx
    (protected)/
      dashboard/page.tsx
      my-courses/page.tsx
      recommendations/page.tsx
      profile/page.tsx
    admin/
      page.tsx
      ingestion/page.tsx
      resources/page.tsx
    api/
      topics/route.ts
      courses/route.ts
      courses/[id]/route.ts
      learning-paths/route.ts
      learning-paths/[slug]/route.ts
      me/route.ts
      me/preferences/route.ts
      me/course-status/route.ts
      me/course-status/[courseId]/route.ts
      me/dashboard/route.ts
      me/recommendations/route.ts
      admin/ingestion/run/route.ts
      admin/ingestion/candidates/route.ts
      admin/ingestion/candidates/[id]/approve/route.ts
      admin/ingestion/candidates/[id]/reject/route.ts
      admin/resources/[id]/route.ts
  components/
    ui/
    layout/
    courses/
    dashboard/
    recommendations/
    admin/
  lib/
    auth/
    db/
    supabase/
    validators/
    search/
    recommendations/
    ingestion/
      adapters/
      parsers/
      classifiers/
      verifiers/
    utils/
  supabase/
    migrations/
    seed.sql
    functions/
      ingestion-run/
      verify-resources/
      recompute-user-progress/
  tests/
    unit/
    integration/
    e2e/
  public/
  styles/
  docs/
    architecture.md
    api.md
    ingestion.md
    deployment.md
  package.json
  tsconfig.json
  tailwind.config.ts
  components.json
  middleware.ts
  .env.example
  README.md
```

---

## Required environment variables
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CRON_SECRET=
ADMIN_EMAILS=
SENTRY_DSN=
```

If using Supabase-hosted OAuth only, do not separately wire custom Google OAuth unless needed. Prefer the simplest secure path.

---

## Security requirements
- Use Supabase Auth session handling compatible with Next.js App Router.
- Validate all write requests with Zod.
- Enforce RLS for all user data.
- Use server-side authorization checks for admin routes.
- Never expose service role key to the client.
- Sanitize or escape untrusted rich text.
- Rate limit admin ingestion endpoints if possible.
- Log admin content changes.

---

## Performance requirements
- Use SSR/ISR appropriately for public discovery pages.
- Cache topic/provider facets.
- Paginate all list endpoints.
- Use database-side filtering/sorting.
- Avoid N+1 queries.
- Lazy load charts below the fold if helpful.

---

## SEO requirements
- Metadata for landing, courses, topics, and paths pages.
- Open Graph tags.
- Structured data where relevant.
- Sitemap generation.
- Robots configuration.
- Clean slugs for topics and learning paths.

---

## Testing requirements

### Unit tests
- recommendation scoring
- topic classification
- duration bucketing
- search param parsing
- permissions helpers

### Integration tests
- authenticated status upsert flow
- dashboard aggregation query
- admin candidate approval flow

### E2E tests
- sign up / sign in
- browse courses
- save course
- mark course complete
- view dashboard charts
- admin approves a candidate

---

## Seed data requirements
Seed the DB with:
- core topics:
  - llm
  - slm
  - mcp
  - generative-ai
  - machine-learning
  - prompt-engineering
  - rag
  - vector-databases
  - ai-agents
  - fine-tuning
  - evaluation
  - mlops
  - responsible-ai
  - python-foundations
  - statistics
- 3 demo providers
- 2 sample learning paths:
  - “Generative AI Foundations”
  - “Professional LLM Engineer Path”
- 10–20 sample courses flagged as demo data

---

## Implementation phases / build tasks

### Phase 0 — Project bootstrap
1. Create Next.js app with TypeScript and App Router.
2. Install Tailwind, shadcn/ui, Recharts, Zod, Supabase client packages.
3. Configure linting, formatting, test framework, Playwright.
4. Create `.env.example`.
5. Add README with local setup.

### Phase 1 — Database and auth
1. Create Supabase project.
2. Add SQL migrations for all schema above.
3. Enable RLS.
4. Write RLS policies.
5. Configure auth providers:
   - Google
   - email/password
6. Create profile auto-provision trigger on `auth.users` insert.
7. Seed topics/providers/demo data.

### Phase 2 — Public catalog
1. Build landing page.
2. Build `/courses` page with filters and pagination.
3. Build course detail page.
4. Build topic pages.
5. Build learning path pages.
6. Implement API routes for public data.
7. Add SEO metadata and sitemap.

### Phase 3 — User tracking
1. Build login/signup flows.
2. Build dashboard shell.
3. Build `my-courses` page.
4. Implement course status upsert API.
5. Add bookmark / enrolled / in-progress / completed actions.
6. Create dashboard aggregation query and charts.

### Phase 4 — Recommendations and skill gaps
1. Implement rule-based recommendation engine.
2. Implement prerequisite/topic coverage logic.
3. Create `user_topic_progress` recompute job.
4. Create `user_skill_gaps` recompute job.
5. Build recommendations page.

### Phase 5 — Ingestion admin
1. Build source registry admin views.
2. Implement adapter interface.
3. Implement manual + RSS + sitemap adapters.
4. Implement candidate review UI.
5. Add approval/rejection flows.
6. Add scheduled verification job.

### Phase 6 — Hardening and deploy
1. Add tests.
2. Improve empty states/error states.
3. Add analytics/logging.
4. Configure Vercel deployment.
5. Configure Supabase scheduled jobs.
6. Run Lighthouse/accessibility pass.

---

## Example acceptance criteria

### Public catalog
- A visitor can search and filter free courses.
- Course cards display provider, level, duration, and free verification status.

### Auth
- A user can create an account with Google or email/password.
- A returning user can sign in and access their dashboard.

### Tracking
- A signed-in user can mark a course as bookmarked, enrolled, in progress, or completed.
- The dashboard updates accordingly.

### Recommendations
- A signed-in user sees at least 5 recommendations based on level and progress.
- Recommendations exclude courses already completed.

### Admin
- An admin can review discovered candidates and approve one into the public catalog.

---

## Nice-to-have post-MVP features
Do not build these until MVP is complete:
- browser extension for one-click save
- AI-generated path explanations
- export progress to PDF
- email reminders
- community reviews
- multi-language UI
- certificate OCR parsing
- provider API sync for providers that officially support it

---

## Code quality expectations
- Strong TypeScript types
- Zod schemas for request validation
- Reusable server/data access layer
- No hardcoded secrets
- Clear comments only where necessary
- Keep components modular
- Prefer server components where appropriate
- Use client components only when interactive state is needed

---

## Deliverables expected from Codex
Produce the following in order:
1. Full repository scaffold.
2. SQL migrations and seed files.
3. Supabase auth/profile provisioning setup.
4. Public catalog pages and APIs.
5. User tracking APIs and pages.
6. Recommendation engine.
7. Admin ingestion flows.
8. Tests.
9. Deployment instructions.

At the end, include:
- local run steps
- migration commands
- seed commands
- deployment steps for Vercel + Supabase
- list of future improvements


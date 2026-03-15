create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  headline text,
  current_level text check (current_level in ('basic','amateur','professional')) default 'basic',
  weekly_study_hours integer check (weekly_study_hours >= 0) default 0,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  unique (name, base_url)
);

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

create table if not exists public.course_topics (
  course_id uuid not null references public.courses(resource_id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (course_id, topic_id)
);

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

create table if not exists public.course_skills (
  course_id uuid not null references public.courses(resource_id) on delete cascade,
  skill_id uuid not null references public.skill_definitions(id) on delete cascade,
  strength numeric(4,2) not null default 1.0,
  created_at timestamptz not null default now(),
  primary key (course_id, skill_id)
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  goal_text text,
  preferred_level text check (preferred_level in ('basic','amateur','professional')),
  preferred_language_code text,
  wants_certificates boolean default false,
  prefers_self_paced boolean default true,
  preferred_topic_ids uuid[] not null default '{}',
  preferred_provider_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists public.recommendations_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  context_hash text not null,
  recommendation_json jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, context_hash)
);

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

create index if not exists idx_resources_title_trgm on public.resources using gin (title gin_trgm_ops);
create index if not exists idx_resources_summary_trgm on public.resources using gin (summary gin_trgm_ops);
create index if not exists idx_resources_provider on public.resources(provider_id);
create index if not exists idx_resources_active_free on public.resources(is_active, is_free, difficulty);
create index if not exists idx_courses_enrollment_url on public.courses(enrollment_url);
create index if not exists idx_user_course_status_user on public.user_course_status(user_id, status);
create index if not exists idx_course_topics_topic on public.course_topics(topic_id);
create index if not exists idx_course_skills_skill on public.course_skills(skill_id);

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'providers',
    'sources',
    'topics',
    'skill_definitions',
    'resources',
    'courses',
    'learning_paths',
    'user_preferences',
    'user_course_status',
    'ingestion_candidates'
  ]
  loop
    execute format('drop trigger if exists %I_touch_updated_at on public.%I', table_name, table_name);
    execute format('create trigger %I_touch_updated_at before update on public.%I for each row execute procedure public.touch_updated_at()', table_name, table_name);
  end loop;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.sources enable row level security;
alter table public.source_runs enable row level security;
alter table public.topics enable row level security;
alter table public.skill_definitions enable row level security;
alter table public.resources enable row level security;
alter table public.courses enable row level security;
alter table public.course_topics enable row level security;
alter table public.learning_paths enable row level security;
alter table public.learning_path_items enable row level security;
alter table public.course_skills enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_course_status enable row level security;
alter table public.user_topic_progress enable row level security;
alter table public.user_skill_gaps enable row level security;
alter table public.recommendations_cache enable row level security;
alter table public.ingestion_candidates enable row level security;
alter table public.ingestion_issues enable row level security;

create policy "public read providers"
on public.providers for select
using (is_active = true);

create policy "public read topics"
on public.topics for select
using (is_active = true);

create policy "public read skills"
on public.skill_definitions for select
using (true);

create policy "public read resources"
on public.resources for select
using (is_active = true and is_free = true);

create policy "public read courses"
on public.courses for select
using (
  exists (
    select 1
    from public.resources
    where resources.id = courses.resource_id
      and resources.is_active = true
      and resources.is_free = true
  )
);

create policy "public read course topics"
on public.course_topics for select
using (true);

create policy "public read course skills"
on public.course_skills for select
using (true);

create policy "public read published paths"
on public.learning_paths for select
using (is_published = true or public.is_admin());

create policy "public read published path items"
on public.learning_path_items for select
using (
  exists (
    select 1
    from public.learning_paths
    where learning_paths.id = learning_path_items.learning_path_id
      and (learning_paths.is_published = true or public.is_admin())
  )
);

create policy "user can read own profile"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "user can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "user can read own preferences"
on public.user_preferences for select
using (user_id = auth.uid());

create policy "user can mutate own preferences"
on public.user_preferences for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "user can read own course status"
on public.user_course_status for select
using (user_id = auth.uid());

create policy "user can mutate own course status"
on public.user_course_status for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "user can read own topic progress"
on public.user_topic_progress for select
using (user_id = auth.uid());

create policy "user can read own skill gaps"
on public.user_skill_gaps for select
using (user_id = auth.uid());

create policy "user can read own recommendation cache"
on public.recommendations_cache for select
using (user_id = auth.uid());

create policy "user can mutate own recommendation cache"
on public.recommendations_cache for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "admin manage sources"
on public.sources for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage source runs"
on public.source_runs for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage ingestion candidates"
on public.ingestion_candidates for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage ingestion issues"
on public.ingestion_issues for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage resources"
on public.resources for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage courses"
on public.courses for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage course topics"
on public.course_topics for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage course skills"
on public.course_skills for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage learning paths"
on public.learning_paths for all
using (public.is_admin())
with check (public.is_admin());

create policy "admin manage learning path items"
on public.learning_path_items for all
using (public.is_admin())
with check (public.is_admin());

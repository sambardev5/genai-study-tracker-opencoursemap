# Rating and Feedback Feature Spec

This document defines a possible V1 for a site-level rating and quick feedback feature for OpenCourseMap. It is intentionally scoped for later implementation and is not a build commitment yet.

## Implementation Task List

### Phase 0 - Preconditions

1. Confirm that V1 is a single global rating target for the OpenCourseMap application, not per-course or per-route ratings.
2. Confirm that only authenticated users can submit ratings and feedback. Anonymous users may view the average rating only.
3. Confirm that raw feedback text remains admin-only and is never exposed through public APIs.
4. Keep the write path behind stable authentication. If auth is still incomplete, ship this feature only after login and signup are reliable, or ship read-only average rating first.

### Phase 1 - UX and interaction design

1. Add a compact rating trigger to the top-right area of the shared site header in `components/layout/site-header.tsx`.
2. Desktop behavior:
   show a compact pill with average rating, filled-star icon, and total rating count.
3. Desktop interaction:
   clicking the pill opens a right-aligned popover card with star input, average summary, feedback textarea, and submit action.
4. Mobile behavior:
   use a sheet or modal instead of a popover so the form remains usable on narrow screens.
5. Show a small helper line in the form stating that written feedback is only visible to admins.
6. Add a live character counter for the feedback box with a hard limit of 200 characters.
7. After submission, refresh the visible average rating and the current user's saved selection without a full page reload.

### Phase 2 - Database and security

1. Add a new Supabase migration for a dedicated feedback table.
2. Create a table such as `public.site_feedback`.
3. Store one active submission per user per feedback subject using a uniqueness constraint.
4. Add RLS policies so:
   authenticated users can insert and update only their own row.
5. Add RLS policies so:
   authenticated users can read only their own row when reopening the widget.
6. Add RLS policies so:
   admins can read all feedback rows.
7. Do not allow public or non-admin access to raw feedback rows.
8. Add indexes for aggregate reads and admin review sorting.
9. Add `updated_at` trigger support using the existing `public.touch_updated_at()` helper.

### Phase 3 - Backend contracts

1. Extend `lib/types.ts` with site feedback domain types and aggregate response types.
2. Extend `lib/validators/api.ts` with a feedback submission schema:
   `rating` required integer `1..5`, `feedbackText` optional string `0..200`.
3. Add repository methods for:
   reading aggregate summary, reading current user submission, upserting current user submission, and listing admin feedback rows.
4. Add a public-safe read endpoint for aggregate rating only.
5. Add an authenticated endpoint for current user upsert.
6. Add an admin-only endpoint for paginated feedback review.
7. Keep aggregate queries on the server side; do not expose raw comments in public payloads.

### Phase 4 - Frontend widget

1. Create a reusable `SiteRatingWidget` component under `components/`.
2. Load the aggregate rating in the shared header so the number is visible across the app.
3. If the viewer is signed in, preload that user's existing rating and feedback into the form.
4. If the viewer is signed out, show the average rating and a clear sign-in CTA to leave feedback.
5. Implement an interactive 5-star input with keyboard and screen-reader support.
6. Disable submit while saving and show inline success or validation errors.
7. Keep the design compact enough that it does not crowd the existing auth CTA cluster in the header.

### Phase 5 - Admin review surface

1. Add an admin page such as `app/admin/feedback/page.tsx`.
2. Show the list of submitted feedback with rating, comment, user identity, and updated time.
3. Add minimal filters for star rating and a search box over name or email.
4. Sort newest feedback first by default.
5. Keep this admin view server-protected using the same admin authorization pattern already used elsewhere.

### Phase 6 - Demo mode, testing, and rollout

1. Define demo-mode behavior when Supabase env vars are missing:
   either show read-only seeded aggregate data or hide the submit form with a clear note.
2. Add unit tests for validator rules and repository behavior.
3. Add integration tests for:
   authenticated upsert, aggregate refresh, and admin-only access.
4. Add coverage for unauthorized access:
   signed-out write attempt, non-admin feedback list attempt, and public raw feedback access attempt.
5. Add seed data only if needed for local preview.
6. Document the new routes and schema in `docs/api.md` and deployment notes if implemented.

## Product Summary

OpenCourseMap should support a site-level rating widget that lets users rate the overall application experience with 1 to 5 stars and optionally leave a short suggestion or improvement note up to 200 characters. The average star rating and number of ratings should be visible to all users. Written feedback should be stored in the database and remain visible only to admins.

## V1 Scope

- One global rating target for the OpenCourseMap app.
- One submission per authenticated user.
- Public aggregate rating display.
- Authenticated rating and optional short feedback submission.
- Admin-only feedback review page.
- Database persistence in Supabase.

## Out of Scope for V1

- Per-course ratings.
- Route-specific ratings.
- Public display of written feedback.
- Anonymous submissions.
- Comment replies, moderation workflows, sentiment analysis, or voting on feedback.
- Email notifications for new feedback.

## UX and Design Requirements

### Placement

- Desktop:
  place the widget in the top-right cluster of the sticky site header, near the auth buttons but visually distinct.
- Mobile:
  collapse to a compact icon-plus-rating trigger that opens a sheet or modal.

### Trigger state

- Show average rating rounded to one decimal place.
- Show total submission count.
- Use a filled star icon and compact pill or chip styling.
- If there are no ratings yet, show `New` or `No ratings yet` instead of `0.0`.

### Expanded form state

- Header line: `Rate OpenCourseMap`.
- Secondary line: show average rating summary such as `4.6 average from 128 ratings`.
- Interactive 5-star selector with hover and keyboard states.
- Optional textarea with max 200 characters and live counter.
- Helper text: `Written feedback is only visible to admins.`
- Primary action: `Submit feedback` or `Save rating`.
- If a user already submitted feedback, the form should open in edit mode with their saved rating and text prefilled.

### Visual direction

- Keep the component compact and production-like rather than social-media styled.
- Match existing brand colors:
  `copper`, `sand`, `sky`, `pine`, and `canvas`.
- Prefer a refined micro-surface treatment:
  soft border, subtle gradient, small star accent, and minimal motion.
- Avoid large illustrations in the header; a small decorative starburst or glow is acceptable.

## Functional Requirements

### Public users

1. Can see the current average rating and total rating count.
2. Cannot read any raw feedback text.
3. Cannot submit a rating without signing in.
4. If they open the widget while signed out, they should see a sign-in CTA instead of an active submit form.

### Authenticated users

1. Can submit exactly one active rating for the OpenCourseMap app.
2. Can set a star rating from 1 to 5.
3. Can submit an optional feedback note from 0 to 200 characters.
4. Can edit their prior rating and feedback; the latest submission overwrites the previous values.
5. Should see their own saved rating and text when reopening the widget.
6. Should receive inline validation errors for invalid values.

### Average rating behavior

1. Average rating should use only the latest active submission from each user.
2. Average rating should update soon after submit, ideally in the same interaction cycle.
3. Display value should be rounded to one decimal place.
4. Total count should reflect distinct active user submissions.

### Admin users

1. Can view all raw feedback entries and ratings.
2. Can filter and review feedback from a dedicated admin page.
3. Should not need direct database access to inspect submissions.

## Suggested Data Model

Use a dedicated table rather than overloading `user_course_status.rating`, because this feature is about rating the application, not rating a course.

### Table: `public.site_feedback`

- `id uuid primary key default gen_random_uuid()`
- `subject_type text not null check (subject_type in ('site')) default 'site'`
- `subject_key text not null default 'opencoursemap'`
- `user_id uuid not null references public.profiles(id) on delete cascade`
- `rating integer not null check (rating between 1 and 5)`
- `feedback_text text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Constraints

- `unique (subject_type, subject_key, user_id)`
- `check (feedback_text is null or char_length(feedback_text) <= 200)`

### Indexes

- index on `(subject_type, subject_key)`
- index on `(updated_at desc)`
- optional index on `(rating)`

### RLS policy intent

- user can `select` own feedback row.
- user can `insert` own feedback row.
- user can `update` own feedback row.
- admin can `select` all feedback rows.
- no public policy for raw feedback.

## Suggested API and Repository Contract

### Repository methods

- `getSiteFeedbackSummary(subjectKey?: string)`
- `getCurrentUserSiteFeedback(userId: string, subjectKey?: string)`
- `upsertSiteFeedback(input)`
- `listAdminSiteFeedback(filters)`

### Route handlers

- `GET /api/site-feedback`
  returns aggregate rating only, safe for public use.
- `GET /api/me/site-feedback`
  returns current signed-in user's saved submission.
- `PUT /api/me/site-feedback`
  creates or updates current signed-in user's submission.
- `GET /api/admin/site-feedback`
  returns paginated raw feedback rows for admins only.

### Suggested response shapes

#### `GET /api/site-feedback`

```json
{
  "subjectKey": "opencoursemap",
  "averageRating": 4.6,
  "totalRatings": 128
}
```

#### `GET /api/me/site-feedback`

```json
{
  "subjectKey": "opencoursemap",
  "rating": 5,
  "feedbackText": "Great catalog coverage. Would love faster signup flow.",
  "updatedAt": "2026-03-16T12:00:00.000Z"
}
```

#### `PUT /api/me/site-feedback`

Request:

```json
{
  "subjectKey": "opencoursemap",
  "rating": 4,
  "feedbackText": "Strong course coverage. Signup flow still needs polish."
}
```

Response:

```json
{
  "saved": true,
  "summary": {
    "subjectKey": "opencoursemap",
    "averageRating": 4.5,
    "totalRatings": 129
  }
}
```

## Admin Review Requirements

### Admin page

- Suggested route: `app/admin/feedback/page.tsx`
- Suggested heading: `Community feedback`
- Default columns:
  user name, user email, star rating, feedback text, last updated.
- Default sort:
  newest first.
- Filters:
  star rating filter, text search, date range optional.

### Access control

- Server-side guard with `requireAdminUser()`.
- API route guard with `isAdmin()`.
- Raw feedback must not be rendered outside admin-only surfaces.

## Validation Rules

- `rating` is required and must be an integer from 1 to 5.
- `feedbackText` is optional.
- `feedbackText` must be trimmed before validation.
- Empty string feedback should be normalized to `null`.
- Maximum feedback length is 200 characters after trimming.
- The feature should reject oversized feedback both client-side and server-side.

## Performance and Data Handling

- Aggregate rating can be queried on demand in V1; a cache table is not necessary at the current expected scale.
- Header aggregate fetch should not noticeably slow page rendering.
- After submit, revalidate the header widget state without forcing a full route reload if possible.
- If traffic grows significantly later, add a cached aggregate table or materialized view as a follow-up optimization.

## Privacy and Moderation Requirements

- Do not expose raw feedback in any public response payload.
- Treat feedback text as product feedback, not public community content.
- Store only the minimum user identity needed for admin review.
- Avoid collecting extra metadata unless there is a clear operational need.

## Acceptance Criteria

1. A signed-out user can see the aggregate rating but cannot submit.
2. A signed-in user can submit a 1 to 5 star rating with optional text up to 200 characters.
3. A signed-in user reopening the widget sees their existing submission and can edit it.
4. The header displays the updated aggregate rating after a successful submit.
5. Raw feedback text is accessible only from admin-protected surfaces.
6. Non-admin users and public users cannot fetch raw feedback through direct routes.
7. The widget remains usable on desktop and mobile without crowding the header layout.

## Codebase Touchpoints for Future Implementation

- `components/layout/site-header.tsx`
- `components/` for a new `SiteRatingWidget`
- `app/api/` for public, user, and admin feedback routes
- `app/admin/feedback/page.tsx`
- `lib/types.ts`
- `lib/validators/api.ts`
- `lib/db/repository.ts`
- `supabase/migrations/`
- `supabase/seed.sql` if demo data is needed
- `docs/api.md`

## Open Questions

1. Should this feature ship only after auth is fully stable, or should the public aggregate appear first with submission disabled?
2. Should the widget live inside the header action cluster or float just below the sticky header on desktop?
3. Do admins need CSV export in V1, or is an in-app list enough?
4. Should the app allow users to clear their feedback entirely, or only update it?

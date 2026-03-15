# API

Implemented route handlers:

- `GET /api/topics`
- `GET /api/courses`
- `GET /api/courses/:id`
- `GET /api/learning-paths`
- `GET /api/learning-paths/:slug`
- `GET /api/me`
- `PATCH /api/me`
- `PATCH /api/me/preferences`
- `GET /api/me/course-status`
- `PUT /api/me/course-status/:courseId`
- `GET /api/me/dashboard`
- `GET /api/me/recommendations`
- `POST /api/admin/ingestion/run`
- `GET /api/admin/ingestion/candidates`
- `POST /api/admin/ingestion/candidates/:id/approve`
- `POST /api/admin/ingestion/candidates/:id/reject`
- `PATCH /api/admin/resources/:id`

Current behavior:

- Without Supabase credentials, authenticated endpoints run against the seeded demo user.
- Admin endpoints authorize against `profiles.is_admin` in the real schema and the demo profile in local mode.
- Request validation uses Zod for profile, preferences, course status, and admin review actions.

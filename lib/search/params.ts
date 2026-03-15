import { z } from "zod";
import type { CourseSearchFilters } from "@/lib/types";

const querySchema = z.object({
  q: z.string().trim().optional(),
  topic: z.string().trim().optional(),
  provider: z.string().trim().optional(),
  level: z.enum(["basic", "amateur", "professional"]).optional(),
  language: z.string().trim().optional(),
  duration_bucket: z.enum(["short", "medium", "long"]).optional(),
  certificate: z.enum(["yes", "no", "unknown"]).optional(),
  mode: z.enum(["self-paced", "live", "cohort", "hybrid", "unknown"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(50).default(12),
  sort: z
    .enum(["relevance", "newest", "duration_asc", "duration_desc", "popular"])
    .default("relevance"),
});

export function parseCourseSearchParams(searchParams: URLSearchParams): CourseSearchFilters {
  const parsed = querySchema.parse({
    q: searchParams.get("q") ?? undefined,
    topic: searchParams.get("topic") ?? undefined,
    provider: searchParams.get("provider") ?? undefined,
    level: searchParams.get("level") ?? undefined,
    language: searchParams.get("language") ?? undefined,
    duration_bucket: searchParams.get("duration_bucket") ?? undefined,
    certificate: searchParams.get("certificate") ?? undefined,
    mode: searchParams.get("mode") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    page_size: searchParams.get("page_size") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  return {
    q: parsed.q,
    topic: parsed.topic,
    provider: parsed.provider,
    level: parsed.level,
    language: parsed.language,
    durationBucket: parsed.duration_bucket,
    certificate: parsed.certificate,
    mode: parsed.mode,
    page: parsed.page,
    pageSize: parsed.page_size,
    sort: parsed.sort,
  };
}

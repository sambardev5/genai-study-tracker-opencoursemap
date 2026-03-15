import type { Course } from "@/lib/types";

export function computeQueryScore(course: Course, query?: string) {
  if (!query) {
    return 0;
  }

  const normalized = query.toLowerCase();
  const title = course.title.toLowerCase();
  const summary = course.summary.toLowerCase();

  if (title === normalized) {
    return 100;
  }

  let score = 0;

  if (title.includes(normalized)) {
    score += 70;
  }

  if (summary.includes(normalized)) {
    score += 40;
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  for (const word of words) {
    if (title.includes(word)) {
      score += 12;
    }
    if (summary.includes(word)) {
      score += 5;
    }
  }

  return score;
}

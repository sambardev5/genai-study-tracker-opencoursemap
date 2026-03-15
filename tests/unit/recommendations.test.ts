import { describe, expect, it } from "vitest";
import { courses, demoPreferences, demoProfile, topics, userCourseStatuses } from "@/lib/db/demo-data";
import { getTopRecommendations, scoreCourseRecommendation } from "@/lib/recommendations/engine";

describe("recommendation engine", () => {
  it("scores a matching course above zero", () => {
    const course = courses[1];
    expect(course).toBeDefined();

    if (!course) {
      return;
    }

    const result = scoreCourseRecommendation({
      course,
      profile: demoProfile,
      preferences: demoPreferences,
      statuses: userCourseStatuses,
      topics,
    });

    expect(result).not.toBeNull();
    expect(result?.score).toBeGreaterThan(0);
  });

  it("excludes already completed courses", () => {
    const items = getTopRecommendations({
      courses,
      profile: demoProfile,
      preferences: demoPreferences,
      statuses: userCourseStatuses,
      topics,
    });

    expect(items.some((item) => item.courseId === "course-llm-foundations")).toBe(false);
  });
});

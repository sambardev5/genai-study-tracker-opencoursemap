import { describe, expect, it } from "vitest";
import { getUdemyCatalogData } from "@/lib/db/udemy-catalog";

describe("udemy catalog import", () => {
  it("imports the curated Udemy GenAI paid-course snapshot", () => {
    const data = getUdemyCatalogData();

    expect(data.providers).toHaveLength(1);
    expect(data.providers[0]?.id).toBe("provider-udemy");
    expect(data.courses).toHaveLength(26);
  });

  it("maps the Udemy snapshot onto paid self-paced course records", () => {
    const { courses } = getUdemyCatalogData();

    expect(courses.every((course) => course.providerId === "provider-udemy")).toBe(true);
    expect(courses.every((course) => course.isFree === false)).toBe(true);
    expect(courses.every((course) => course.freeVerificationStatus === "verified")).toBe(true);
    expect(courses.every((course) => course.courseMode === "self-paced")).toBe(true);
    expect(courses.every((course) => course.canonicalUrl.startsWith("https://www.udemy.com/course/"))).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "Complete Generative AI Course: RAG, AI Agents & Deployment" &&
          course.topicIds.includes("topic-rag") &&
          course.topicIds.includes("topic-agents"),
      ),
    ).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "The Complete AI Coding Course (2025) - Cursor, Claude Code" &&
          course.topicIds.includes("topic-copilot"),
      ),
    ).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { getCourseraCatalogData } from "@/lib/db/coursera-catalog";

describe("coursera catalog import", () => {
  it("imports the direct Coursera GenAI URL set", () => {
    const data = getCourseraCatalogData();

    expect(data.providers).toHaveLength(1);
    expect(data.providers[0]?.id).toBe("provider-coursera");
    expect(data.courses).toHaveLength(68);
  });

  it("maps direct URLs onto free Coursera course records with topic inference", () => {
    const { courses } = getCourseraCatalogData();

    expect(courses.every((course) => course.providerId === "provider-coursera")).toBe(true);
    expect(courses.every((course) => course.isFree)).toBe(true);
    expect(courses.every((course) => course.freeVerificationStatus === "verified")).toBe(true);
    expect(courses.every((course) => course.courseMode === "self-paced")).toBe(true);
    expect(courses.every((course) => course.certificateIsFree === false)).toBe(true);
    expect(courses.every((course) => course.canonicalUrl.startsWith("https://www.coursera.org/"))).toBe(true);
    expect(courses.every((course) => course.enrollmentUrl === course.canonicalUrl)).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "GenAI in Data Analytics" &&
          course.topicIds.includes("topic-data") &&
          course.topicIds.includes("topic-ml"),
      ),
    ).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "Building GenAI Applications and Agents" &&
          course.topicIds.includes("topic-agents") &&
          course.topicIds.includes("topic-llm"),
      ),
    ).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "GenAI Deployment Governance" &&
          course.topicIds.includes("topic-rai") &&
          course.difficulty === "professional",
      ),
    ).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "GenAI Basics: How LLMs Work" &&
          course.durationHours === 2 &&
          course.difficulty === "basic" &&
          course.topicIds.includes("topic-llm"),
      ),
    ).toBe(true);
  });
});

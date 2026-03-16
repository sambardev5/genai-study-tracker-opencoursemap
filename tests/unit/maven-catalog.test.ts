import { describe, expect, it } from "vitest";
import { getMavenCatalogData } from "@/lib/db/maven-catalog";

describe("maven catalog import", () => {
  it("imports the deduped Maven AI course set", () => {
    const data = getMavenCatalogData();

    expect(data.providers).toHaveLength(1);
    expect(data.providers[0]?.id).toBe("provider-maven");
    expect(data.courses).toHaveLength(103);
  });

  it("maps Maven entries onto paid cohort course records with real course URLs", () => {
    const { courses } = getMavenCatalogData();

    expect(courses.every((course) => course.providerId === "provider-maven")).toBe(true);
    expect(courses.every((course) => course.isFree === false)).toBe(true);
    expect(courses.every((course) => course.courseMode === "cohort")).toBe(true);
    expect(courses.every((course) => /^https:\/\/maven\.com\/[^/]+\/[^/]+$/.test(course.canonicalUrl))).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "AI Evals For Engineers & PMs" &&
          course.canonicalUrl === "https://maven.com/parlance-labs/evals" &&
          course.topicIds.includes("topic-eval"),
      ),
    ).toBe(true);
    expect(
      courses.some(
        (course) =>
          course.title === "AI Product Management Certification" &&
          course.canonicalUrl === "https://maven.com/product-faculty/ai-product-management-certification" &&
          course.hasCertificate,
      ),
    ).toBe(true);
  });
});

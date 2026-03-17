import { describe, expect, it } from "vitest";
import { repository } from "@/lib/db/repository";

describe("homepage featured course selection", () => {
  it("returns a provider-diverse mix of course levels for the landing page", () => {
    const featured = repository.getHomepageFeaturedCourses(6);
    const difficultySet = new Set(featured.map((course) => course.difficulty));

    expect(featured).toHaveLength(6);
    expect(new Set(featured.map((course) => course.providerId)).size).toBe(featured.length);
    expect(difficultySet.has("basic")).toBe(true);
    expect(difficultySet.has("amateur")).toBe(true);
    expect(difficultySet.has("professional")).toBe(true);
  });
});

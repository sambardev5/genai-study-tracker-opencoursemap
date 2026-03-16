import { describe, expect, it } from "vitest";
import { repository } from "@/lib/db/repository";

describe("course catalog pricing filters", () => {
  it("returns explicitly paid courses when pricing is set to paid", () => {
    const result = repository.listCourses({
      pricing: "paid",
      page: 1,
      pageSize: 80,
      sort: "relevance",
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((course) => course.isFree === false)).toBe(true);
    expect(result.items.every((course) => course.freeVerificationStatus === "verified")).toBe(true);
    expect(result.items.some((course) => course.providerId === "provider-maven")).toBe(true);
    expect(result.items.some((course) => course.providerId === "provider-nvidia-dli")).toBe(true);
  });

  it("keeps the free catalog isolated when pricing is set to free", () => {
    const result = repository.listCourses({
      pricing: "free",
      page: 1,
      pageSize: 80,
      sort: "relevance",
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((course) => course.isFree)).toBe(true);
    expect(result.items.some((course) => course.providerId === "provider-maven")).toBe(false);
  });

  it("returns NVIDIA courses with unstated pricing when pricing is set to other", () => {
    const result = repository.listCourses({
      pricing: "other",
      page: 1,
      pageSize: 80,
      sort: "relevance",
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((course) => course.isFree === false)).toBe(true);
    expect(result.items.every((course) => course.freeVerificationStatus === "unknown")).toBe(true);
    expect(result.items.every((course) => course.providerId === "provider-nvidia-dli")).toBe(true);
  });
});

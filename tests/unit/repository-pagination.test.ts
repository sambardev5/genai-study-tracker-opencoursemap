import { describe, expect, it } from "vitest";
import { repository } from "@/lib/db/repository";

describe("course catalog pagination", () => {
  it("returns distinct first and second pages", () => {
    const firstPage = repository.listCourses({ page: 1, pageSize: 12, sort: "relevance" });
    const secondPage = repository.listCourses({ page: 2, pageSize: 12, sort: "relevance" });

    expect(firstPage.pagination.page).toBe(1);
    expect(secondPage.pagination.page).toBe(2);
    expect(firstPage.items.length).toBeGreaterThan(0);
    expect(secondPage.items.length).toBeGreaterThan(0);
    expect(secondPage.items[0]?.id).not.toBe(firstPage.items[0]?.id);
  });

  it("clamps out-of-range pages to the last available page", () => {
    const result = repository.listCourses({ page: 999, pageSize: 12, sort: "relevance" });

    expect(result.pagination.totalPages).toBeGreaterThan(1);
    expect(result.pagination.page).toBe(result.pagination.totalPages);
    expect(result.items.length).toBeGreaterThan(0);
  });
});

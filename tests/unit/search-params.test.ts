import { describe, expect, it } from "vitest";
import { parseCourseSearchParams } from "@/lib/search/params";

describe("search param parsing", () => {
  it("applies defaults when no params are provided", () => {
    const params = parseCourseSearchParams(new URLSearchParams());

    expect(params.page).toBe(1);
    expect(params.pageSize).toBe(12);
    expect(params.sort).toBe("relevance");
  });

  it("parses custom filters", () => {
    const params = parseCourseSearchParams(
      new URLSearchParams({
        pricing: "paid",
        level: "professional",
        topic: "topic-rag",
        page: "2",
        page_size: "5",
      }),
    );

    expect(params.pricing).toBe("paid");
    expect(params.level).toBe("professional");
    expect(params.topic).toBe("topic-rag");
    expect(params.page).toBe(2);
    expect(params.pageSize).toBe(5);
  });
});

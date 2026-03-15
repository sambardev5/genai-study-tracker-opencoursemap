import { describe, expect, it } from "vitest";
import { repository } from "@/lib/db/repository";

describe("dashboard aggregation", () => {
  it("returns summary metrics and charts", () => {
    const dashboard = repository.getDashboard("user-demo-1");

    expect(dashboard.summary.completed).toBeGreaterThanOrEqual(1);
    expect(dashboard.topicBreakdown.length).toBeGreaterThan(0);
    expect(dashboard.skillGaps.length).toBeGreaterThan(0);
  });
});

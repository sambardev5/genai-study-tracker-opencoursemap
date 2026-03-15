import { describe, expect, it } from "vitest";
import { repository } from "@/lib/db/repository";

describe("course status upsert flow", () => {
  it("creates or updates a user course status", () => {
    const result = repository.upsertUserCourseStatus("user-demo-1", "course-finetuning-ops", {
      status: "in_progress",
      percentComplete: 30,
      hoursSpent: 2,
    });

    expect(result.status).toBe("in_progress");
    expect(result.percentComplete).toBe(30);
  });
});

import { describe, expect, it } from "vitest";
import { repository } from "@/lib/db/repository";

describe("admin candidate approval flow", () => {
  it("approves a candidate", () => {
    const approved = repository.approveCandidate("candidate-1");

    expect(approved?.parseStatus).toBe("approved");
  });
});

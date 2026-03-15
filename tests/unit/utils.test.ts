import { describe, expect, it } from "vitest";
import { getDurationBucket } from "@/lib/utils";

describe("duration bucket", () => {
  it("categorizes short, medium, and long durations", () => {
    expect(getDurationBucket(2)).toBe("short");
    expect(getDurationBucket(8)).toBe("medium");
    expect(getDurationBucket(16)).toBe("long");
    expect(getDurationBucket(null)).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { canAccessUserResource, isAdmin } from "@/lib/auth/permissions";

describe("permissions helpers", () => {
  it("detects admins", () => {
    expect(isAdmin({ isAdmin: true, email: "admin@example.com" })).toBe(true);
    expect(isAdmin({ isAdmin: false, email: "user@example.com" })).toBe(false);
  });

  it("checks user-owned resources", () => {
    expect(canAccessUserResource("user-1", { id: "user-1" })).toBe(true);
    expect(canAccessUserResource("user-1", { id: "user-2" })).toBe(false);
  });
});

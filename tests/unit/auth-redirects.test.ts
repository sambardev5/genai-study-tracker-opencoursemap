import { describe, expect, it } from "vitest";
import { buildAuthCallbackUrl, getSafeRedirectPath } from "@/lib/auth/redirects";

describe("auth redirect helpers", () => {
  it("only allows internal redirect paths", () => {
    expect(getSafeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectPath("https://evil.example")).toBe("/dashboard");
    expect(getSafeRedirectPath(undefined)).toBe("/dashboard");
  });

  it("builds the callback URL with a safe next parameter", () => {
    expect(buildAuthCallbackUrl("https://genaicoursepath.com", "/profile")).toBe(
      "https://genaicoursepath.com/auth/callback?next=%2Fprofile",
    );
    expect(buildAuthCallbackUrl("https://genaicoursepath.com", "https://evil.example")).toBe(
      "https://genaicoursepath.com/auth/callback",
    );
  });
});

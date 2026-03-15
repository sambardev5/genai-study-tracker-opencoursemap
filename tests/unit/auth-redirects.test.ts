import { describe, expect, it } from "vitest";
import { buildAuthCallbackUrl, buildAuthPageUrl, getSafeRedirectPath } from "@/lib/auth/redirects";

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

  it("builds auth page URLs with safe feedback params", () => {
    expect(
      buildAuthPageUrl("https://genaicoursepath.com/login", "/login", {
        redirectTo: "/profile",
        error: "Invalid credentials",
      }).toString(),
    ).toBe("https://genaicoursepath.com/login?redirectTo=%2Fprofile&error=Invalid+credentials");

    expect(
      buildAuthPageUrl("https://genaicoursepath.com/signup", "/signup", {
        redirectTo: "https://evil.example",
        message: "Check your email",
      }).toString(),
    ).toBe("https://genaicoursepath.com/signup?message=Check+your+email");
  });
});

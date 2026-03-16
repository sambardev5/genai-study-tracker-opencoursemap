import { describe, expect, it } from "vitest";
import { buildAuthCallbackUrl, buildAuthPageUrl, getSafeRedirectPath } from "@/lib/auth/redirects";

describe("auth redirect helpers", () => {
  it("only allows internal redirect paths", () => {
    expect(getSafeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectPath("https://evil.example")).toBe("/dashboard");
    expect(getSafeRedirectPath(undefined)).toBe("/dashboard");
  });

  it("builds the callback URL with a safe next parameter", () => {
    expect(buildAuthCallbackUrl("https://opencoursemap.com", "/profile")).toBe(
      "https://opencoursemap.com/auth/callback?next=%2Fprofile",
    );
    expect(buildAuthCallbackUrl("https://opencoursemap.com", "https://evil.example")).toBe(
      "https://opencoursemap.com/auth/callback",
    );
  });

  it("builds auth page URLs with safe feedback params", () => {
    expect(
      buildAuthPageUrl("https://opencoursemap.com/login", "/login", {
        redirectTo: "/profile",
        error: "Invalid credentials",
      }).toString(),
    ).toBe("https://opencoursemap.com/login?redirectTo=%2Fprofile&error=Invalid+credentials");

    expect(
      buildAuthPageUrl("https://opencoursemap.com/signup", "/signup", {
        redirectTo: "https://evil.example",
        message: "Check your email",
      }).toString(),
    ).toBe("https://opencoursemap.com/signup?message=Check+your+email");
  });
});

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormMode = "login" | "signup";

export function AuthForm({
  mode,
  redirectTo,
  initialError,
  initialMessage,
}: {
  mode: AuthFormMode;
  redirectTo: string;
  initialError?: string;
  initialMessage?: string;
}) {
  const [emailPending, setEmailPending] = useState(false);
  const [oauthPending, setOauthPending] = useState(false);
  const action = mode === "login" ? "/auth/login" : "/auth/signup";

  return (
    <div className="mt-8 grid gap-4">
      <form
        action="/auth/google"
        method="post"
        onSubmit={() => {
          setOauthPending(true);
          setEmailPending(false);
        }}
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button variant="secondary" type="submit" disabled={emailPending || oauthPending} className="w-full">
          {oauthPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>
      </form>

      <form
        className="grid gap-3"
        action={action}
        method="post"
        onSubmit={() => {
          setEmailPending(true);
          setOauthPending(false);
        }}
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {mode === "signup" ? (
          <label className="grid gap-2 text-sm text-ink/68">
            Full name
            <Input
              type="text"
              name="fullName"
              placeholder="Your full name"
              required
              minLength={2}
              autoComplete="name"
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm text-ink/68">
          Email address
          <Input
            type="email"
            name="email"
            placeholder="name@example.com"
            required
            autoComplete="email"
          />
        </label>

        <label className="grid gap-2 text-sm text-ink/68">
          Password
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>

        <Button type="submit" disabled={emailPending || oauthPending}>
          {emailPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Sign in with email" : "Create account"}
        </Button>
      </form>

      {initialError ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {initialError}
        </p>
      ) : null}

      {initialMessage ? (
        <p className="rounded-2xl border border-pine/15 bg-pine/5 px-4 py-3 text-sm text-pine">{initialMessage}</p>
      ) : null}
    </div>
  );
}

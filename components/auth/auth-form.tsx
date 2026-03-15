"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { buildAuthCallbackUrl } from "@/lib/auth/redirects";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [isPending, startAuthTransition] = useTransition();
  const [oauthPending, setOauthPending] = useState(false);

  function getSupabase() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not configured. Add the Supabase public URL and anon key.");
      return null;
    }

    return supabase;
  }

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    startAuthTransition(async () => {
      const supabase = getSupabase();

      if (!supabase) {
        return;
      }

      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          return;
        }

        startTransition(() => {
          router.replace(redirectTo);
          router.refresh();
        });
        return;
      }

      const emailRedirectTo = buildAuthCallbackUrl(window.location.origin, redirectTo);
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName,
            name: fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.session) {
        startTransition(() => {
          router.replace(redirectTo);
          router.refresh();
        });
        return;
      }

      setMessage("Check your email to confirm your account, then come back to sign in.");
    });
  }

  async function handleGoogleAuth() {
    setError("");
    setMessage("");
    setOauthPending(true);

    const supabase = getSupabase();

    if (!supabase) {
      setOauthPending(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildAuthCallbackUrl(window.location.origin, redirectTo),
      },
    });

    if (authError) {
      setError(authError.message);
      setOauthPending(false);
    }
  }

  return (
    <div className="mt-8 grid gap-4">
      <Button variant="secondary" onClick={handleGoogleAuth} disabled={isPending || oauthPending}>
        {oauthPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Continue with Google
      </Button>

      <form className="grid gap-3" onSubmit={handleEmailAuth}>
        {mode === "signup" ? (
          <label className="grid gap-2 text-sm text-ink/68">
            Full name
            <Input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your full name"
              required
              minLength={2}
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm text-ink/68">
          Email address
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            required
          />
        </label>

        <label className="grid gap-2 text-sm text-ink/68">
          Password
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            minLength={6}
          />
        </label>

        <Button type="submit" disabled={isPending || oauthPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Sign in with email" : "Create account"}
        </Button>
      </form>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {message ? (
        <p className="rounded-2xl border border-pine/15 bg-pine/5 px-4 py-3 text-sm text-pine">{message}</p>
      ) : null}
    </div>
  );
}

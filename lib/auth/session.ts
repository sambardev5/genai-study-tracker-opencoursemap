import { redirect } from "next/navigation";
import { getDemoProfile } from "@/lib/db/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/types";
import { env, hasSupabaseEnv } from "@/lib/utils/env";

function fallbackProfileFromAuthUser(input: {
  id: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  headline?: string | null;
  currentLevel?: UserProfile["currentLevel"] | null;
  weeklyStudyHours?: number | null;
  isAdmin?: boolean | null;
}) {
  return {
    id: input.id,
    email: input.email ?? "",
    fullName: input.fullName ?? "Learner",
    headline: input.headline ?? "",
    currentLevel: input.currentLevel ?? "basic",
    weeklyStudyHours: input.weeklyStudyHours ?? 0,
    avatarUrl: input.avatarUrl ?? "",
    isAdmin: Boolean(input.isAdmin),
  } satisfies UserProfile;
}

export async function getCurrentUser() {
  if (!hasSupabaseEnv()) {
    return getDemoProfile();
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, headline, current_level, weekly_study_hours, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  const email = user.email ?? "";
  const metadataName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata.name === "string"
        ? user.user_metadata.name
        : null;
  const adminFromEnv = email !== "" && env.adminEmails.includes(email);

  return fallbackProfileFromAuthUser({
    id: user.id,
    email,
    fullName: profile?.full_name ?? metadataName,
    avatarUrl:
      profile?.avatar_url ??
      (typeof user.user_metadata.avatar_url === "string" ? user.user_metadata.avatar_url : null),
    headline: profile?.headline,
    currentLevel:
      profile?.current_level === "basic" ||
      profile?.current_level === "amateur" ||
      profile?.current_level === "professional"
        ? profile.current_level
        : "basic",
    weeklyStudyHours: profile?.weekly_study_hours ?? 0,
    isAdmin: profile?.is_admin ?? adminFromEnv,
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdminUser() {
  const user = await requireCurrentUser();

  if (!user.isAdmin) {
    redirect("/dashboard");
  }

  return user;
}

export function getEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
    supabaseAnonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
      process.env.SUPABASE_PUBLISHABLE_KEY,
    supabaseServiceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SECRET_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://genaicoursepath.com",
    adminEmails: (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  };
}

export function hasSupabaseEnv() {
  const env = getEnv();
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

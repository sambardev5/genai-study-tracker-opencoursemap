import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/utils/env";

export function createSupabaseAdminClient() {
  const env = getEnv();

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

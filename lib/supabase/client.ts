import { createBrowserClient } from "@supabase/ssr";
import { getEnv } from "@/lib/utils/env";

export function createSupabaseBrowserClient() {
  const env = getEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}

export const createClient = createSupabaseBrowserClient;

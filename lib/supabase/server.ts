import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/utils/env";

function buildServerClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const env = getEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookieValues: Array<{
          name: string;
          value: string;
          options?: Parameters<typeof cookieStore.set>[2];
        }>,
      ) {
        try {
          for (const cookie of cookieValues) {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          }
        } catch {
          // Ignore cookie writes from Server Components; middleware refreshes sessions.
        }
      },
    },
  });
}

export async function createSupabaseServerClient() {
  return buildServerClient(await cookies());
}

export const createClient = buildServerClient;

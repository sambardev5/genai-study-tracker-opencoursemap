import { env } from "@/lib/utils/env";
import { getDemoProfile } from "@/lib/db/demo-data";

export async function getCurrentUser() {
  if (!env.supabaseUrl) {
    return getDemoProfile();
  }

  return getDemoProfile();
}

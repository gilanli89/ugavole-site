import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceConfig } from "./config";

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseServiceConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

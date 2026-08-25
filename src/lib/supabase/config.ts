import "server-only";

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public configuration is missing");
  }

  return { url, anonKey };
}

export function getSupabaseServiceConfig(): SupabaseConfig & {
  serviceRoleKey: string;
} {
  const config = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Supabase service role configuration is missing");
  }

  return { ...config, serviceRoleKey };
}

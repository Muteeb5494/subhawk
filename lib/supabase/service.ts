import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client authenticated with the service-role key. This BYPASSES Row
 * Level Security, so it must only ever be used in trusted server-only code
 * (e.g. the reminder cron). Never import this into a Client Component.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

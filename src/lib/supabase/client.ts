/* ==========================================================================
   Supabase Browser Client — used in Client Components.
   Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
   ========================================================================== */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase URL and Anon Key are required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.",
    );
  }

  return createBrowserClient(url, key);
}

/** Singleton for convenience in Zustand stores / hooks. */
let _browserClient: ReturnType<typeof createClient> | null = null;

export function getBrowserClient() {
  if (!_browserClient) _browserClient = createClient();
  return _browserClient;
}

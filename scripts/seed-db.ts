/* ==========================================================================
   scripts/seed-db.ts — Supabase Database Seeder
   ========================================================================== */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  SEED_CREATORS,
  SEED_SHOWS,
  SEED_SEASONS,
  SEED_EPISODES,
} from "../src/lib/seed-data";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use the Service Role Key if available to bypass RLS, otherwise fallback to Anon Key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "Missing URL or Keys in .env.local\n" +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    );
    process.exit(1);
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("Using SERVICE_ROLE_KEY (Admin Mode) — Bypassing RLS...");
  }

  const supabase = createClient(url, key);
  console.log("Connected to Supabase — seeding database...\n");

  /* ---------- Creators ---------- */
  const { error: creatorError } = await supabase
    .from("creators")
    .upsert(SEED_CREATORS, { onConflict: "id" });

  if (creatorError) {
    console.error("Failed to seed creators:", creatorError);
    process.exit(1);
  }
  console.log(`  ✓ ${SEED_CREATORS.length} creators`);

  /* ---------- Shows ---------- */
  const { error: showError } = await supabase
    .from("shows")
    .upsert(SEED_SHOWS, { onConflict: "id" });

  if (showError) {
    console.error("Failed to seed shows:", showError);
    process.exit(1);
  }
  console.log(`  ✓ ${SEED_SHOWS.length} shows`);

  /* ---------- Seasons ---------- */
  const { error: seasonError } = await supabase
    .from("seasons")
    .upsert(SEED_SEASONS, { onConflict: "id" });

  if (seasonError) {
    console.error("Failed to seed seasons:", seasonError);
    process.exit(1);
  }
  console.log(`  ✓ ${SEED_SEASONS.length} seasons`);

  /* ---------- Episodes ---------- */
  const { error: episodeError } = await supabase
    .from("episodes")
    .upsert(SEED_EPISODES, { onConflict: "id" });

  if (episodeError) {
    console.error("Failed to seed episodes:", episodeError);
    process.exit(1);
  }
  console.log(`  ✓ ${SEED_EPISODES.length} episodes`);

  console.log("\nDatabase seeded successfully.");
  process.exit(0);
}

main();
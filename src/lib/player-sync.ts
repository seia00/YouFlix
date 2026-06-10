/* ==========================================================================
   lib/player-sync.ts — Progress Sync Service
   Debounces watch-progress writes to Supabase every 10 seconds.
   Used as a Zustand subscriber in the watch page.
   ========================================================================== */

import { getBrowserClient } from "@/lib/supabase/client";

/**
 * Syncs the user's watch progress for an episode to Supabase.
 * Upserts into the `watch_history` table.
 */
let _syncTimer: ReturnType<typeof setTimeout> | null = null;
let _lastSyncedEpisodeId: string | null = null;
let _pendingTime = 0;
let _pendingCompleted = false;

const SYNC_INTERVAL_MS = 10_000; // 10 seconds

/**
 * Debounced sync — call this every second with the current time.
 * Only flushes to Supabase every 10 s.
 */
export function debouncedSyncProgress(
  episodeId: string,
  time: number,
  duration: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
): void {
  _pendingTime = time;
  _pendingCompleted = duration > 0 && time / duration >= 0.9;

  // If the episode changed, flush immediately
  if (_lastSyncedEpisodeId && _lastSyncedEpisodeId !== episodeId) {
    flush();
  }
  _lastSyncedEpisodeId = episodeId;

  // Schedule flush
  if (!_syncTimer) {
    _syncTimer = setTimeout(flush, SYNC_INTERVAL_MS);
  }
}

export function flush(): void {
  if (_syncTimer) {
    clearTimeout(_syncTimer);
    _syncTimer = null;
  }

  const episodeId = _lastSyncedEpisodeId;
  const time = _pendingTime;
  const completed = _pendingCompleted;

  if (!episodeId) return;

  // Fire-and-forget upsert (don't block the UI)
  void upsertProgress(episodeId, time, completed);
}

async function upsertProgress(
  episodeId: string,
  seconds: number,
  isCompleted: boolean,
): Promise<void> {
  try {
    const supabase = getBrowserClient();

    // Get profile id for the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!profile) return;

    await supabase.from("watch_history").upsert(
      {
        user_id: profile.id,
        episode_id: episodeId,
        progress_seconds: Math.floor(seconds),
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, episode_id" },
    );
  } catch {
    // Silently fail — progress sync is non-critical
  }
}

/**
 * Call this when the watch page unmounts to persist the latest position.
 */
export function teardownSync(): void {
  flush();
  _lastSyncedEpisodeId = null;
  _pendingTime = 0;
  _pendingCompleted = false;
}

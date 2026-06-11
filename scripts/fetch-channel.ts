/* ==========================================================================
   scripts/fetch-channel.ts — YouTube Channel Video Fetcher
   ==========================================================================
   Accepts handles, URLs, or channel IDs. Automatically resolves handles
   to channel IDs by fetching the YouTube page and extracting metadata.
   No API key required.

   Usage:
     npx tsx scripts/fetch-channel.ts @ryan
     npx tsx scripts/fetch-channel.ts @YesTheory
     npx tsx scripts/fetch-channel.ts https://www.youtube.com/@MrBeast
     npx tsx scripts/fetch-channel.ts UCX6OQ3DkcsbYNE6H8uQQuVA
   ========================================================================== */

/* ------------------------------------------------------------------
   Built-in lookup table — instant resolution for known channels.
   ------------------------------------------------------------------ */
const KNOWN_CHANNELS: Record<string, string> = {
  "kellywakasa": "UCLVMKLtleeiKs0Oqp86ApTQ",
  "ryan": "UCnmGIkw-KdI0W5siakKPKog",
  "yestheory": "UCvK4bOhULCpmLabd2pDMtnA",
  "mrbeast": "UCX6OQ3DkcsbYNE6H8uQQuVA",
  "mrbeast6000": "UCX6OQ3DkcsbYNE6H8uQQuVA",
};

/* ------------------------------------------------------------------
   Step 1: Parse input into a normalized handle.
   ------------------------------------------------------------------ */
function parseInput(raw: string): { type: "channelId" | "handle"; value: string } {
  const trimmed = raw.trim();

  // Already a channel ID (UC + 22 chars)
  if (/^UC[\w-]{22}$/.test(trimmed)) {
    return { type: "channelId", value: trimmed };
  }

  // Handle with @ prefix
  const handleMatch = trimmed.match(/^@([\w.-]+)$/);
  if (handleMatch) {
    return { type: "handle", value: handleMatch[1] };
  }

  // URL — extract handle from path
  const urlMatch = trimmed.match(/youtube\.com\/@([\w.-]+)/);
  if (urlMatch) {
    return { type: "handle", value: urlMatch[1] };
  }

  // Plain handle name (no @)
  if (/^[\w.-]+$/.test(trimmed)) {
    return { type: "handle", value: trimmed };
  }

  throw new Error(
    `Cannot parse input: "${trimmed}". Expected:\n` +
    "  - @handle (e.g. @ryan)\n" +
    "  - Channel ID (e.g. UCLVMKLtleeiKs0Oqp86ApTQ)\n" +
    "  - Channel URL (e.g. https://www.youtube.com/@ryan)",
  );
}

/* ------------------------------------------------------------------
   Step 2: Resolve handle → channel ID.
   ------------------------------------------------------------------ */
interface ChannelMeta {
  channelId: string;
  channelName: string;
}

async function resolveChannelId(handle: string): Promise<ChannelMeta> {
  const normalized = handle.toLowerCase().replace(/[^a-z0-9_-]/g, "");

  // Check built-in lookup first (instant)
  const known = KNOWN_CHANNELS[normalized];
  if (known) {
    console.log(`  ⚡ Resolved from built-in lookup table`);
    return { channelId: known, channelName: handle };
  }

  // Fetch YouTube page and extract externalId
  console.log(`  🌐 Fetching https://www.youtube.com/@${handle}...`);
  const res = await fetch(`https://www.youtube.com/@${handle}`);
  if (!res.ok) {
    throw new Error(
      `YouTube returned ${res.status}. Check that the handle "@${handle}" is correct.`,
    );
  }

  const html = await res.text();

  // Extract channel ID from embedded structured data
  const idMatch = html.match(/"externalId":"(UC[\w-]{22})"/);
  if (!idMatch) {
    throw new Error(
      `Could not find channel ID. The handle "@${handle}" may not exist.\n` +
      "Try finding the channel ID manually: View Page Source → search 'externalId'",
    );
  }

  const channelId = idMatch[1];

  // Try to extract the channel name
  const nameMatch = html.match(/"name":"([^"]+)"\s*,\s*"runs"/);
  const channelName = nameMatch?.[1] ?? handle;

  return { channelId, channelName };
}

/* ------------------------------------------------------------------
   Step 3: Fetch videos from RSS feed.
   ------------------------------------------------------------------ */
interface VideoEntry {
  id: string;
  title: string;
  views: number;
  published: string;
}

async function fetchVideos(channelId: string): Promise<VideoEntry[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  console.log(`  📡 Fetching ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`RSS feed returned ${res.status}. Channel ID may be invalid.`);
  }

  const xml = await res.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  return entries
    .map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = entry.match(/<media:title>([^<]+)<\/media:title>/)?.[1] ?? "";
      const views = entry.match(/<media:statistics views="(\d+)"/)?.[1] ?? "0";
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      const isShort = entry.includes("/shorts/");
      return { id, title, views: parseInt(views), published, isShort };
    })
    .filter((v) => !v.isShort && v.id)
    .sort((a, b) => b.views - a.views);
}

/* ==================================================================
   MAIN
   ================================================================== */
async function main() {
  const raw = process.argv[2];

  if (!raw) {
    console.log("Usage: npx tsx scripts/fetch-channel.ts <input>\n");
    console.log("Examples:");
    console.log("  npx tsx scripts/fetch-channel.ts @ryan");
    console.log("  npx tsx scripts/fetch-channel.ts @YesTheory");
    console.log("  npx tsx scripts/fetch-channel.ts https://www.youtube.com/@MrBeast");
    console.log("  npx tsx scripts/fetch-channel.ts UCLVMKLtleeiKs0Oqp86ApTQ\n");
    console.log("Known channels (no lookup needed):");
    for (const [name, id] of Object.entries(KNOWN_CHANNELS)) {
      console.log(`  @${name.padEnd(16)} → ${id}`);
    }
    process.exit(1);
  }

  console.log("╔══════════════════════════════════════════╗");
  console.log("║     Youflix Channel Video Fetcher        ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Parse
  const parsed = parseInput(raw);
  console.log(`📥 Input: ${raw}`);

  // Resolve
  let channelId: string;
  let channelName: string;

  if (parsed.type === "channelId") {
    channelId = parsed.value;
    channelName = "(channel ID provided directly)";
    console.log(`  ✓ Channel ID: ${channelId}\n`);
  } else {
    console.log(`🔍 Resolving "@${parsed.value}"...`);
    try {
      const meta = await resolveChannelId(parsed.value);
      channelId = meta.channelId;
      channelName = meta.channelName;
      console.log(`  ✓ Resolved: ${channelName}`);
      console.log(`  ✓ Channel ID: ${channelId}\n`);
    } catch (err) {
      console.error(`\n❌ ${(err as Error).message}`);
      process.exit(1);
    }
  }

  // Fetch videos
  console.log("🎬 Fetching videos...");
  const videos = await fetchVideos(channelId);

  console.log(`\n  ✓ ${videos.length} full-length videos found\n`);
  console.log("═".repeat(56));
  for (const v of videos) {
    const date = v.published ? new Date(v.published).toLocaleDateString() : "—";
    console.log(`  ${v.id}`);
    console.log(`  ${v.title}`);
    console.log(`  ${v.views.toLocaleString()} views  ·  ${date}`);
    console.log("");
  }

  // JSON output for easy copy-paste into seed-data.ts
  console.log("═".repeat(56));
  console.log("\n📋 JSON (copy into src/lib/seed-data.ts YT object):\n");
  console.log(JSON.stringify(
    videos.map((v) => ({
      youtube_id: v.id,
      title: v.title,
      views: v.views,
    })),
    null,
    2,
  ));

  console.log("\n✅ Done! Paste the video IDs above into src/lib/seed-data.ts,");
  console.log("   then run:  npx tsx scripts/seed-db.ts");
}

main();

/* ==========================================================================
   scripts/fetch-channel.ts — YouTube Channel RSS Fetcher
   ==========================================================================
   Fetches recent full-length videos from any YouTube channel RSS feed.
   Outputs JSON with video IDs, titles, and metadata for curation.

   Usage:
     1. Find the channel ID (e.g., UCLVMKLtleeiKs0Oqp86ApTQ for Kelly Wakasa)
        → Go to youtube.com/@HANDLE → View Page Source → search "externalId"
     2. Run:  npx tsx scripts/fetch-channel.ts CHANNEL_ID
   ========================================================================== */

async function main() {
  const channelId = process.argv[2];

  if (!channelId) {
    console.log("Usage: npx tsx scripts/fetch-channel.ts <CHANNEL_ID>\n");
    console.log("How to find a channel ID:");
    console.log("  1. Go to youtube.com/@HANDLE");
    console.log("  2. View Page Source (Cmd+U / Ctrl+U)");
    console.log("  3. Search for 'externalId'");
    console.log("  4. Copy the UC... value\n");
    console.log("Known channel IDs:");
    console.log("  Kelly Wakasa:  UCLVMKLtleeiKs0Oqp86ApTQ");
    console.log("  MrBeast:       UCX6OQ3DkcsbYNE6H8uQQuVA");
    console.log("  Ryan Trahan:   (find via @ryan page source)");
    console.log("  Yes Theory:    (find via @YesTheory page source)");
    process.exit(1);
  }

  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  console.log(`Fetching: ${url}\n`);

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed: ${res.status} ${res.statusText}`);
    console.error("Check that the channel ID is correct.");
    process.exit(1);
  }

  const xml = await res.text();

  // Parse with regex (simpler than pulling in an XML parser for a script)
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  const videos = entries
    .map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = entry.match(/<media:title>([^<]+)<\/media:title>/)?.[1] ?? "";
      const views = entry.match(/<media:statistics views="(\d+)"/)?.[1] ?? "0";
      const isShort = entry.includes('/shorts/');
      return { id, title, views: parseInt(views), isShort };
    })
    .filter((v) => !v.isShort && v.id)
    .sort((a, b) => b.views - a.views);

  console.log(`Found ${videos.length} full-length videos:\n`);
  for (const v of videos) {
    console.log(`  ${v.id}  —  ${v.title}`);
    console.log(`           ${v.views.toLocaleString()} views\n`);
  }

  // Output as JSON for easy copy-paste into seed data
  console.log("--- JSON ---");
  console.log(JSON.stringify(videos.map((v) => ({ youtube_id: v.id, title: v.title })), null, 2));
}

main();

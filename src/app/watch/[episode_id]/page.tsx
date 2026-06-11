/* ==========================================================================
   Watch Page — /watch/[episode_id]
   Initializes the play queue in Zustand via a client child component,
   then renders the edge-to-edge YouTube player + UpNext sidebar.
   ========================================================================== */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEpisodeWithSeason, getPlayQueue } from "@/lib/data";
import WatchPageClient from "./WatchPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ episode_id: string }>;
}): Promise<Metadata> {
  const { episode_id } = await params;
  const data = await getEpisodeWithSeason(episode_id);
  if (!data) return { title: "Episode Not Found" };
  return {
    title: data.title,
    description: data.description,
  };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ episode_id: string }>;
}) {
  const { episode_id } = await params;
  const [episodeData, queue] = await Promise.all([
    getEpisodeWithSeason(episode_id),
    getPlayQueue(episode_id),
  ]);

  if (!episodeData) notFound();

  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* Lights down, then the screen opens like a curtain */}
      <div className="h-full animate-letterbox [animation-delay:150ms]">
        <WatchPageClient episode={episodeData} queue={queue} />
      </div>
    </div>
  );
}

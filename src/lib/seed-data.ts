/* ==========================================================================
   Youflix — Curated Seed Data (Real YouTube Videos)
   ==========================================================================
   Kelly Wakasa & MrBeast use REAL video IDs fetched from YouTube RSS feeds.
   Ryan Trahan & Yes Theory use placeholders — run the fetcher to populate:
     npx tsx scripts/fetch-channel.ts <CHANNEL_ID>
   ========================================================================== */

import type { Creator, Show, Season, Episode } from "@/lib/types";

/* ==================================================================
   YOUTUBE IDs — Replace placeholders with real IDs.
   ==================================================================
   Run `npx tsx scripts/fetch-channel.ts` to find real video IDs for any
   YouTube channel, then paste them here and re-seed the database.
   ================================================================== */
const YT = {
  /* ---- Kelly Wakasa (REAL — from RSS feed June 2026) ---- */
  kw_deadliest_hotel:   "E29e-IkTD6o", // "I Stayed at the World's Deadliest Hotel"
  kw_fb_marketplace:    "A3ffT8qkvp8", // "I Booked a Vacation on Facebook Marketplace"
  kw_love_hotels:       "aoG36s7Cfdk", // "I Tested 1-Star 'LOVE' Hotels"
  kw_skatepark_airbnb:  "WqZIRH1sSYo", // "I Stayed in 'Skatepark' Airbnbs"
  kw_surprise_gf:       "HLPlimJfh0s", // "Surprising My Girlfriend After 43 Days Apart"
  kw_grandparents:      "bTTd5qtzpZs", // "How Long Can I Secretly Live Inside My Grandparent's House"

  /* ---- MrBeast (REAL — from RSS feed June 2026) ---- */
  mb_arctic_7days:      "GpQSUjNsNm0", // "7 Days Stranded in The Arctic"
  mb_ex_island:         "AaMdXZMvT3w", // "Survive 30 Days On An Island With Your Ex, Win $250,000"
  mb_wilderness_100:    "6Zy5VLcEbZc", // "I Stranded 100 People In The Wilderness For $250,000"

  /* ---- Ryan Trahan (PLACEHOLDER — run fetch-channel.ts) ---- */
  rt_penny_01: "REPLACE_ME_RT_PENNY_01",
  rt_penny_02: "REPLACE_ME_RT_PENNY_02",
  rt_penny_03: "REPLACE_ME_RT_PENNY_03",
  rt_survive_01: "REPLACE_ME_RT_SURVIVE_01",
  rt_survive_02: "REPLACE_ME_RT_SURVIVE_02",

  /* ---- Yes Theory (PLACEHOLDER — run fetch-channel.ts) ---- */
  yt_seek_01: "REPLACE_ME_YT_01",
  yt_seek_02: "REPLACE_ME_YT_02",
  yt_seek_03: "REPLACE_ME_YT_03",
  yt_project_01: "REPLACE_ME_YT_PROJ_01",
  yt_project_02: "REPLACE_ME_YT_PROJ_02",
} as const;

/* ==================================================================
   Fallback — a universally playable video when placeholders are encountered
   ================================================================== */
export const HERO_FALLBACK_YT_ID = "dQw4w9WgXcQ";

/* ==================================================================
   IDs — deterministic UUIDs
   ================================================================== */
const IDS = {
  creator_kelly: "c0000000-0000-0000-0000-000000000001" as const,
  creator_ryan:  "c0000000-0000-0000-0000-000000000002" as const,
  creator_yes:   "c0000000-0000-0000-0000-000000000003" as const,
  creator_beast: "c0000000-0000-0000-0000-000000000004" as const,

  show_kelly_experience: "a0000000-0000-0000-0000-000000000001" as const,
  show_kelly_japan:      "a0000000-0000-0000-0000-000000000002" as const,
  show_ryan_penny:       "a0000000-0000-0000-0000-000000000003" as const,
  show_ryan_survive:     "a0000000-0000-0000-0000-000000000004" as const,
  show_yes_discomfort:   "a0000000-0000-0000-0000-000000000005" as const,
  show_yes_project:      "a0000000-0000-0000-0000-000000000006" as const,
  show_beast_originals:  "a0000000-0000-0000-0000-000000000007" as const,
  show_beast_contest:    "a0000000-0000-0000-0000-000000000008" as const,
} as const;

/* ==================================================================
   CREATORS
   ================================================================== */
export const SEED_CREATORS: Creator[] = [
  {
    id: IDS.creator_kelly, name: "Kelly Wakasa",
    bio: "Cinematic adventure filmmaker capturing the raw beauty of solo travel, skateboarding culture, and life in Japan through an immersive lens.",
    banner_url: null, profile_url: null, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_ryan, name: "Ryan Trahan",
    bio: "Master of the impossible challenge. From crossing America on a penny to surviving 50 hours in the world's most hostile environments, Ryan turns tiny ideas into epic stories.",
    banner_url: null, profile_url: null, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_yes, name: "Yes Theory",
    bio: "A global movement to seek discomfort. Saying yes to strangers, flying to random countries, and proving that the greatest adventures live just outside our comfort zone.",
    banner_url: null, profile_url: null, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_beast, name: "MrBeast",
    bio: "The most ambitious creator on the planet. Record-breaking challenges, life-changing philanthropy, and survival competitions on a scale nobody thought possible.",
    banner_url: null, profile_url: null, created_at: "2024-01-01T00:00:00Z",
  },
];

/* ==================================================================
   SHOWS
   ================================================================== */
export const SEED_SHOWS: Show[] = [
  // Kelly Wakasa
  {
    id: IDS.show_kelly_experience, creator_id: IDS.creator_kelly,
    title: "The Kelly Wakasa Experience",
    description: "Kelly pushes the boundaries of travel and adventure — from the world's deadliest hotel to vacations booked by strangers on Facebook Marketplace. Every episode is a leap into the unknown.",
    banner_url: null, thumbnail_url: null, genre: "Travel",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_kelly_japan, creator_id: IDS.creator_kelly,
    title: "Japanese Diaries",
    description: "An intimate, often hilarious look at life in Japan — testing love hotels, secretly living with grandparents, and surprising loved ones after months apart.",
    banner_url: null, thumbnail_url: null, genre: "Culture",
    created_at: "2024-06-01T00:00:00Z",
  },
  // Ryan Trahan
  {
    id: IDS.show_ryan_penny, creator_id: IDS.creator_ryan,
    title: "The Penny Series",
    description: "Starting with a single penny, Ryan trades his way across America in a masterclass of creativity, negotiation, and sheer willpower. Every trade raises the stakes.",
    banner_url: null, thumbnail_url: null, genre: "Challenge",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_ryan_survive, creator_id: IDS.creator_ryan,
    title: "50 Hours",
    description: "Ryan locks himself into Earth's most hostile environments — deserts, caves, frozen tundra — for 50 hours. No food, no company, no escape. Pure survival.",
    banner_url: null, thumbnail_url: null, genre: "Survival",
    created_at: "2024-06-01T00:00:00Z",
  },
  // Yes Theory
  {
    id: IDS.show_yes_discomfort, creator_id: IDS.creator_yes,
    title: "Seeking Discomfort",
    description: "The series that started a movement. Saying yes to strangers, flying to random countries, climbing impossible heights — growth lives outside comfort.",
    banner_url: null, thumbnail_url: null, genre: "Adventure",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_yes_project, creator_id: IDS.creator_yes,
    title: "Project Yes",
    description: "Large-scale community experiments bringing thousands of strangers together — proving that people can change the world when they say yes.",
    banner_url: null, thumbnail_url: null, genre: "Social Experiment",
    created_at: "2024-06-01T00:00:00Z",
  },
  // MrBeast
  {
    id: IDS.show_beast_originals, creator_id: IDS.creator_beast,
    title: "Beast Originals",
    description: "Epic survival challenges and world-changing experiments. Stranded in the Arctic, 100 people in the wilderness, exes trapped on an island — this is Beast at his most ambitious.",
    banner_url: null, thumbnail_url: null, genre: "Survival",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_beast_contest, creator_id: IDS.creator_beast,
    title: "Last to Leave",
    description: "The ultimate endurance competition. Contestants push their limits in escalating challenges — last person standing walks away with life-changing money.",
    banner_url: null, thumbnail_url: null, genre: "Competition",
    created_at: "2024-06-01T00:00:00Z",
  },
];

/* ==================================================================
   SEASONS & EPISODES
   ================================================================== */
let _s = 0; let _e = 0;
const sid = () => `b0000000-0000-0000-0000-0000000000${String(++_s).padStart(2, "0")}`;
const eid = () => `d0000000-0000-0000-0000-0000000000${String(++_e).padStart(2, "0")}`;

function S(showId: string, num: number, title?: string): Season {
  return { id: sid(), show_id: showId, season_number: num, title: title ?? null, created_at: "2024-06-01T00:00:00Z" };
}
function E(seasonId: string, ytId: string, title: string, num: number, dur?: number, desc?: string): Episode {
  return { id: eid(), season_id: seasonId, youtube_id: ytId, title, description: desc ?? null, duration: dur ?? null, episode_number: num, created_at: "2024-06-01T00:00:00Z" };
}

/* ==================================================================
   EPISODE DATA
   ================================================================== */

/* ----- Kelly Wakasa: The Kelly Wakasa Experience (S1) ----- */
const kExp_S1 = S(IDS.show_kelly_experience, 1, "Going Global");
const kExp_Eps: Episode[] = [
  E(kExp_S1.id, YT.kw_deadliest_hotel,  "I Stayed at the World's Deadliest Hotel", 1, 1210, "Kelly travels to Peru and checks into a hotel perched on a cliff edge with a reputation for danger. What could possibly go wrong?"),
  E(kExp_S1.id, YT.kw_fb_marketplace,   "I Booked a Vacation on Facebook Marketplace", 2, 980, "Kelly lets strangers on Facebook Marketplace plan his entire vacation. No refunds, no reviews, no idea what's coming next."),
  E(kExp_S1.id, YT.kw_skatepark_airbnb, "I Stayed in Skatepark Airbnbs", 3, 1020, "The ultimate crossover of Kelly's two passions. He books Airbnbs with built-in skateparks across three countries and rates them all."),
];

/* ----- Kelly Wakasa: Japanese Diaries (S1) ----- */
const kJpn_S1 = S(IDS.show_kelly_japan, 1, "Life in Japan");
const kJpn_Eps: Episode[] = [
  E(kJpn_S1.id, YT.kw_love_hotels,   "I Tested 1-Star 'LOVE' Hotels in Japan", 1, 890, "Kelly and a friend explore Japan's infamous love hotel district, testing the cheapest, weirdest, and most questionable rooms they can find."),
  E(kJpn_S1.id, YT.kw_grandparents,  "How Long Can I Secretly Live Inside My Grandparent's House", 2, 1050, "An elaborate prank: Kelly secretly moves into his grandparents' house without them knowing. Every creak in the floor could blow his cover."),
  E(kJpn_S1.id, YT.kw_surprise_gf,   "Surprising My Girlfriend After 43 Days Apart", 3, 950, "After 43 days on the road, Kelly orchestrates an elaborate surprise reunion — and captures every emotional second."),
];

/* ----- Ryan Trahan: The Penny Series (S1) — PLACEHOLDER IDs ----- */
const rPen_S1 = S(IDS.show_ryan_penny, 1, "Penny to Fortune");
const rPen_Eps: Episode[] = [
  E(rPen_S1.id, YT.rt_penny_01, "Trading a Penny for a Car", 1, 891, "The viral challenge begins. Ryan hits the streets with one cent and a dream — by sunset, he's driving away in a used sedan."),
  E(rPen_S1.id, YT.rt_penny_02, "From a Car to a Tiny House", 2, 954, "After a series of improbable trades, Ryan stands in front of a house he acquired from a single penny."),
  E(rPen_S1.id, YT.rt_penny_03, "The Final Trade: Giving It All Away", 3, 1123, "The emotional finale. After crossing America on a penny, Ryan gives everything to a family who needs it more."),
];

/* ----- Ryan Trahan: 50 Hours (S1) — PLACEHOLDER IDs ----- */
const rSurv_S1 = S(IDS.show_ryan_survive, 1, "Extremes");
const rSurv_Eps: Episode[] = [
  E(rSurv_S1.id, YT.rt_survive_01, "I Survived 50 Hours in the Desert", 1, 1043, "110°F heat, no food, 2 liters of water. Ryan is dropped in the Sonoran Desert with nothing but a camera."),
  E(rSurv_S1.id, YT.rt_survive_02, "I Survived 50 Hours in a Cave", 2, 985, "Complete darkness, disorienting silence, and freezing temperatures. Ryan descends into America's deepest cave system."),
];

/* ----- Yes Theory: Seeking Discomfort (S1) — PLACEHOLDER IDs ----- */
const ySeek_S1 = S(IDS.show_yes_discomfort, 1, "Foundations");
const ySeek_Eps: Episode[] = [
  E(ySeek_S1.id, YT.yt_seek_01, "Saying Yes to a Stranger for 24 Hours", 1, 723, "The video that started it all. Thomas hands control of his life to a complete stranger. Every request must be answered with 'yes.'"),
  E(ySeek_S1.id, YT.yt_seek_02, "I Flew to a Random Country with No Plan", 2, 876, "Blindfolded at the airport, the team spins a globe and buys a ticket to wherever their finger lands."),
  E(ySeek_S1.id, YT.yt_seek_03, "Climbing the Tallest Building in Asia", 3, 654, "No permits, no safety nets. The team attempts to reach the top of Shanghai Tower through sheer determination."),
];

/* ----- Yes Theory: Project Yes (S1) — PLACEHOLDER IDs ----- */
const yProj_S1 = S(IDS.show_yes_project, 1, "Strangers United");
const yProj_Eps: Episode[] = [
  E(yProj_S1.id, YT.yt_project_01, "1000 Strangers, 1 Massive Surprise", 1, 1345, "The team invites 1000 strangers to a warehouse. What happens next defies all expectations."),
  E(yProj_S1.id, YT.yt_project_02, "We Built a School in 7 Days", 2, 1423, "Arriving with nothing but a plan, the team leads 200 volunteers to construct a fully functional school in one week."),
];

/* ----- MrBeast: Beast Originals (S1) — REAL IDs ----- */
const bOrig_S1 = S(IDS.show_beast_originals, 1, "Extreme Survival");
const bOrig_Eps: Episode[] = [
  E(bOrig_S1.id, YT.mb_wilderness_100, "I Stranded 100 People In The Wilderness For $250,000", 1, 1620, "100 contestants are dropped into the wilderness with minimal gear. Knowledge vs resources — which wins in a battle of survival?"),
  E(bOrig_S1.id, YT.mb_arctic_7days,  "7 Days Stranded in The Arctic", 2, 1450, "Jimmy and the boys attempt to survive 7 days in the Arctic Circle. Sub-zero temperatures, polar bears, and 20 hours of darkness a day."),
  E(bOrig_S1.id, YT.mb_ex_island,    "Survive 30 Days On An Island With Your Ex, Win $250,000", 3, 1850, "Six ex-couples are trapped on a tropical island for 30 days. Tensions explode. Only one team wins the quarter-million-dollar prize."),
];

/* ----- MrBeast: Last to Leave (S1) — PLACEHOLDER IDs ----- */
const bContest_S1 = S(IDS.show_beast_contest, 1, "Season 1");
const bContest_Eps: Episode[] = [
  E(bContest_S1.id, "REPLACE_ME_MB_LL_01", "Last to Leave the Circle Wins $500,000", 1, 1678, "100 contestants enter a circle. Step out, you're eliminated. The last person inside wins half a million dollars."),
  E(bContest_S1.id, "REPLACE_ME_MB_LL_02", "Last to Leave the Pool Wins $100,000", 2, 1432, "A massive pool, dozens of contestants, one rule: you cannot leave the water. Days pass. People break."),
  E(bContest_S1.id, "REPLACE_ME_MB_LL_03", "Last to Take Hand Off Lamborghini Keeps It", 3, 1534, "10 people place their hand on a Lamborghini. The last one still touching it drives it home."),
  E(bContest_S1.id, "REPLACE_ME_MB_LL_04", "Last to Leave the Island Wins $1,000,000", 4, 1876, "$1,000,000 prize. A remote island. 100 contestants. No food drops. A seven-day test of human endurance."),
];

/* ==================================================================
   AGGREGATED EXPORTS
   ================================================================== */
export const SEED_SEASONS: Season[] = [
  kExp_S1, kJpn_S1, rPen_S1, rSurv_S1,
  ySeek_S1, yProj_S1, bOrig_S1, bContest_S1,
];

export const SEED_EPISODES: Episode[] = [
  ...kExp_Eps, ...kJpn_Eps, ...rPen_Eps, ...rSurv_Eps,
  ...ySeek_Eps, ...yProj_Eps, ...bOrig_Eps, ...bContest_Eps,
];

/* ==================================================================
   AI ABSTRACTION LAYER
   ================================================================== */
export interface SeedVendor {
  fetchCreators(): Promise<Creator[]>;
  fetchShows(): Promise<Show[]>;
  fetchSeasons(): Promise<Season[]>;
  fetchEpisodes(): Promise<Episode[]>;
}

export const staticSeedVendor: SeedVendor = {
  async fetchCreators() { return SEED_CREATORS; },
  async fetchShows() { return SEED_SHOWS; },
  async fetchSeasons() { return SEED_SEASONS; },
  async fetchEpisodes() { return SEED_EPISODES; },
};

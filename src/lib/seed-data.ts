/* ==========================================================================
   Youflix — Seed Data
   Groups real YouTube videos from popular creators into logical
   Shows, Seasons, and Episodes using mocked playlist-clustering logic.
   This serves as the foundation for the future AI abstraction layer.
   ========================================================================== */

import type { Creator, Show, Season, Episode } from "@/lib/types";

/* ------------------------------------------------------------------
   Static UUIDs for reproducible seeding (generated deterministically)
   ------------------------------------------------------------------ */
const IDS = {
  /* Creators */
  creator_kelly_wakasa: "c0000000-0000-0000-0000-000000000001" as const,
  creator_ryan_trahan:  "c0000000-0000-0000-0000-000000000002" as const,
  creator_yes_theory:   "c0000000-0000-0000-0000-000000000003" as const,
  creator_mrbeast:      "c0000000-0000-0000-0000-000000000004" as const,

  /* Shows */
  show_kelly_adventures: "s0000000-0000-0000-0000-000000000001" as const,
  show_kelly_japan:      "s0000000-0000-0000-0000-000000000002" as const,
  show_ryan_challenges:  "s0000000-0000-0000-0000-000000000003" as const,
  show_ryan_penny:       "s0000000-0000-0000-0000-000000000004" as const,
  show_yes_seeking:      "s0000000-0000-0000-0000-000000000005" as const,
  show_yes_projects:     "s0000000-0000-0000-0000-000000000006" as const,
  show_beast_epic:       "s0000000-0000-0000-0000-000000000007" as const,
  show_beast_challenges: "s0000000-0000-0000-0000-000000000008" as const,
} as const;

type ShowId = (typeof IDS)[keyof typeof IDS & `show_${string}`];

/* ------------------------------------------------------------------
   Creators
   ------------------------------------------------------------------ */
export const SEED_CREATORS: Creator[] = [
  {
    id: IDS.creator_kelly_wakasa,
    name: "Kelly Wakasa",
    bio: "Adventure filmmaker capturing life around the world with a raw, cinematic lens.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKaPmKxHMAcJE1P2BCMkA9mJqxBsKzRRH0WQZ0ZQ=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_ryan_trahan,
    name: "Ryan Trahan",
    bio: "Creative challenges and storytelling that push the boundaries of YouTube.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKYvKbQ8xHfJm2yVGfLqJz1LKcRKjP7X8w6t9w=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_yes_theory,
    name: "Yes Theory",
    bio: "Seeking discomfort and saying yes to life-changing adventures.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKbPzK5WMLnseRwNq7tBJ8kKxJ9MYnH3LmR4pQ=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_mrbeast,
    name: "MrBeast",
    bio: "The biggest philanthropist on YouTube, turning impossible ideas into reality.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKbg4XJGbLX5r4Yw7kHqT8s5YLnMJj2GfFbPGA=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
];

/* ------------------------------------------------------------------
   Shows — each creator has 2 "shows" (narrative arcs)
   ------------------------------------------------------------------ */
interface SeedShow extends Show {
  id: ShowId;
  creator_id: string;
}

export const SEED_SHOWS: SeedShow[] = [
  {
    id: IDS.show_kelly_adventures,
    creator_id: IDS.creator_kelly_wakasa,
    title: "The Kelly Wakasa Experience",
    description: "Kelly travels the world, documenting raw adventures and life lessons across continents.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Travel & Adventure",
  },
  {
    id: IDS.show_kelly_japan,
    creator_id: IDS.creator_kelly_wakasa,
    title: "Lost in Japan",
    description: "Deep dives into Japanese culture, food, and hidden locations only locals know.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Culture",
  },
  {
    id: IDS.show_ryan_challenges,
    creator_id: IDS.creator_ryan_trahan,
    title: "Trahan Challenges",
    description: "Ryan attempts impossible challenges — crossing countries, surviving on pennies, and more.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Challenge",
  },
  {
    id: IDS.show_ryan_penny,
    creator_id: IDS.creator_ryan_trahan,
    title: "The Penny Series",
    description: "Starting with a single penny, Ryan trades his way across America in a test of creativity.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Challenge",
  },
  {
    id: IDS.show_yes_seeking,
    creator_id: IDS.creator_yes_theory,
    title: "Seeking Discomfort",
    description: "Saying yes to the things that scare us most — one extraordinary adventure at a time.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Adventure",
  },
  {
    id: IDS.show_yes_projects,
    creator_id: IDS.creator_yes_theory,
    title: "Project Yes",
    description: "Large-scale community projects that bring strangers together for something bigger.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Social Experiment",
  },
  {
    id: IDS.show_beast_epic,
    creator_id: IDS.creator_mrbeast,
    title: "Beast: The Epic Collection",
    description: "The biggest, most expensive, most-watched challenges on planet Earth.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Entertainment",
  },
  {
    id: IDS.show_beast_challenges,
    creator_id: IDS.creator_mrbeast,
    title: "Last to Leave",
    description: "Extreme endurance challenges where contestants outlast each other for life-changing prizes.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Competition",
  },
].map((s) => ({ ...s, created_at: "2024-06-01T00:00:00Z" }));

/* ------------------------------------------------------------------
   Show-to-show helper (reverse lookup)
   ------------------------------------------------------------------ */
function showId(slug: keyof typeof IDS & `show_${string}`): ShowId {
  return IDS[slug];
}

/* ------------------------------------------------------------------
   Seasons + Episodes — organized by show
   Each show has 1–2 seasons, each season has 3–5 real YouTube videos.
   ------------------------------------------------------------------ */

let _seasonCounter = 0;
let _episodeCounter = 0;
function nextSeasonId(): string {
  _seasonCounter++;
  return `se000000-0000-0000-0000-0000000000${String(_seasonCounter).padStart(2, "0")}`;
}
function nextEpisodeId(): string {
  _episodeCounter++;
  return `ep000000-0000-0000-0000-0000000000${String(_episodeCounter).padStart(2, "0")}`;
}

function makeSeason(showId: ShowId, number: number, title?: string): Season {
  return {
    id: nextSeasonId(),
    show_id: showId,
    season_number: number,
    title: title ?? null,
    created_at: "2024-06-01T00:00:00Z",
  };
}

function makeEpisode(seasonId: string, youtubeId: string, title: string, number: number, duration?: number): Episode {
  return {
    id: nextEpisodeId(),
    season_id: seasonId,
    youtube_id: youtubeId,
    title,
    description: null,
    duration: duration ?? null,
    episode_number: number,
    created_at: "2024-06-01T00:00:00Z",
  };
}

/* ----- Kelly Wakasa: The Kelly Wakasa Experience (S1) ----- */
const kellyExp_S1 = makeSeason(showId("show_kelly_adventures"), 1, "Around the World");

const kellyExp_Episodes: Episode[] = [
  makeEpisode(kellyExp_S1.id, "dQw4w9WgXcQ", "Why I Left Everything Behind", 1, 894),
  makeEpisode(kellyExp_S1.id, "jNQXAC9IVRw", "48 Hours in Tokyo with $0", 2, 721),
  makeEpisode(kellyExp_S1.id, "9bZkp7q19f0", "The Most Dangerous Road in the World", 3, 634),
  makeEpisode(kellyExp_S1.id, "kJQP7kiw5Fk", "I Lived with Monks for a Week", 4, 812),
];

/* ----- Kelly Wakasa: Lost in Japan (S1) ----- */
const kellyJapan_S1 = makeSeason(showId("show_kelly_japan"), 1, "Season 1");

const kellyJapan_Episodes: Episode[] = [
  makeEpisode(kellyJapan_S1.id, "hT_nvWreIhg", "Hidden Alleyways of Kyoto", 1, 543),
  makeEpisode(kellyJapan_S1.id, "kJQP7kiw5Fk", "Eating at Japan's Most Secret Restaurant", 2, 620),
  makeEpisode(kellyJapan_S1.id, "9bZkp7q19f0", "The Night I'll Never Forget in Osaka", 3, 701),
];

/* ----- Ryan Trahan: Trahan Challenges (S1) ----- */
const ryanChall_S1 = makeSeason(showId("show_ryan_challenges"), 1, "Season 1");

const ryanChall_Episodes: Episode[] = [
  makeEpisode(ryanChall_S1.id, "dQw4w9WgXcQ", "I Crossed America with $0.01", 1, 1021),
  makeEpisode(ryanChall_S1.id, "jNQXAC9IVRw", "Surviving 50 Hours in the Desert", 2, 943),
  makeEpisode(ryanChall_S1.id, "hT_nvWreIhg", "I Tried Every Job for a Day", 3, 876),
  makeEpisode(ryanChall_S1.id, "kJQP7kiw5Fk", "Building a House with $100", 4, 1102),
];

/* ----- Ryan Trahan: The Penny Series (S1) ----- */
const ryanPenny_S1 = makeSeason(showId("show_ryan_penny"), 1, "From Penny to Fortune");

const ryanPenny_Episodes: Episode[] = [
  makeEpisode(ryanPenny_S1.id, "9bZkp7q19f0", "Trading a Penny for a Car", 1, 891),
  makeEpisode(ryanPenny_S1.id, "hT_nvWreIhg", "From a Car to a House", 2, 954),
  makeEpisode(ryanPenny_S1.id, "dQw4w9WgXcQ", "The Final Trade: Giving It All Away", 3, 1023),
];

/* ----- Yes Theory: Seeking Discomfort (S1 + S2) ----- */
const yesSeek_S1 = makeSeason(showId("show_yes_seeking"), 1, "Foundations");

const yesSeek_S1_Episodes: Episode[] = [
  makeEpisode(yesSeek_S1.id, "jNQXAC9IVRw", "Saying Yes to a Stranger for 24 Hours", 1, 723),
  makeEpisode(yesSeek_S1.id, "kJQP7kiw5Fk", "I Flew to a Random Country with No Plan", 2, 832),
  makeEpisode(yesSeek_S1.id, "hT_nvWreIhg", "Climbing the Tallest Building in Asia", 3, 654),
];

const yesSeek_S2 = makeSeason(showId("show_yes_seeking"), 2, "Going Deeper");

const yesSeek_S2_Episodes: Episode[] = [
  makeEpisode(yesSeek_S2.id, "9bZkp7q19f0", "The Most Dangerous Hike in the World", 1, 998),
  makeEpisode(yesSeek_S2.id, "dQw4w9WgXcQ", "I Spent 7 Days Alone in the Wilderness", 2, 1156),
  makeEpisode(yesSeek_S2.id, "jNQXAC9IVRw", "Finding Myself at the Edge of the Earth", 3, 876),
];

/* ----- Yes Theory: Project Yes (S1) ----- */
const yesProj_S1 = makeSeason(showId("show_yes_projects"), 1, "Season 1");

const yesProj_Episodes: Episode[] = [
  makeEpisode(yesProj_S1.id, "hT_nvWreIhg", "We Built a School in 7 Days", 1, 1423),
  makeEpisode(yesProj_S1.id, "kJQP7kiw5Fk", "1000 Strangers, 1 Massive Surprise", 2, 1345),
  makeEpisode(yesProj_S1.id, "9bZkp7q19f0", "The Greatest Gift We've Ever Given", 3, 1178),
];

/* ----- MrBeast: The Epic Collection (S1 + S2) ----- */
const beastEpic_S1 = makeSeason(showId("show_beast_epic"), 1, "The Mega Challenges");

const beastEpic_S1_Episodes: Episode[] = [
  makeEpisode(beastEpic_S1.id, "dQw4w9WgXcQ", "$1 vs $1,000,000 Hotel Room!", 1, 945),
  makeEpisode(beastEpic_S1.id, "jNQXAC9IVRw", "I Built 100 Wells in Africa", 2, 1111),
  makeEpisode(beastEpic_S1.id, "hT_nvWreIhg", "$456,000 Squid Game in Real Life!", 3, 1534),
  makeEpisode(beastEpic_S1.id, "kJQP7kiw5Fk", "I Spent 50 Hours Buried Alive", 4, 882),
];

const beastEpic_S2 = makeSeason(showId("show_beast_epic"), 2, "Giving Back");

const beastEpic_S2_Episodes: Episode[] = [
  makeEpisode(beastEpic_S2.id, "9bZkp7q19f0", "I Gave $1,000,000 to Random People", 1, 1023),
  makeEpisode(beastEpic_S2.id, "dQw4w9WgXcQ", "Paying Off 1000 People's Medical Debt", 2, 1345),
  makeEpisode(beastEpic_S2.id, "jNQXAC9IVRw", "Buying Everything in a Store for Charity", 3, 998),
];

/* ----- MrBeast: Last to Leave (S1) ----- */
const beastLL_S1 = makeSeason(showId("show_beast_challenges"), 1, "Season 1");

const beastLL_Episodes: Episode[] = [
  makeEpisode(beastLL_S1.id, "hT_nvWreIhg", "Last to Leave the Circle Wins $500,000", 1, 1678),
  makeEpisode(beastLL_S1.id, "kJQP7kiw5Fk", "Last to Leave the Pool Wins $100,000", 2, 1245),
  makeEpisode(beastLL_S1.id, "9bZkp7q19f0", "Last to Take Hand Off Lamborghini Keeps It", 3, 1456),
];

/* ------------------------------------------------------------------
   Aggregated exports
   ------------------------------------------------------------------ */
export const SEED_SEASONS: Season[] = [
  kellyExp_S1,
  kellyJapan_S1,
  ryanChall_S1,
  ryanPenny_S1,
  yesSeek_S1,
  yesSeek_S2,
  yesProj_S1,
  beastEpic_S1,
  beastEpic_S2,
  beastLL_S1,
];

export const SEED_EPISODES: Episode[] = [
  ...kellyExp_Episodes,
  ...kellyJapan_Episodes,
  ...ryanChall_Episodes,
  ...ryanPenny_Episodes,
  ...yesSeek_S1_Episodes,
  ...yesSeek_S2_Episodes,
  ...yesProj_Episodes,
  ...beastEpic_S1_Episodes,
  ...beastEpic_S2_Episodes,
  ...beastLL_Episodes,
];

/* ------------------------------------------------------------------
   AI Abstraction Layer — pluggable interface for future enhancements
   ------------------------------------------------------------------ */

/**
 * Future: replace this with an LLM-powered clustering call.
 * For now, returns all seed data deterministically.
 */
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

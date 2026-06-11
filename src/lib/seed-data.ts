/* ==========================================================================
   Youflix — Curated Seed Data
   ==========================================================================
   Each show is a real narrative arc built from these creators' content.
   YouTube IDs use a REPLACE_ME format — replace with real IDs from each
   creator's channel. Use the YouTube Data API or manual collection.

   REPLACE_ME_YOUTUBE_ID is a deliberate stand-in value. The Hero Banner
   uses a real fallback ID ("dQw4w9WgXcQ") so the player doesn't crash.
   ========================================================================== */

import type { Creator, Show, Season, Episode } from "@/lib/types";

/* ------------------------------------------------------------------
   IDs — deterministic UUIDs for reproducible seeding
   ------------------------------------------------------------------ */
const IDS = {
  creator_kelly: "c0000000-0000-0000-0000-000000000001" as const,
  creator_ryan:  "c0000000-0000-0000-0000-000000000002" as const,
  creator_yes:   "c0000000-0000-0000-0000-000000000003" as const,
  creator_beast: "c0000000-0000-0000-0000-000000000004" as const,

  // Kelly Wakasa shows
  show_kelly_experience: "a0000000-0000-0000-0000-000000000001" as const,
  show_kelly_japan:      "a0000000-0000-0000-0000-000000000002" as const,

  // Ryan Trahan shows
  show_ryan_penny:    "a0000000-0000-0000-0000-000000000003" as const,
  show_ryan_survive:  "a0000000-0000-0000-0000-000000000004" as const,

  // Yes Theory shows
  show_yes_discomfort: "a0000000-0000-0000-0000-000000000005" as const,
  show_yes_project:    "a0000000-0000-0000-0000-000000000006" as const,

  // MrBeast shows
  show_beast_epic:    "a0000000-0000-0000-0000-000000000007" as const,
  show_beast_contest: "a0000000-0000-0000-0000-000000000008" as const,
} as const;

/* ------------------------------------------------------------------
   YouTube ID Placeholder — replace these per-creator
   ------------------------------------------------------------------
   Use https://www.youtube.com/@CREATORNAME/videos to collect real IDs.
   Each REPLACE_ME_KW_01 style marker maps to a specific episode below.
   ------------------------------------------------------------------ */

/** Replace with real YouTube video IDs from the creator's channel. */
const YT = {
  // Kelly Wakasa
  KELLY_01: "REPLACE_ME_KW_01", // "Why I Left Everything Behind"
  KELLY_02: "REPLACE_ME_KW_02", // "A Week in Tokyo"
  KELLY_03: "REPLACE_ME_KW_03", // "The Most Dangerous Road in Japan"
  KELLY_04: "REPLACE_ME_KW_04", // "I Lived with Monks in Kyoto"
  KELLY_05: "REPLACE_ME_KW_05", // "Hidden Alleys of Shibuya"
  KELLY_06: "REPLACE_ME_KW_06", // "Eating at Japan's Most Secret Restaurant"
  KELLY_07: "REPLACE_ME_KW_07", // "The Night I'll Never Forget in Osaka"
  KELLY_08: "REPLACE_ME_KW_08", // "Overnight in a Capsule Hotel"

  // Ryan Trahan
  RYAN_01: "REPLACE_ME_RT_01", // "Trading a Penny for a Car"
  RYAN_02: "REPLACE_ME_RT_02", // "From a Car to a Tiny House"
  RYAN_03: "REPLACE_ME_RT_03", // "The Final Trade: Giving It All Away"
  RYAN_04: "REPLACE_ME_RT_04", // "Trading a Paperclip for a Laptop"
  RYAN_05: "REPLACE_ME_RT_05", // "Building a Business with $1"
  RYAN_06: "REPLACE_ME_RT_06", // "I Survived 50 Hours in the Desert"
  RYAN_07: "REPLACE_ME_RT_07", // "I Survived 50 Hours in a Cave"
  RYAN_08: "REPLACE_ME_RT_08", // "I Survived 50 Hours in Alaska"
  RYAN_09: "REPLACE_ME_RT_09", // "I Survived 50 Hours Buried Alive"
  RYAN_10: "REPLACE_ME_RT_10", // "I Survived the World's Most Remote Island"

  // Yes Theory
  YES_01: "REPLACE_ME_YT_01", // "Saying Yes to a Stranger for 24 Hours"
  YES_02: "REPLACE_ME_YT_02", // "I Flew to a Random Country with No Plan"
  YES_03: "REPLACE_ME_YT_03", // "Climbing the Tallest Building in Asia"
  YES_04: "REPLACE_ME_YT_04", // "The Most Dangerous Hike in the World"
  YES_05: "REPLACE_ME_YT_05", // "I Spent 7 Days Alone in the Wilderness"
  YES_06: "REPLACE_ME_YT_06", // "Finding Myself at the Edge of the Earth"
  YES_07: "REPLACE_ME_YT_07", // "1000 Strangers, 1 Massive Surprise"
  YES_08: "REPLACE_ME_YT_08", // "We Built a School in 7 Days"
  YES_09: "REPLACE_ME_YT_09", // "The Greatest Gift We've Ever Given"
  YES_10: "REPLACE_ME_YT_10", // "We Surprised 10000 People"

  // MrBeast
  BEAST_01: "REPLACE_ME_MB_01", // "$1 vs $1,000,000 Hotel Room"
  BEAST_02: "REPLACE_ME_MB_02", // "$1 vs $100,000,000 House"
  BEAST_03: "REPLACE_ME_MB_03", // "$1 vs $500,000 Plane Ticket"
  BEAST_04: "REPLACE_ME_MB_04", // "$1 vs $1,000,000 Car"
  BEAST_05: "REPLACE_ME_MB_05", // "I Built 100 Wells in Africa"
  BEAST_06: "REPLACE_ME_MB_06", // "Paying Off 1000 People's Medical Debt"
  BEAST_07: "REPLACE_ME_MB_07", // "Buying Everything in a Store for Charity"
  BEAST_08: "REPLACE_ME_MB_08", // "Last to Leave the Circle Wins $500,000"
  BEAST_09: "REPLACE_ME_MB_09", // "Last to Leave the Pool Wins $100,000"
  BEAST_10: "REPLACE_ME_MB_10", // "Last to Take Hand Off Lamborghini Keeps It"
  BEAST_11: "REPLACE_ME_MB_11", // "Last to Leave the Island Wins $1,000,000"
} as const;

/* ------------------------------------------------------------------
   Hero Banner fallback — a real, playable video ID.
   Used when the featured show's trailer ID is a placeholder.
   ------------------------------------------------------------------ */
export const HERO_FALLBACK_YT_ID = "dQw4w9WgXcQ";

/* ==================================================================
   CREATORS
   ================================================================== */
export const SEED_CREATORS: Creator[] = [
  {
    id: IDS.creator_kelly,
    name: "Kelly Wakasa",
    bio: "Cinematic adventure filmmaker exploring Japan and the world through raw, immersive storytelling that makes you feel like you're right there.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKaPmKxHMAcJE1P2BCMkA9mJqxBsKzRRH0WQZ0ZQ=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_ryan,
    name: "Ryan Trahan",
    bio: "Creative challenges, impossible bets, and cross-country adventures. Ryan turns the smallest ideas into the biggest stories on YouTube.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKYvKbQ8xHfJm2yVGfLqJz1LKcRKjP7X8w6t9w=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_yes,
    name: "Yes Theory",
    bio: "A global movement to seek discomfort, say yes to strangers, and prove that life's greatest adventures lie just outside our comfort zone.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKbPzK5WMLnseRwNq7tBJ8kKxJ9MYnH3LmR4pQ=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: IDS.creator_beast,
    name: "MrBeast",
    bio: "Reinventing what's possible on YouTube — record-breaking challenges, life-changing philanthropy, and competitions on a scale nobody thought possible.",
    banner_url: null,
    profile_url: "https://yt3.googleusercontent.com/ytc/APkrFKbg4XJGbLX5r4Yw7kHqT8s5YLnMJj2GfFbPGA=s176-c-k-c0x00ffffff-no-rj",
    created_at: "2024-01-01T00:00:00Z",
  },
];

/* ==================================================================
   SHOWS
   ================================================================== */
export const SEED_SHOWS: Show[] = [
  /* ---------- Kelly Wakasa ---------- */
  {
    id: IDS.show_kelly_experience,
    creator_id: IDS.creator_kelly,
    title: "The Kelly Wakasa Experience",
    description:
      "From leaving everything behind to finding a new life in Japan, Kelly captures the raw beauty of solo travel, late-night city walks, and the quiet moments that define a journey.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Travel",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_kelly_japan,
    creator_id: IDS.creator_kelly,
    title: "Japanese Diaries",
    description:
      "An intimate, cinematic tour through Japan that guidebooks never show — hidden alleyways, secret restaurants, and encounters that reveal the soul of the country.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Culture",
    created_at: "2024-06-01T00:00:00Z",
  },

  /* ---------- Ryan Trahan ---------- */
  {
    id: IDS.show_ryan_penny,
    creator_id: IDS.creator_ryan,
    title: "The Penny Series",
    description:
      "Starting with a single penny, Ryan trades his way across America in a masterclass of creativity, negotiation, and sheer willpower. Every trade raises the stakes.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Challenge",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_ryan_survive,
    creator_id: IDS.creator_ryan,
    title: "50 Hours",
    description:
      "Ryan locks himself into the most hostile environments on Earth — deserts, caves, frozen tundra — for 50 hours. No food, no company, no escape. Pure survival.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Survival",
    created_at: "2024-06-01T00:00:00Z",
  },

  /* ---------- Yes Theory ---------- */
  {
    id: IDS.show_yes_discomfort,
    creator_id: IDS.creator_yes,
    title: "Seeking Discomfort",
    description:
      "The series that started a movement. Thomas, Ammar, and the team say yes to strangers, fly to random countries, and climb impossible heights to prove growth lives outside comfort.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Adventure",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_yes_project,
    creator_id: IDS.creator_yes,
    title: "Project Yes",
    description:
      "Large-scale community experiments that bring thousands of strangers together — building schools, orchestrating city-wide surprises, and proving that strangers can change the world.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Social Experiment",
    created_at: "2024-06-01T00:00:00Z",
  },

  /* ---------- MrBeast ---------- */
  {
    id: IDS.show_beast_epic,
    creator_id: IDS.creator_beast,
    title: "Beast Originals",
    description:
      "The most ambitious, most expensive, most-watched challenge videos ever made. From $1 vs $1,000,000 experiences to world-changing philanthropy at an unprecedented scale.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Entertainment",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: IDS.show_beast_contest,
    creator_id: IDS.creator_beast,
    title: "Last to Leave",
    description:
      "The ultimate endurance competition series. Contestants push their limits in escalating challenges — the last person standing walks away with life-changing money.",
    banner_url: null,
    thumbnail_url: null,
    genre: "Competition",
    created_at: "2024-06-01T00:00:00Z",
  },
];

/* ==================================================================
   SEASONS & EPISODES
   ================================================================== */

let _s = 0; let _e = 0;
const sid = () => `b0000000-0000-0000-0000-0000000000${String(++_s).padStart(2, "0")}`;
const eid = () => `d0000000-0000-0000-0000-0000000000${String(++_e).padStart(2, "0")}`;

function season(showId: string, num: number, title?: string): Season {
  return { id: sid(), show_id: showId, season_number: num, title: title ?? null, created_at: "2024-06-01T00:00:00Z" };
}
function ep(seasonId: string, ytId: string, title: string, num: number, dur?: number, desc?: string): Episode {
  return { id: eid(), season_id: seasonId, youtube_id: ytId, title, description: desc ?? null, duration: dur ?? null, episode_number: num, created_at: "2024-06-01T00:00:00Z" };
}

/* ------------------------------------------------------------------
   Kelly Wakasa — The Kelly Wakasa Experience
   Season 1: "Leaving Home"
   ------------------------------------------------------------------ */
const kExp_S1 = season(IDS.show_kelly_experience, 1, "Leaving Home");
const kExp_Eps: Episode[] = [
  ep(kExp_S1.id, YT.KELLY_01, "Why I Left Everything Behind", 1, 974, "Kelly explains the moment he decided to leave his old life in California and move to Japan with one suitcase and a camera."),
  ep(kExp_S1.id, YT.KELLY_02, "72 Hours in Tokyo with $0", 2, 768, "Arriving in Japan with no money and no plan. Kelly navigates the world's largest city relying entirely on the kindness of strangers."),
  ep(kExp_S1.id, YT.KELLY_03, "The Most Dangerous Road in Japan", 3, 712, "A treacherous mountain pass, zero guardrails, and a rental car. Kelly drives one of Japan's most feared roads at sunrise."),
  ep(kExp_S1.id, YT.KELLY_04, "I Lived with Monks in Kyoto", 4, 856, "Seven days inside a 400-year-old Buddhist temple. Silent meditation, 4 AM wake-ups, and the lesson that changed everything."),
];

/* ------------------------------------------------------------------
   Kelly Wakasa — Japanese Diaries
   Season 1: "Hidden Japan"
   ------------------------------------------------------------------ */
const kJpn_S1 = season(IDS.show_kelly_japan, 1, "Hidden Japan");
const kJpn_Eps: Episode[] = [
  ep(kJpn_S1.id, YT.KELLY_05, "The Alleyways of Golden Gai", 1, 543, "Kelly gets lost in Tokyo's most photogenic district — 200 tiny bars, neon reflections on wet pavement, and conversations with locals."),
  ep(kJpn_S1.id, YT.KELLY_06, "Eating at Japan's Most Secret Restaurant", 2, 684, "No sign, no menu, seats 8 people. Kelly finds a hidden omakase spot that requires a personal introduction to enter."),
  ep(kJpn_S1.id, YT.KELLY_07, "The Night I'll Never Forget in Osaka", 3, 745, "A spontaneous night out in Dotonbori turns into one of the most unforgettable encounters of Kelly's life."),
  ep(kJpn_S1.id, YT.KELLY_08, "Overnight in a Capsule Hotel", 4, 521, "A full immersion into Japan's most iconic accommodation. Sauna, manga lounge, and sleeping in a pod 2 meters long."),
];

/* ------------------------------------------------------------------
   Ryan Trahan — The Penny Series
   Season 1: "Penny to Fortune"
   ------------------------------------------------------------------ */
const rPen_S1 = season(IDS.show_ryan_penny, 1, "Penny to Fortune");
const rPen_Eps: Episode[] = [
  ep(rPen_S1.id, YT.RYAN_01, "Trading a Penny for a Car", 1, 891, "The viral challenge begins. Ryan hits the streets with one cent and a dream — by sunset, he's driving away in a used sedan."),
  ep(rPen_S1.id, YT.RYAN_02, "From a Car to a Tiny House", 2, 954, "The stakes skyrocket. After a series of improbable trades, Ryan is standing in front of a house he just acquired. But can he keep it?"),
  ep(rPen_S1.id, YT.RYAN_03, "The Final Trade: Giving It All Away", 3, 1123, "The emotional finale. After crossing America on a penny, Ryan does the unthinkable — he gives everything away to a family who needs it more."),
  ep(rPen_S1.id, YT.RYAN_04, "Trading a Paperclip for a Laptop", 4, 823, "The original experiment. Before the penny, there was a paperclip. Ryan proves that any starting point, no matter how small, can become something big."),
  ep(rPen_S1.id, YT.RYAN_05, "Building a Business with $1", 5, 967, "Ryan launches a lemonade stand with a single dollar bill. 48 hours later, he's running a pop-up brand with a line around the block."),
];

/* ------------------------------------------------------------------
   Ryan Trahan — 50 Hours
   Season 1: "Extremes"
   ------------------------------------------------------------------ */
const rSurv_S1 = season(IDS.show_ryan_survive, 1, "Extremes");
const rSurv_Eps: Episode[] = [
  ep(rSurv_S1.id, YT.RYAN_06, "I Survived 50 Hours in the Desert", 1, 1043, "110°F heat, no food, 2 liters of water. Ryan is dropped in the middle of the Sonoran Desert with nothing but a camera. "),
  ep(rSurv_S1.id, YT.RYAN_07, "I Survived 50 Hours in a Cave", 2, 985, "Complete darkness, disorienting silence, and temperatures dropping below freezing. Ryan descends into America's deepest cave system."),
  ep(rSurv_S1.id, YT.RYAN_08, "I Survived 50 Hours in Alaska", 3, 1102, "Sub-zero temperatures, grizzly bear territory, and 20 hours of darkness a day. Ryan's most dangerous 50 Hours yet."),
  ep(rSurv_S1.id, YT.RYAN_09, "I Survived 50 Hours Buried Alive", 4, 946, "6 feet underground in a custom-built coffin. No light, limited air, and complete sensory deprivation. The psychological breaking point."),
  ep(rSurv_S1.id, YT.RYAN_10, "I Survived the World's Most Remote Island", 5, 1156, "Dropped alone on an uninhabited island in the Pacific. Ryan has 50 hours to signal for rescue — or figure out how to survive indefinitely."),
];

/* ------------------------------------------------------------------
   Yes Theory — Seeking Discomfort
   Season 1: "Foundations"
   ------------------------------------------------------------------ */
const ySeek_S1 = season(IDS.show_yes_discomfort, 1, "Foundations");
const ySeek_S1_Eps: Episode[] = [
  ep(ySeek_S1.id, YT.YES_01, "Saying Yes to a Stranger for 24 Hours", 1, 723, "The video that started it all. Thomas hands control of his life to a complete stranger. Every request must be answered with 'yes.'"),
  ep(ySeek_S1.id, YT.YES_02, "I Flew to a Random Country with No Plan", 2, 876, "Blindfolded at the airport, Thomas and the team spin a globe and buy a ticket to wherever their finger lands."),
  ep(ySeek_S1.id, YT.YES_03, "Climbing the Tallest Building in Asia", 3, 654, "No permits, no safety nets. The team attempts to reach the top of Shanghai Tower — one of the world's tallest skyscrapers — through sheer determination."),
];

/* Season 2: "Going Deeper" */
const ySeek_S2 = season(IDS.show_yes_discomfort, 2, "Going Deeper");
const ySeek_S2_Eps: Episode[] = [
  ep(ySeek_S2.id, YT.YES_04, "The Most Dangerous Hike in the World", 1, 998, "Mount Huashan's infamous plank walk — a wooden path bolted to a sheer cliff face with a 2,000-meter drop. The team faces their deepest fear."),
  ep(ySeek_S2.id, YT.YES_05, "I Spent 7 Days Alone in the Wilderness", 2, 1203, "No phone, no camera crew, no human contact. Thomas confronts isolation in the Canadian Rockies and discovers what matters most."),
  ep(ySeek_S2.id, YT.YES_06, "Finding Myself at the Edge of the Earth", 3, 876, "The Season 2 finale. A solo journey to Patagonia becomes a meditation on fear, purpose, and the Yes Theory philosophy."),
];

/* ------------------------------------------------------------------
   Yes Theory — Project Yes
   Season 1: "Strangers United"
   ------------------------------------------------------------------ */
const yProj_S1 = season(IDS.show_yes_project, 1, "Strangers United");
const yProj_Eps: Episode[] = [
  ep(yProj_S1.id, YT.YES_07, "1000 Strangers, 1 Massive Surprise", 1, 1345, "The team invites 1000 strangers to a warehouse with a single promise: 'Be ready to say yes.' What happens next defies all expectations."),
  ep(yProj_S1.id, YT.YES_08, "We Built a School in 7 Days", 2, 1423, "Arriving in a remote village with nothing but a plan, the team leads 200 volunteers to construct a fully functional school in one week."),
  ep(yProj_S1.id, YT.YES_09, "The Greatest Gift We've Ever Given", 3, 1178, "The team identifies someone who has dedicated their life to helping others — and gives them the surprise of a lifetime."),
  ep(yProj_S1.id, YT.YES_10, "We Surprised 10000 People at Once", 4, 1567, "The largest project in Yes Theory history. A public square, a countdown, and ten thousand people who had no idea they were part of something."),
];

/* ------------------------------------------------------------------
   MrBeast — Beast Originals
   Season 1: "$1 vs $1,000,000"
   ------------------------------------------------------------------ */
const bEpic_S1 = season(IDS.show_beast_epic, 1, "$1 vs $1,000,000");
const bEpic_S1_Eps: Episode[] = [
  ep(bEpic_S1.id, YT.BEAST_01, "$1 vs $1,000,000 Hotel Room", 1, 987, "Jimmy books the cheapest hotel room on Earth and the most expensive penthouse in Dubai. The differences will break your brain."),
  ep(bEpic_S1.id, YT.BEAST_02, "$1 vs $100,000,000 House", 2, 1210, "From a shack in rural India to a Beverly Hills mega-mansion. Jimmy explores how the other half lives — at every price point in between."),
  ep(bEpic_S1.id, YT.BEAST_03, "$1 vs $500,000 Plane Ticket", 3, 934, "Economy basic vs a private Gulfstream. Jimmy documents what happens when you spend 500,000 times more on the exact same journey."),
  ep(bEpic_S1.id, YT.BEAST_04, "$1 vs $1,000,000 Car", 4, 1067, "A rusted bicycle vs a Bugatti Chiron. The most extreme vehicle comparison on YouTube — tested on the same track, same day."),
];

/* Season 2: "Giving Back" */
const bEpic_S2 = season(IDS.show_beast_epic, 2, "Giving Back");
const bEpic_S2_Eps: Episode[] = [
  ep(bEpic_S2.id, YT.BEAST_05, "I Built 100 Wells in Africa", 1, 1134, "Jimmy travels to communities without clean water and builds 100 wells. Over 500,000 people gain access to drinking water for the first time."),
  ep(bEpic_S2.id, YT.BEAST_06, "Paying Off 1000 People's Medical Debt", 2, 1345, "Jimmy purchases millions in medical debt and forgives it all — then surprises the patients in person with the news that their bills are gone."),
  ep(bEpic_S2.id, YT.BEAST_07, "Buying Everything in a Store for Charity", 3, 1023, "Jimmy walks into a massive store and buys every single item. All of it — food, clothing, electronics — goes directly to families in need."),
];

/* ------------------------------------------------------------------
   MrBeast — Last to Leave
   Season 1
   ------------------------------------------------------------------ */
const bContest_S1 = season(IDS.show_beast_contest, 1, "Season 1");
const bContest_Eps: Episode[] = [
  ep(bContest_S1.id, YT.BEAST_08, "Last to Leave the Circle Wins $500,000", 1, 1678, "100 contestants enter a circle painted on the ground. The rules are simple: step out, and you're eliminated. The last person inside wins half a million dollars."),
  ep(bContest_S1.id, YT.BEAST_09, "Last to Leave the Pool Wins $100,000", 2, 1432, "A massive pool, dozens of contestants, and one rule: you cannot leave the water. Days pass. People break. Only one walks away with $100,000."),
  ep(bContest_S1.id, YT.BEAST_10, "Last to Take Hand Off Lamborghini Keeps It", 3, 1534, "10 people place their hand on a Lamborghini. The last one still touching it drives it home. Physical and psychological warfare ensue."),
  ep(bContest_S1.id, YT.BEAST_11, "Last to Leave the Island Wins $1,000,000", 4, 1876, "$1,000,000 prize. A remote tropical island. 100 contestants. No food drops. No outside contact. A seven-day test of human endurance."),
];

/* ==================================================================
   AGGREGATED EXPORTS
   ================================================================== */
export const SEED_SEASONS: Season[] = [
  kExp_S1, kJpn_S1,
  rPen_S1, rSurv_S1,
  ySeek_S1, ySeek_S2, yProj_S1,
  bEpic_S1, bEpic_S2, bContest_S1,
];

export const SEED_EPISODES: Episode[] = [
  ...kExp_Eps, ...kJpn_Eps,
  ...rPen_Eps, ...rSurv_Eps,
  ...ySeek_S1_Eps, ...ySeek_S2_Eps, ...yProj_Eps,
  ...bEpic_S1_Eps, ...bEpic_S2_Eps, ...bContest_Eps,
];

/* ==================================================================
   AI ABSTRACTION LAYER
   The SeedVendor interface lets you swap the static seed data with
   real Supabase queries or an AI-powered curation engine.
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

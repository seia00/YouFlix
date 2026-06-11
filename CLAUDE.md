# Youflix — Project Context for Claude Code

## VISION
Youflix transforms YouTube creators into Netflix-style television shows. Users should feel like they are using Netflix for YouTube creators. The experience prioritizes: discovery, binge-watching, immersion, storytelling, and creator journeys. If Netflix, Apple TV, and YouTube had a child, it would look like Youflix.

**Core principle: Do not think of videos. Think of shows. Videos are merely episodes inside shows.**

## TECH STACK
- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-based config via `@theme` blocks — no `tailwind.config.ts`)
- **Animations**: Framer Motion (layout animations, shared element transitions)
- **Icons**: Lucide React
- **State**: Zustand (modular slices for Player State, UI State)
- **Database & Auth**: Supabase (native client, Row Level Security enabled)
- **Data Fetching**: Server Components use async functions; `lib/data.ts` auto-detects Supabase availability and falls back to static seed data
- **Video Playback**: YouTube IFrame Player API (wrapped in React components, synced to Zustand)

## PROJECT STRUCTURE
```
src/
  app/
    globals.css              # Tailwind v4 theme tokens, cinematic base styles
    layout.tsx               # Root layout — Navbar + SearchModal
    page.tsx                 # Homepage — HeroCarousel + HorizontalRows
    proxy.ts                 # Next.js 16 proxy (middleware) for Supabase auth
    show/[id]/
      page.tsx               # Show detail — banner + season selector + episode grid
      ShowDetailClient.tsx   # Client wrapper for season state
      loading.tsx            # Skeleton
      not-found.tsx          # 404
    watch/[episode_id]/
      page.tsx               # Watch page — fetches episode + builds play queue
      WatchPageClient.tsx    # Client — YouTube player + overlay + UpNext sidebar
      loading.tsx            # Loading spinner
      not-found.tsx          # 404
    search/
      page.tsx               # Standalone search fallback

  components/
    HeroCarousel.tsx         # Netflix-style rotating hero — 8 shows, 8s auto-rotate, dots, arrows
    HeroBannerClient.tsx     # YouTube IFrame backdrop — muted, non-interactive, auto-loop
    HeroCTAButtons.tsx       # "Play S1:E1" + "More Info" buttons
    HeroSection.tsx          # Server component that fetches all slides
    HorizontalRow.tsx        # Horizontal scroll row with Framer Motion arrow fade-in
    ThumbnailCard.tsx        # Show card with hover-scale, shimmer placeholder
    Navbar.tsx               # Sticky glassmorphism nav with Cmd+K search trigger
    SearchModal.tsx          # Command-K global search modal
    SeasonSelector.tsx       # Animated dropdown season picker
    EpisodeGrid.tsx          # 2-column grid of episode cards
    EpisodeCard.tsx          # Episode thumbnail + title + progress bar
    YouTubePlayer.tsx        # YouTube IFrame API wrapper (watch page)
    PlayerOverlay.tsx        # Custom Netflix-style controls overlay (auto-hide)
    UpNext.tsx               # Sidebar with upcoming queue
    Skeleton.tsx             # Loading skeletons for hero, rows, cards, homepage

  store/
    usePlayerStore.ts        # Zustand — play/pause/seek/queue/mute/progress sync
    useUIStore.ts            # Zustand — search modal, mobile nav, route loading

  lib/
    data.ts                  # Server data layer — auto-detects Supabase vs seed data
    seed-data.ts             # Curated creators, shows, seasons, episodes with YouTube IDs
    types.ts                 # TypeScript interfaces mirroring Supabase schema
    player-sync.ts           # Debounced Supabase progress sync (every 10s)
    supabase/
      client.ts              # Browser Supabase client
      server.ts              # Server Supabase client
      middleware.ts           # Auth session refresh utility

lib/
  supabase/
    schema.sql               # Full PostgreSQL schema with RLS policies

scripts/
  seed-db.ts                 # Populates Supabase from seed data
  fetch-channel.ts           # Fetches real YouTube videos from any channel RSS feed
```

## DESIGN SYSTEM (configured in globals.css)
- **Background**: #090909
- **Surface**: #111111
- **Surface Alt**: #1A1A1A
- **Text**: #FFFFFF
- **Text Muted**: #B3B3B3
- **Accent**: #8B5CF6 (purple)
- **Accent Hover**: #A78BFA
- **Border**: rgba(255,255,255,0.08)
- **Border Hover**: rgba(255,255,255,0.16)
- **Glass**: rgba(17,17,17,0.65) with backdrop-blur

**Custom animations in Tailwind**: shimmer, fade-up, fade-in, scale-up

**Utility classes available**: `.glass`, `.gradient-bottom`, `.gradient-top`, `.gradient-hero`, `.shimmer`, `.snap-row`, `.hide-scrollbar`

## DATABASE SCHEMA (Supabase)
- `creators` — YouTube channels as "production studios"
- `shows` — Content series grouped by creator
- `seasons` — Thematic collections inside a show
- `episodes` — Individual YouTube videos
- `profiles` — User profiles linked to Supabase Auth
- `watch_history` — Per-user watch progress tracking

## CURRENT STATE
### What works
- Hero carousel with 8 rotating shows (8s auto-rotate, arrows, dots, keyboard nav)
- 5 horizontal content rows (Trending + one per creator)
- Show detail pages with season selector + episode grid
- Watch page with YouTube player, custom overlay controls, Up Next sidebar
- Command-K global search modal
- Proxy for Supabase auth (graceful degradation when env vars missing)
- All pages have loading skeletons and 404 states
- Build and lint pass with zero errors

### What needs enhancement
1. **Visual polish**: The UI is functional but feels flat — needs more cinematic motion, better transitions between pages, smoother hover effects
2. **Show thumbnails**: Kelly Wakasa + MrBeast shows have real YouTube thumbnails; Ryan Trahan + Yes Theory shows have gradient fallbacks because YouTube IDs are still placeholders (`REPLACE_ME_*`)
3. **Hero carousel transitions**: Currently fades — could be more dramatic (zoom, parallax, etc.)
4. **Mobile responsiveness**: Bottom nav is placeholder, rows need touch optimization
5. **Continue Watching row**: Exists in data layer but not rendered on homepage
6. **Auth UI**: No login/signup flow yet
7. **Page transitions**: No shared element transitions between routes
8. **Micro-interactions**: Buttons, cards, and interactive elements need more refined hover/active states

## YOUR TASK
Enhance the UI design and aesthetics to an industry-leading degree. Focus on:

1. **Cinematic page transitions** between routes using Framer Motion (fade + slide, shared layout animations)
2. **Refined card hover states** — Netflix-style expanding cards with video previews or richer info on hover
3. **Hero carousel upgrade** — smoother transitions between slides, parallax effects on the text/content layer, a subtle zoom on the background video during transitions
4. **Typography & spacing** — more dramatic type scale for titles, better vertical rhythm, cinematic letter-spacing
5. **Glassmorphism depth** — more refined use of backdrop-blur on nav, overlays, and modals
6. **Micro-interactions** — button press animations, scroll-triggered reveals, loading transitions that feel intentional
7. **Color grading** — subtle color overlays that shift per-creator or per-genre to give each section its own emotional tone
8. **Mobile-first polish** — touch-friendly row scrolling, bottom navigation bar, responsive type scale
9. **"Continue Watching" row** — render it on homepage using the `getContinueWatching()` data function

## RULES
- Do NOT change the tech stack or add new dependencies without asking
- Follow existing code conventions (file structure, naming, patterns)
- All new components must have loading and error states
- Test with `npm run build` after each change
- Keep the dark-only cinematic aesthetic — no light mode
- Every animation must serve the storytelling, not distract from it

# Youflix — Design Reinvention Brief

## WHAT
Youflix is a Netflix-style frontend for YouTube creators. Every creator gets their own "show," every video is an "episode." The app works — the data flows, the players play, the carousel rotates. But the design is boilerplate. It looks like a tutorial project. Fix that.

## DO NOT GIVE ME SAFE. GIVE ME EXCEPTIONAL.
This is not a client project where you play it safe to avoid a bad review. This is a portfolio piece. Make choices that would make a Netflix designer jealous. If your instinct is to add padding — ask if it needs to be closer. If your instinct is a fade — try a mask reveal. Defaults are the enemy. Every pixel should feel intentional.

## CONSTRAINTS (work within these, but push every boundary)
- Next.js 16 App Router, TypeScript strict, Tailwind CSS v4 (no tailwind.config.ts — use `@theme` in `src/app/globals.css`)
- Framer Motion for anything that moves. Lucide for icons. Zustand for state.
- Zero new npm dependencies.
- Dark mode only. Background is #090909. Accent is #8B5CF6 (purple).
- Do not touch `src/lib/data.ts` or `src/lib/seed-data.ts`. Everything else is yours.
- `npm run build` must pass. No type errors. No lint errors.
- Mobile-first. 375px viewports must feel native.

## THE PROBLEMS (what to attack)

**The hero carousel is timid.** Eight shows rotate on a timer with a basic fade. The background video plays but feels disconnected from the content. There's no momentum, no drama, no reason to stop scrolling and watch.

**Cards are rectangles with text.** They scale to 1.08x on hover. That's it. No preview, no personality, no moment of discovery. A Netflix card earns its hover — information unfolds, a trailer teases, your thumb moves toward it. These cards just... get bigger.

**Rows are functional. Netflix rows are addictive.** The arrows appear on hover. The scroll snaps. But there's no delight in the scroll — no rubber banding, no edge glow, no visual reward for reaching the end. The row label sits there like a `<h2>`. Give it presence.

**The navbar is invisible.** Glassmorphism on scroll is table stakes. Make the logo burn into your retina. Make the search button pulse like it wants to be pressed. The Cmd+K modal opens — does it feel like stepping into a different space, or just another div?

**Everything loads. Nothing arrives.** Skeletons exist. But content doesn't arrive — it replaces. Where's the staggered reveal? Where's the moment a thumbnail resolves from blur to sharp? Where's the satisfaction of watching a grid populate?

**Pages change. Nothing transitions.** Click a show, the URL changes, the page renders. What if the thumbnail you clicked expanded into the banner? What if the route change felt like turning a page rather than loading a URL?

## WHAT TO BUILD

### A cinematic hero that commands attention
Make the hero feel like a teaser trailer, not a banner. The video, the title, the metadata — they should compose into a single dramatic moment. Think about timing. Think about scale. Think about what happens when a user just watches the carousel for 30 seconds without interacting.

### Cards that reward curiosity
A card hover should feel like peeking behind a curtain. Tease the content. Show a glimpse. Make me want to click. Every card in the trending row should feel like a recommendation from someone who knows me.

### Rows that pull you sideways
Horizontal scrolling should have physics. Scroll momentum, edge friction, a satisfying stop. The visual language should tell you "there's more this way" without needing arrows. The arrows should feel like an assist, not a requirement.

### Navigation that disappears until you need it
The navbar is chrome. Chrome should vanish when you're immersed and reappear exactly when you reach for it. The search modal should feel like stepping into a focused workspace, not opening a popup.

### Transitions that tell a story
Moving between pages should feel continuous. The homepage thumbnail and the show detail banner should feel like the same object in different states. The watch page should feel like the lights going down in a theater.

### Typography as architecture
Type size alone doesn't create hierarchy. Weight, spacing, and proportion do. The hero title should feel monumental. Row labels should feel definitive. Body text should feel effortless. The type scale should feel composed, not generated.

### Micro-moments that feel inevitable
A button press that feels like pressing a physical thing. A scroll that feels like it has mass. A hover that feels like discovery. These aren't "nice to have" — they're the difference between a website and a product.

## WHAT NOT TO DO
- No gradient borders for the sake of gradients
- No overuse of blur (one glass surface per viewport is enough)
- No hover effects that trigger on touch devices
- No animations over 400ms unless they're the main event
- No emojis
- No "gamer aesthetic" (neon glow, particle effects, cyberpunk)

## REFERENCE POINTS (mood, not copy)
The weight of Apple TV's hero cards. The precision of Linear's interactions. The density of Netflix's browse grid. The drama of HBO Max's show pages. The confidence of Stripe's typography. The materiality of Raycast's command palette.

## START HERE
Look at the current homepage. Find the thing that bothers you most. Fix it first. Then find the next. Work outward from the most-visited surface. The hero carousel and the first two rows are seen by every single user — make them undeniable. Everything else can follow.

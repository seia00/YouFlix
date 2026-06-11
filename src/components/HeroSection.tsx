/* ==========================================================================
   HeroSection — Server Component
   Fetches all shows for the hero carousel, handles the Supabase/seed
   dual path, and renders the HeroCarousel.
   ========================================================================== */

import { getAllHeroSlides, getHeroContent } from "@/lib/data";
import HeroCarousel from "./HeroCarousel";

export default async function HeroSection() {
  // Try carousel first — if no data, fall back to single hero
  const slides = await getAllHeroSlides();

  if (slides.length === 0) {
    const hero = await getHeroContent();
    return null; // fallback handled by HeroBanner
  }

  return <HeroCarousel slides={slides} />;
}

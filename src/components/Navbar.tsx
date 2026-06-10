/* ==========================================================================
   Navbar — Client Component
   Sticky top navigation bar with logo, nav links, and search trigger.
   Renders glassmorphism background on scroll.
   ========================================================================== */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const openSearch = useUIStore((s) => s.openSearch);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter text-accent hover:text-accent-hover transition-colors"
        >
          YOUFLIX
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Shows
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Creators
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Search trigger */}
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-text-muted transition-all duration-300 hover:border-border-hover hover:text-text"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="ml-1 hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Mobile menu trigger (placeholder) */}
          <button
            type="button"
            className="flex items-center md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-text" />
          </button>
        </div>
      </nav>
    </header>
  );
}

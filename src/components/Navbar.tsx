/* ==========================================================================
   Navbar — Client Component
   Chrome that disappears when you're immersed: hides on scroll-down past
   the hero, returns the instant you scroll up. Play-badge wordmark,
   active-route indicator, pulsing Cmd+K trigger, and a full-screen
   mobile menu.
   ========================================================================== */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Browse" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastY = useRef(0);
  const openSearch = useUIStore((s) => s.openSearch);
  const isSearchOpen = useUIStore((s) => s.isSearchOpen);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      const delta = y - lastY.current;
      if (y > 160 && delta > 6) setIsHidden(true);
      else if (delta < -6 || y < 160) setIsHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Never hide chrome while a surface that needs it is open */
  const hidden = isHidden && !isMenuOpen && !isSearchOpen;

  /* The theater gets no chrome — the player overlay owns navigation there */
  if (pathname?.startsWith("/watch")) return null;

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.55, 0, 0.1, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        isScrolled && !isMenuOpen ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 sm:px-10 lg:px-14">
        {/* Logo — play badge + wordmark */}
        <Link href="/" className="group flex items-center gap-2" aria-label="Youflix home">
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-accent transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </span>
          <span className="text-[17px] font-extrabold tracking-[-0.04em] text-text">
            YOUFLIX
          </span>
        </Link>

        {/* Desktop nav links with active indicator */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-text" : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="animate-glow-pulse flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-sm text-text-muted transition-colors duration-300 hover:border-border-hover hover:text-text"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="ml-1 hidden rounded border border-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-text-dim sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((o) => !o)}
            className="flex items-center md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-text" />
            ) : (
              <Menu className="h-6 w-6 text-text" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu — full-bleed sheet, monumental links */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass fixed inset-x-0 top-full h-[calc(100svh-100%)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pt-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 text-3xl font-extrabold tracking-[-0.03em] ${
                      pathname === link.href ? "text-text" : "text-text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.17, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  setIsMenuOpen(false);
                  openSearch();
                }}
                className="flex items-center gap-3 py-3 text-3xl font-extrabold tracking-[-0.03em] text-text-muted"
              >
                Search
                <Search className="h-6 w-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

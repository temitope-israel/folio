// src/components/layout/Navbar.tsx
// ============================================================
// NAVBAR COMPONENT
// ============================================================
// Fixed navigation bar at the top of the page.
// Features:
//   - Logo (initials + name)
//   - Navigation links (desktop only)
//   - Pulsing availability badge
//   - Resume download button
//   - Scroll-aware: background blurs when user scrolls down
// ============================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
// Download → icon for the resume button
// Circle   → icon for the availability badge dot

import { navLinks, personalInfo } from "@/data";
// navLinks → the array of { label, href } navigation items
// personalInfo → for name, availability status, resumeUrl

export default function Navbar() {
  // --------------------------------------------------------
  // Scroll detection
  // --------------------------------------------------------
  const [scrolled, setScrolled] = useState(false);
  // scrolled: false → user is at the top (transparent navbar)
  // scrolled: true  → user has scrolled down (blurred navbar)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // window.scrollY → how many pixels the page has scrolled vertically.
      // If scrollY > 50px → user has scrolled past the top → set scrolled=true.
      // If scrollY ≤ 50px → user is near the top → set scrolled=false.
      // This runs on EVERY scroll event — it's a simple boolean toggle,
      // so the performance cost is negligible.
    };

    window.addEventListener("scroll", handleScroll);
    // Listen for scroll events on the entire window.

    handleScroll();
    // Call immediately on mount to set the correct initial state.
    // If the user refreshes mid-page, scrollY > 0 already — we need
    // to set scrolled=true immediately, not wait for their next scroll.

    return () => window.removeEventListener("scroll", handleScroll);
    // Cleanup — remove listener when Navbar unmounts.
  }, []);

  // --------------------------------------------------------
  // Mobile menu state
  // --------------------------------------------------------
  //const [menuOpen, setMenuOpen] = useState(false);
  // We'll build the mobile menu toggle on Day 25 (responsiveness).
  // For now we track the state — the toggle logic comes later.

  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------
  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-base/80 backdrop-blur-md border-b border-bg-border"
          : "bg-transparent border-b border-transparent"
        /*
          When scrolled is true:
            bg-bg-base/80   → background-color with 80% opacity.
                              The /80 is Tailwind v4's opacity modifier.
                              bg-bg-base/80 = background: rgba(10, 14, 20, 0.8)
                              The page content shows through at 20% transparency.
            backdrop-blur-md → backdrop-filter: blur(12px).
                              Blurs whatever is BEHIND the navbar (the page content).
                              Creates the frosted glass effect.
                              Only works when the element has some transparency —
                              that's why we use /80 opacity, not full opacity.
            border-b         → border-bottom-width: 1px
            border-bg-border → border-bottom-color: #1F2733

          When scrolled is false (at top):
            bg-transparent       → fully transparent — page shows through
            border-b             → still has a bottom border slot
            border-transparent   → but the border is invisible
                                   (same thickness, zero color — no layout jump)
        */
      }`}
      initial={{ y: -100, opacity: 0 }}
      // Start 100px above viewport and invisible
      animate={{ y: 0, opacity: 1 }}
      // Slide down to correct position and fade in
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      // Starts 100ms after mount — gives the preloader time to clear.
      // In the final app, the Navbar is inside the main content (not preloader),
      // so this delay creates a nice staggered entry after the preloader exits.
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/*
            flex              → row layout
            items-center      → vertically center all nav children
            justify-between   → push logo to left, links+button to right
            h-16              → height: 64px on mobile
            md:h-20           → height: 80px on desktop (md = 768px+)
          */}

          {/* ----------------------------------------
              LOGO
          ---------------------------------------- */}
          <motion.a
            href="#"
            // Clicking the logo scrolls to the top of the page (#)
            className="flex items-center gap-3 group"
            /*
              group → Tailwind's group modifier.
                      When applied to a parent, you can style children
                      based on the parent's hover state using group-hover:
                      Example: className="group-hover:text-brand"
                      We'll use this on the logo text below.
            */
            whileHover={{ scale: 1.02 }}
            // On hover: scale up 2% — very subtle, just enough feedback.
            whileTap={{ scale: 0.98 }}
            // On click: scale down 2% — tactile "press" feel.
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            // Spring transition for the scale — feels physical and bouncy.
          >
            {/* Initials badge */}
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
              {/*
                w-9 h-9      → 36×36px square
                rounded-lg   → 12px border radius
                bg-brand     → deep blue background
                flex items-center justify-center → center the text inside
                flex-shrink-0 → prevent the badge from shrinking in flex layouts.
                               Without this, if space is tight, flex might compress it.
              */}
              <span className="text-white font-bold text-sm font-display">
                {personalInfo.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
                {/*
                  Same initials logic as Preloader:
                  "Temitope Israel Omoniyi"
                  → split: ["Temitope", "Israel", "Omoniyi"]
                  → slice(0,2): ["Temitope", "Israel"]
                  → map first chars: ["T", "I"]
                  → join: "TI"
                */}
              </span>
            </div>

            {/* Name text */}
            <div className="hidden sm:block">
              {/*
                hidden    → display: none (hidden on mobile by default)
                sm:block  → display: block on sm (640px+) and wider.
                            On very small screens, only the badge shows.
              */}
              <p className="text-text-primary font-semibold text-sm leading-tight group-hover:text-brand transition-colors duration-200">
                {/*
                  group-hover:text-brand → when the parent (.group) is hovered,
                  this text changes to brand blue.
                  transition-colors      → animate the color change
                  duration-200           → over 200ms
                */}
                {personalInfo.shortName}
              </p>
              <p className="text-text-muted text-xs leading-tight">
                {personalInfo.title}
              </p>
            </div>
          </motion.a>

          {/* ----------------------------------------
              DESKTOP NAV LINKS
          ---------------------------------------- */}
          <ul className="hidden md:flex items-center gap-1">
            {/*
              hidden    → hidden on mobile
              md:flex   → flex row on desktop (768px+)
              gap-1     → 4px between nav items
            */}
            {navLinks.map((link, index) => (
              <motion.li
                key={link.href}
                // key={link.href} → each link has a unique href — better than index
                // because if links reorder, React correctly tracks each element.

                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + index * 0.05,
                  // Stagger each link's entry by 50ms.
                  // Link 0: delay 0.1s
                  // Link 1: delay 0.15s
                  // Link 2: delay 0.2s
                  // ... and so on
                  // index * 0.05 → multiply index by 50ms
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <a
                  href={link.href}
                  className="relative px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 group/link"
                  /*
                    relative     → needed for the underline pseudo-element (::after)
                    px-3         → 12px horizontal padding (clickable area)
                    py-2         → 8px vertical padding
                    text-sm      → 14px font size
                    text-text-secondary → default grey color
                    hover:text-text-primary → turns near-white on hover
                    transition-colors → animates the color change
                    group/link   → named group modifier. The /link suffix lets us
                                   have multiple nested groups without conflict.
                                   Tailwind v4 supports named groups: group/{name}
                  */
                >
                  {link.label}

                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-brand scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 origin-left" />
                  {/*
                    absolute          → positioned relative to the <a> tag
                    bottom-0          → sits at the bottom of the link
                    left-3 right-3    → matches the px-3 padding (12px each side)
                    h-px              → height: 1px — thin underline
                    bg-brand          → brand blue color
                    scale-x-0         → starts at 0 width (invisible)
                    group-hover/link:scale-x-100 → when the named group (link) is
                                        hovered, scale to full width
                    transition-transform → animate the scale change
                    duration-200      → 200ms
                    origin-left       → grow from left to right
                  */}
                </a>
              </motion.li>
            ))}
          </ul>

          {/* ----------------------------------------
              RIGHT SIDE — Badge + Button
          ---------------------------------------- */}
          <div className="flex items-center gap-3">
            {/* Availability badge — desktop only */}
            {personalInfo.available && (
              // Only render if available is true in personalInfo
              <motion.div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-bg-border bg-bg-surface"
                /*
                  hidden md:flex  → hidden on mobile, flex row on desktop
                  gap-2           → 8px between dot and text
                  px-3            → 12px horizontal padding
                  py-1.5          → 6px vertical padding
                  rounded-full    → pill shape
                  border border-bg-border → subtle border
                  bg-bg-surface   → slightly lighter card background
                */
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
              >
                {/* Pulsing green dot */}
                <div className="relative w-2 h-2">
                  {/*
                    relative → needed for the absolute ping ring inside
                    w-2 h-2  → 8×8px container
                  */}
                  <div className="w-2 h-2 rounded-full bg-success" />
                  {/*
                    The solid green dot — always visible.
                    bg-success → #22C55E (green — availability means "go")
                    We keep this green (not brand blue) because green = available.
                    Blue is our brand, green is the universal "active/online" signal.
                  */}
                  <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
                  {/*
                    absolute inset-0 → overlays exactly on the solid dot
                    rounded-full     → circle
                    bg-success       → same green
                    animate-ping     → Tailwind's built-in ping animation.
                                       Scales up from 100% to ~200% while fading out.
                                       Creates the "ripple" effect around the dot.
                    opacity-75       → slightly transparent so the ping is subtle
                  */}
                </div>

                <span className="text-xs text-text-secondary font-medium">
                  Available for work
                </span>
              </motion.div>
            )}

            {/* Resume download button */}
            <motion.a
              href={personalInfo.resumeUrl}
              download
              // download attribute → tells the browser to download the file
              // instead of navigating to it. Works with PDFs in the public/ folder.
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-semibold transition-colors duration-200"
              /*
                px-4 py-2         → 16px horizontal, 8px vertical padding
                rounded-lg        → 12px border radius
                bg-brand          → deep blue background
                hover:bg-brand-dark → darker blue on hover
                text-white        → white text
                text-sm           → 14px
                font-semibold     → weight 600
                transition-colors → animate color change
              */
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={14} strokeWidth={2.5} />
              {/*
                size={14}        → icon is 14×14px
                strokeWidth={2.5} → slightly thicker stroke — more visible at small size
              */}
              <span className="hidden sm:inline">Resume</span>
              {/*
                hidden sm:inline → text hidden on very small screens,
                                   shows on sm (640px+).
                                   On tiny screens, only the Download icon shows.
              */}
            </motion.a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}

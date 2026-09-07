import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(motion.header, { className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
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
        }`, initial: { y: -100, opacity: 0 }, 
        // Start 100px above viewport and invisible
        animate: { y: 0, opacity: 1 }, 
        // Slide down to correct position and fade in
        transition: { duration: 0.6, ease: "easeOut", delay: 0.1 }, children: _jsx("div", { className: "container-custom", children: _jsxs("nav", { className: "flex items-center justify-between h-16 md:h-20", children: [_jsxs(motion.a, { href: "#", 
                        // Clicking the logo scrolls to the top of the page (#)
                        className: "flex items-center gap-3 group", 
                        /*
                          group → Tailwind's group modifier.
                                  When applied to a parent, you can style children
                                  based on the parent's hover state using group-hover:
                                  Example: className="group-hover:text-brand"
                                  We'll use this on the logo text below.
                        */
                        whileHover: { scale: 1.02 }, 
                        // On hover: scale up 2% — very subtle, just enough feedback.
                        whileTap: { scale: 0.98 }, 
                        // On click: scale down 2% — tactile "press" feel.
                        transition: { type: "spring", stiffness: 400, damping: 25 }, children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-brand flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-white font-bold text-sm font-display", children: personalInfo.name
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((w) => w[0])
                                        .join("") }) }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("p", { className: "text-text-primary font-semibold text-sm leading-tight group-hover:text-brand transition-colors duration-200", children: personalInfo.shortName }), _jsx("p", { className: "text-text-muted text-xs leading-tight", children: personalInfo.title })] })] }), _jsx("ul", { className: "hidden md:flex items-center gap-1", children: navLinks.map((link, index) => (_jsx(motion.li, { 
                            // key={link.href} → each link has a unique href — better than index
                            // because if links reorder, React correctly tracks each element.
                            initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: {
                                delay: 0.1 + index * 0.05,
                                // Stagger each link's entry by 50ms.
                                // Link 0: delay 0.1s
                                // Link 1: delay 0.15s
                                // Link 2: delay 0.2s
                                // ... and so on
                                // index * 0.05 → multiply index by 50ms
                                duration: 0.4,
                                ease: "easeOut",
                            }, children: _jsxs("a", { href: link.href, className: "relative px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 group/link", children: [link.label, _jsx("span", { className: "absolute bottom-0 left-3 right-3 h-px bg-brand scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 origin-left" })] }) }, link.href))) }), _jsxs("div", { className: "flex items-center gap-3", children: [personalInfo.available && (_jsxs(motion.div, { className: "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-bg-border bg-bg-surface", 
                                /*
                                  hidden md:flex  → hidden on mobile, flex row on desktop
                                  gap-2           → 8px between dot and text
                                  px-3            → 12px horizontal padding
                                  py-1.5          → 6px vertical padding
                                  rounded-full    → pill shape
                                  border border-bg-border → subtle border
                                  bg-bg-surface   → slightly lighter card background
                                */
                                initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.5, duration: 0.4, ease: "easeOut" }, children: [_jsxs("div", { className: "relative w-2 h-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-success" }), _jsx("div", { className: "absolute inset-0 rounded-full bg-success animate-ping opacity-75" })] }), _jsx("span", { className: "text-xs text-text-secondary font-medium", children: "Available for work" })] })), _jsxs(motion.a, { href: personalInfo.resumeUrl, download: true, 
                                // download attribute → tells the browser to download the file
                                // instead of navigating to it. Works with PDFs in the public/ folder.
                                className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-semibold transition-colors duration-200", 
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
                                initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.6, duration: 0.4, ease: "easeOut" }, whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, children: [_jsx(Download, { size: 14, strokeWidth: 2.5 }), _jsx("span", { className: "hidden sm:inline", children: "Resume" })] })] })] }) }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/sections/Hero.tsx
// ============================================================
// HERO SECTION — PART 1
// ============================================================
// The first thing visitors see. Contains:
//   - Left column: headline, sub-headline, CTA buttons, stats
//   - Right column: visual card with floating elements
//   - Decorative background elements (absolute positioned)
//
// Part 2 (Day 9) will add: text scramble effect on the headline,
// useScroll + useTransform for parallax on the visual column.
// ============================================================
import { useRef } from "react";
// useRef => needed to scope useScroll to the Hero Section specifically
import { motion, useTransform } from "framer-motion";
// motion → Framer Motion animatable elements
// useScroll => tracks scroll progress
// useTransform => maps scroll progress to animation values
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
// ArrowRight → CTA button icon
// Github     → GitHub link icon
// MapPin     → location indicator
// Briefcase  → availability indicator
import { personalInfo, heroStats, projects } from "@/data";
// personalInfo → name, title, tagline, location, etc.
// heroStats    → the four stat items (years, projects, etc.)
// projects     → to count featured/live projects
// socialLinks  → GitHub, LinkedIn, etc.
import { SiGithub } from "react-icons/si";
// SiGithub → GitHub logo from the Simple Icons set (react-icons).
// Simple Icons are brand-accurate logo marks, separate from Lucide's
// generic UI icon style. Convention: Si prefix = "Simple Icons".
import { cn } from "@/lib/utils";
// cn() → our class name utility (clsx + tailwind-merge)
import { useTextScramble } from "@/hooks/useTextScramble";
import { useLenisScroll } from "@/hooks/useLenisScroll";
// ============================================================
// ANIMATION VARIANTS
// ============================================================
const heroVariants = {
    // Container — orchestrates children
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                // 100ms between each child animating in — fast, energetic
                delayChildren: 0.2,
                // Start after 200ms — gives the page layout time to settle
            },
        },
    },
    // Each item that slides up and fades in
    item: {
        hidden: {
            opacity: 0,
            y: 30,
            // Start 30px below final position
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                // Same cubic bezier as Preloader — consistent feel across the app
            },
        },
    },
    // The right column visual — comes in from the right
    visual: {
        hidden: {
            opacity: 0,
            x: 40,
            // Start 40px to the right of final position
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.4,
                // Starts after the left column content has begun appearing
            },
        },
    },
};
// ============================================================
// COMPONENT
// ============================================================
export default function Hero() {
    // Get only the live projects for a count
    const liveProjectCount = projects.filter((p) => p.status === "live").length;
    // .filter() returns a NEW array containing only elements where the
    // callback returns true. Here: keep only projects where status === "live".
    // .length → count how many items are in the filtered array.
    // Result: 2 (Nexus Pay and LagoNest are both "live")
    // ====================================
    // SCROLL TRACKING = FOR PARALLAX EFFECTS
    // ====================================
    const sectionRef = useRef(null);
    // Reference to the <section> element - we'll scope scroll tracking to it.
    // Identical API — returns a MotionValue from 0 to 1.
    // All the useTransform calls below work exactly the same.
    // The only difference is this reads from Lenis instead of
    // native browser scroll, so it actually fires correctly.
    const scrollYProgress = useLenisScroll(sectionRef);
    // ==============================================
    // PARALLAX TRANSFORMS
    // ==============================================
    const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 300]);
    // Top-left blob moves DOWN by up to 150px as you scroll through Hero.
    // Background elements typically move MORE than foreground content
    // in parallax — creates the illusion they're "behind" everything else.
    const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -200]);
    // Bottom-right blob moves UP by up to 100px — opposite direction
    // from blobOne. Mixing directions makes the effect feel more organic
    // and less mechanical than everything moving the same way.
    const cardY = useTransform(scrollYProgress, [0, 1], [0, 160]);
    // The visual card on the right moves down by up to 80px.
    // Less movement than the blobs (80px vs 150px) — the card is
    // "closer" to the viewer than the background blobs, so it should
    // move less for the parallax depth illusion to work correctly.
    const cardOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    // The card fades out as you scroll. Input range [0, 0.8] means:
    // at scrollYProgress 0   → opacity 1 (fully visible)
    // at scrollYProgress 0.8 → opacity 0 (fully faded)
    // at scrollYProgress 1   → STILL 0 (useTransform clamps outside the range
    //                          by default — it doesn't go negative)
    // This fades the card out before the user fully scrolls past Hero,
    // so it doesn't awkwardly "pop" away.
    const scrambledHeadline = useTextScramble({
        text: "I build things",
        trigger: true,
        // Starts immediately when the Hero mounts (after the preloader exits
        // and the page fades in — Hero only mounts once isLoading is false)
        speed: 35,
        // 35ms between ticks — slightly slower than default for a more
        // readable, deliberate decode effect (not too frantic)
        revealDelay: 3,
        // Lock in one new correct character every 3 ticks (~105ms per character)
        // With "I build things" (14 characters), total reveal time ≈ 1.5 seconds
    });
    return (_jsxs("section", { ref: sectionRef, 
        // Attach the ref here  - useScroll above reads from this element
        id: "home", className: "relative min-h-screen flex items-center pt-16 md:pt-20", children: [_jsx(motion.div, { className: "absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] bg-brand pointer-events-none", 
                /*
                  absolute          → removed from flow, positioned relative to section
                  top-0 left-0      → anchored to top-left corner
                  w-[600px] h-[600px] → large circle
                  rounded-full      → perfect circle
                  opacity-[0.07]    → 7% opacity — extremely subtle
                                      Arbitrary opacity: square brackets for values
                                      not in Tailwind's default scale (0, 5, 10, 25...)
                  blur-[120px]      → massive blur — turns the circle into a soft glow
                  bg-brand          → brand blue color (#2D6FE0)
                  pointer-events-none → mouse events pass through — can't accidentally
                                        "click" on a decorative blob
                */
                style: { y: blobOneY } }), _jsx(motion.div, { className: "absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] bg-gold pointer-events-none", style: { y: blobTwoY } }), _jsx("div", { className: "container-custom w-full py-20", children: _jsxs(motion.div, { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center", 
                    /*
                      grid              → CSS Grid layout
                      grid-cols-1       → single column on mobile (stacked)
                      lg:grid-cols-2    → two equal columns on lg (1024px+)
                      gap-12            → 48px gap between columns on mobile
                      lg:gap-20         → 80px gap on desktop — more breathing room
                      items-center      → vertically align both columns to their centers
                    */
                    variants: heroVariants.container, initial: "hidden", animate: "visible", children: [_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(motion.div, { variants: heroVariants.item, children: _jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-bg-border bg-bg-surface", children: [_jsxs("span", { className: "relative flex h-2 w-2", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-success" })] }), _jsx("span", { className: "text-sm text-text-secondary font-medium", children: "Available for new projects" }), _jsxs("span", { className: "text-xs text-brand font-semibold px-2 py-0.5 rounded-full bg-brand/10", children: [liveProjectCount, " live"] })] }) }), _jsx(motion.div, { variants: heroVariants.item, className: "space-y-2", children: _jsxs("h1", { className: "text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.05] tracking-tight", children: [_jsx("span", { className: "block", children: scrambledHeadline }), _jsx(motion.span, { className: "block text-gradient", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: {
                                                    delay: 1.8,
                                                    // Wait until the scramble effect has mostly finished
                                                    // 14 chars * 105ms = 1.5s) before fading this line in
                                                    duration: 0.6,
                                                    ease: "easeOut",
                                                }, children: "that work." })] }) }), _jsxs(motion.p, { variants: heroVariants.item, className: "text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg", children: ["Full-Stack Developer based in", " ", _jsx("span", { className: "text-text-primary font-medium", children: personalInfo.location }), ". I craft fast, scalable web applications with", " ", _jsx("span", { className: "text-text-primary font-medium", children: "React, Node.js, and PostgreSQL" }), "."] }), _jsxs(motion.div, { variants: heroVariants.item, className: "flex flex-wrap gap-4", children: [_jsxs("a", { href: "#projects", className: cn("btn-primary group"), children: ["View My Work", _jsx(ArrowRight, { size: 16, className: "transition-transform duration-200 group-hover:translate-x-1" })] }), _jsx("a", { href: "#contact", className: "btn-outline", children: "Let's Talk" }), _jsxs("a", { href: personalInfo.github, target: "_blank", rel: "noopener noreferrer", 
                                            /*
                                              target="_blank"        → opens in a new browser tab
                                              rel="noopener noreferrer" → security attribute required with
                                                                         target="_blank".
                                              "noopener"  → prevents the new tab from accessing the
                                                            opener window via window.opener (XSS protection)
                                              "noreferrer" → doesn't send the Referer header to the new page
                                                             (privacy) — also implies noopener
                                            */
                                            className: "btn-outline flex items-center gap-2", children: [_jsx(SiGithub, { size: 16 }), " GitHub"] })] }), _jsx(motion.div, { variants: heroVariants.item, className: "grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-bg-border", children: heroStats.map((stat, index) => (_jsxs(motion.div, { className: "flex flex-col gap-1", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: {
                                            delay: 0.6 + index * 0.1,
                                            // Each stat staggers by 100ms:
                                            // Stat 0: 0.6s, Stat 1: 0.7s, Stat 2: 0.8s, Stat 3: 0.9s
                                            duration: 0.5,
                                            ease: "easeOut",
                                        }, children: [_jsx("span", { className: "text-3xl font-bold text-gold font-display", children: stat.value }), _jsx("span", { className: "text-sm text-text-muted leading-tight", children: stat.label })] }, stat.label))) })] }), _jsxs(motion.div, { variants: heroVariants.visual, className: "relative hidden lg:block", 
                            /*
                              relative       → positioning context for floating elements inside
                              hidden         → hidden on mobile (single column layout)
                              lg:block       → visible on lg (1024px+) when two columns appear
                            */
                            style: { y: cardY, opacity: cardOpacity }, children: [_jsxs("div", { className: "relative z-10 rounded-2xl border border-bg-border bg-bg-surface p-8 overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-brand/10 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-brand flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-white font-bold text-lg font-display", children: personalInfo.name
                                                                    .split(" ")
                                                                    .slice(0, 2)
                                                                    .map((w) => w[0])
                                                                    .join("") }) }), _jsxs("div", { children: [_jsx("p", { className: "text-text-primary font-semibold text-sm", children: personalInfo.shortName }), _jsx("p", { className: "text-text-muted text-xs", children: personalInfo.title })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-xs text-success", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-success" }), "Open to work"] })] }), _jsxs("div", { className: "space-y-4 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0", children: _jsx(MapPin, { size: 14, className: "text-brand" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-text-muted text-xs", children: "Location" }), _jsx("p", { className: "text-text-primary font-medium", children: personalInfo.location })] })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0", children: _jsx(Briefcase, { size: 14, className: "text-brand" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-text-muted text-xs", children: "Experience" }), _jsx("p", { className: "text-text-primary font-medium", children: "3+ Years Freelance" })] })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0", children: _jsx(SiGithub, { size: 16 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-text-muted text-xs", children: "GitHub" }), _jsx("a", { href: personalInfo.github, target: "_blank", rel: "noopener noreferrer", className: "text-text-primary font-medium hover:text-brand transition-colors duration-200", children: "temitope-israel" })] })] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["React", "TypeScript", "Node.js", "PostgreSQL"].map((tech) => (_jsx("span", { className: "tag", children: tech }, tech)
                                            // tag → our custom pill class from index.css
                                            )) })] }), _jsx("div", { className: "absolute inset-0 rounded-2xl border border-brand/20 -z-10", style: { transform: "translate(12px, 12px)" } }), _jsx("div", { className: "absolute inset-0 rounded-2xl border border-brand/10 -z-20", style: { transform: "translate(24px, 24px)" } })] })] }) })] }));
}

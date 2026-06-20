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

import { motion } from "framer-motion";
// motion → Framer Motion animatable elements

import { ArrowRight, MapPin, Briefcase } from "lucide-react";
// ArrowRight → CTA button icon
// Github     → GitHub link icon
// MapPin     → location indicator
// Briefcase  → availability indicator

import { personalInfo, heroStats, projects, socialLinks } from "@/data";
// personalInfo → name, title, tagline, location, etc.
// heroStats    → the four stat items (years, projects, etc.)
// projects     → to count featured/live projects
// socialLinks  → GitHub, LinkedIn, etc.

import { cn } from "@/lib/utils";
// cn() → our class name utility (clsx + tailwind-merge)

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
  } as const,

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
  } as const,

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
  } as const,
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

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20"
      /*
        relative        → positioning context for decorative absolute elements
        min-h-screen    → at least 100vh tall — fills the viewport
        flex items-center → vertically center the content grid
        overflow-hidden → clips decorative elements that extend beyond the section
        pt-16 md:pt-20  → top padding to clear the fixed navbar
      */
    >
      {/* --------------------------------------------------------
          DECORATIVE BACKGROUND ELEMENTS
          These are purely visual — blurred color blobs that add
          depth to the dark background. All absolutely positioned
          so they don't affect document flow.
      -------------------------------------------------------- */}

      {/* Top-left blob — brand blue */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] bg-brand pointer-events-none"
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
      />

      {/* Bottom-right blob — gold/amber */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] bg-gold pointer-events-none" />

      {/* --------------------------------------------------------
          MAIN CONTENT
      -------------------------------------------------------- */}
      <div className="container-custom w-full py-20">
        {/*
          container-custom → max-width 1280px, centered, horizontal padding
          w-full           → take full available width inside container
          py-20            → 80px top and bottom padding inside the hero
        */}

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          /*
            grid              → CSS Grid layout
            grid-cols-1       → single column on mobile (stacked)
            lg:grid-cols-2    → two equal columns on lg (1024px+)
            gap-12            → 48px gap between columns on mobile
            lg:gap-20         → 80px gap on desktop — more breathing room
            items-center      → vertically align both columns to their centers
          */
          variants={heroVariants.container}
          initial="hidden"
          animate="visible"
        >
          {/* ====================================================
              LEFT COLUMN — Text Content
          ==================================================== */}
          <div className="flex flex-col gap-8">
            {/*
              flex flex-col → stack children vertically
              gap-8         → 32px between each block
            */}

            {/* --- Availability badge --- */}
            <motion.div variants={heroVariants.item}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-bg-border bg-bg-surface">
                {/*
                  inline-flex   → sits inline (doesn't stretch full width)
                  items-center  → vertically center icon and text
                  gap-2         → 8px between elements
                  px-4 py-2     → 16px horizontal, 8px vertical padding
                  rounded-full  → pill shape
                  border border-bg-border → subtle border
                  bg-bg-surface → slightly lighter card background
                */}

                {/* Pulsing dot */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  {/*
                    Two layered spans create the ping effect:
                    Outer: animate-ping → scales up and fades (the ripple)
                    Inner: solid dot that stays visible
                  */}
                </span>

                <span className="text-sm text-text-secondary font-medium">
                  Available for new projects
                </span>

                {/* Live project count */}
                <span className="text-xs text-brand font-semibold px-2 py-0.5 rounded-full bg-brand/10">
                  {/*
                    bg-brand/10 → brand blue at 10% opacity.
                    The /10 is Tailwind v4's opacity modifier.
                    Creates a subtle blue tint background behind the count.
                  */}
                  {liveProjectCount} live
                </span>
              </div>
            </motion.div>

            {/* --- Main headline --- */}
            <motion.div variants={heroVariants.item} className="space-y-2">
              {/*
                space-y-2 → adds 8px vertical margin between direct children.
                Tailwind's space-y utility adds margin-top to all children
                except the first. Equivalent to gap-2 on a flex-col container.
              */}

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.05] tracking-tight">
                {/*
                  text-5xl          → 3rem (48px) on mobile
                  md:text-6xl       → 3.75rem (60px) on tablet
                  lg:text-7xl       → 4.5rem (72px) on desktop
                  font-bold         → weight 700
                  text-text-primary → #F4F6F9
                  leading-[1.05]    → custom line height: 1.05× font size
                                      Arbitrary value — tighter than leading-tight (1.25)
                  tracking-tight    → letter-spacing: -0.025em
                */}

                {/* Line 1 */}
                <span className="block">I build things</span>
                {/*
                  block → display: block forces this span onto its own line.
                  Without it, both spans would flow inline as one long line.
                */}

                {/* Line 2 — gradient accent */}
                <span className="block text-gradient">
                  that work.
                  {/*
                    text-gradient → our custom class from index.css
                    The words "that work." render in our blue→amber gradient.
                    This draws the eye to the most important part of the headline.
                  */}
                </span>
              </h1>

              {/* Day 9: text scramble effect will wrap the h1 above */}
            </motion.div>

            {/* --- Sub-headline --- */}
            <motion.p
              variants={heroVariants.item}
              className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg"
              /*
                text-lg md:text-xl → 18px mobile, 20px desktop
                text-text-secondary → #9AA4B2
                leading-relaxed     → line-height: 1.625 — comfortable reading
                max-w-lg            → max-width: 32rem (512px)
                                      Constrains paragraph width for readability.
                                      Long lines are hard to read — ~65 chars is ideal.
              */
            >
              Full-Stack Developer based in{" "}
              <span className="text-text-primary font-medium">
                {personalInfo.location}
              </span>
              . I craft fast, scalable web applications with{" "}
              <span className="text-text-primary font-medium">
                React, Node.js, and PostgreSQL
              </span>
              .
              {/*
                {" "} → explicit space character in JSX.
                JSX collapses whitespace between elements, so we need
                this to ensure a space appears between inline text and spans.
              */}
            </motion.p>

            {/* --- CTA Buttons --- */}
            <motion.div
              variants={heroVariants.item}
              className="flex flex-wrap gap-4"
              /*
                flex-wrap → buttons wrap to next line if screen is narrow
                gap-4     → 16px between buttons
              */
            >
              <a
                href="#projects"
                className={cn(
                  "btn-primary group",
                  // group → enables group-hover: on children
                )}
              >
                View My Work
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  /*
                    group-hover:translate-x-1 → when the button (group) is hovered,
                    the arrow moves 4px to the right.
                    translate-x-1 = translateX(4px) — subtle directional hint.
                  */
                />
              </a>

              <a href="#contact" className="btn-outline">
                Let's Talk
              </a>

              {/* GitHub link */}

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                /*
                  target="_blank"        → opens in a new browser tab
                  rel="noopener noreferrer" → security attribute required with
                                             target="_blank".
                  "noopener"  → prevents the new tab from accessing the
                                opener window via window.opener (XSS protection)
                  "noreferrer" → doesn't send the Referer header to the new page
                                 (privacy) — also implies noopener
                */
                className="btn-outline flex items-center gap-2"
              >
                GitHub
              </a>
            </motion.div>

            {/* --- Stats Row --- */}
            <motion.div
              variants={heroVariants.item}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-bg-border"
              /*
                grid-cols-2      → 2 stats per row on mobile
                sm:grid-cols-4   → all 4 in one row on sm (640px+)
                gap-6            → 24px between stat cells
                pt-8             → 32px padding above the stats
                border-t         → top border line
                border-bg-border → #1F2733 — subtle separator
              */
            >
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col gap-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    // Each stat staggers by 100ms:
                    // Stat 0: 0.6s, Stat 1: 0.7s, Stat 2: 0.8s, Stat 3: 0.9s
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <span className="text-3xl font-bold text-gold font-display">
                    {/*
                      text-3xl    → 1.875rem (30px)
                      font-bold   → weight 700
                      text-gold   → #F2A93B — amber highlight
                                    Stats use gold to distinguish them from
                                    the brand blue — visual hierarchy.
                      font-display → Bricolage Grotesque
                    */}
                    {stat.value}
                  </span>
                  <span className="text-sm text-text-muted leading-tight">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          {/* END LEFT COLUMN */}

          {/* ====================================================
              RIGHT COLUMN — Visual Card
          ==================================================== */}
          <motion.div
            variants={heroVariants.visual}
            className="relative hidden lg:block"
            /*
              relative       → positioning context for floating elements inside
              hidden         → hidden on mobile (single column layout)
              lg:block       → visible on lg (1024px+) when two columns appear
            */
          >
            {/* Main card */}
            <div className="relative z-10 rounded-2xl border border-bg-border bg-bg-surface p-8 overflow-hidden">
              {/*
                relative z-10   → above the decorative rings behind it
                rounded-2xl     → border-radius: 1rem (16px)
                border border-bg-border → subtle border
                bg-bg-surface   → #111722 card background
                p-8             → 32px padding all around
                overflow-hidden → clips the internal decorative gradient
              */}

              {/* Internal gradient glow — top-right corner */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
              {/*
                bg-brand/10  → brand blue at 10% opacity
                blur-3xl     → filter: blur(64px) — soft glow
                This subtle internal glow makes the card feel alive.
              */}

              {/* Card header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg font-display">
                      {personalInfo.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold text-sm">
                      {personalInfo.shortName}
                    </p>
                    <p className="text-text-muted text-xs">
                      {personalInfo.title}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1.5 text-xs text-success">
                  {/*
                    gap-1.5 → 6px gap (1.5 × 4px)
                    text-success → #22C55E green
                  */}
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Open to work
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-4 mb-8">
                {/*
                  space-y-4 → 16px vertical gap between children
                */}

                {/* Location row */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-brand" />
                    {/*
                      text-brand → icon color: #2D6FE0
                      size={14}  → 14×14px icon
                    */}
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Location</p>
                    <p className="text-text-primary font-medium">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>

                {/* Experience row */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0">
                    <Briefcase size={14} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Experience</p>
                    <p className="text-text-primary font-medium">
                      3+ Years Freelance
                    </p>
                  </div>
                </div>

                {/* GitHub row */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-bg-border flex items-center justify-center flex-shrink-0">
                    
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">GitHub</p>

                    <a
                      href={personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary font-medium hover:text-brand transition-colors duration-200"
                    >
                      temitope-israel
                    </a>
                  </div>
                </div>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "PostgreSQL"].map(
                  (tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                    // tag → our custom pill class from index.css
                  ),
                )}
              </div>
            </div>
            {/* END main card */}

            {/* Decorative ring behind the card */}
            <div
              className="absolute inset-0 rounded-2xl border border-brand/20 -z-10"
              style={{ transform: "translate(12px, 12px)" }}
              /*
                absolute inset-0  → same size and position as the card
                border-brand/20   → brand blue at 20% opacity — ghost border
                -z-10             → BEHIND the card (z-index: -10 relative to parent)
                transform: translate(12px, 12px) → offset 12px right and down.
                This creates a "shadow card" effect — looks like depth.
                We use inline style here because Tailwind's translate classes
                use the spacing scale (translate-x-3 = 12px) but the combination
                of both axes is cleaner as one style prop.
              */
            />

            {/* Second, larger decorative ring */}
            <div
              className="absolute inset-0 rounded-2xl border border-brand/10 -z-20"
              style={{ transform: "translate(24px, 24px)" }}
              // Further offset — three layers create strong depth illusion
            />
          </motion.div>
          {/* END RIGHT COLUMN */}
        </motion.div>
      </div>
      {/* END MAIN CONTENT */}
    </section>
  );
}

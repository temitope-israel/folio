// src/components/sections/About.tsx
// ============================================================
// ABOUT SECTION
// ============================================================
// Contains:
//   - Section header
//   - Bio paragraphs (left column)
//   - Animated stat counters
//   - Core values list (right column)
//   - Fun facts
// ============================================================

import { motion } from "framer-motion";
import {
  Code2,
  Lightbulb,
  Users,
  Zap,
  BookOpen,
  Coffee,
  MapPin,
  Star,
} from "lucide-react";
// All UI icons — Lucide is fine for these (non-brand icons).

import { personalInfo, heroStats } from "@/data";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";

// ============================================================
// ANIMATION VARIANTS
// ============================================================

// const sectionVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15,
//       delayChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       ease: [0.25, 0.46, 0.45, 0.94],
//     },
//   },
// } as const;

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

// ============================================================
// STAT COUNTER COMPONENT
// ============================================================
// A self-contained sub-component for each animated counter.
// Defined here (not in a separate file) because it's only used
// in About. If used elsewhere, we'd move it to shared/.

interface StatCounterProps {
  value: string;
  // The display value from heroStats: "3+", "20+", "100%"
  label: string;
  index: number;
  // Index used to stagger the animation delay
}

function StatCounter({ value, label, index }: StatCounterProps) {
  // Extract the numeric part from strings like "3+", "20+", "100%"
  const numericValue = parseInt(value, 10);
  // parseInt(string, radix) → parses a string and returns an integer.
  // "3+"   → 3   (stops at the first non-numeric character "+")
  // "20+"  → 20
  // "100%" → 100
  // radix: 10 → parse as base-10 (decimal). Always specify this.
  //            Without it, strings starting with "0" might parse as octal.

  const suffix = value.replace(/[0-9]/g, "");
  // .replace(regex, replacement) → replaces matches with the replacement string.
  // /[0-9]/g → a regular expression (regex):
  //   [0-9]  → match any single digit character (0 through 9)
  //   g      → "global" flag — replace ALL matches, not just the first
  // "" → replace each digit with nothing (delete it)
  // "3+"   → "+"   (remove all digits, leave "+")
  // "100%" → "%"
  // "20+"  → "+"

  const { count, elementRef } = useCounterAnimation({
    target: numericValue,
    // Count from 0 to the extracted number
    duration: 2000,
    startOnView: true,
    // Start counting when this element scrolls into view
  });

  return (
    <motion.div
      ref={elementRef}
      // Attach ref so IntersectionObserver watches this element
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-bg-surface border border-bg-border hover:border-brand/50 transition-colors duration-300"
      /*
        flex flex-col items-center text-center → stack and center content
        p-6           → 24px padding
        rounded-2xl   → 24px border radius — softer than the card
        bg-bg-surface → #111722 card background
        border border-bg-border → subtle border
        hover:border-brand/50 → brand blue at 50% opacity on hover
        transition-colors duration-300 → smooth border color transition
      */
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      // whileInView → animates when element enters the viewport.
      // This is different from animate — animate runs once on mount,
      // whileInView runs every time the element enters the viewport.
      viewport={{ once: true, margin: "-50px" }}
      // once: true → only animate the first time it enters view.
      //              After that, stays in the animated state even if
      //              you scroll away and back.
      // margin: "-50px" → trigger 50px BEFORE the element reaches
      //                   the viewport edge (anticipatory animation).
      transition={{
        delay: index * 0.1,
        // Stagger each counter by 100ms based on its position
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <span className="text-4xl font-bold text-gold font-display mb-1">
        {count}
        {suffix}
        {/*
          count  → the animated number (0 → target)
          suffix → the "+" or "%" character after the number
          Together they produce: "0+", "7+", "20+", "100%"
        */}
      </span>
      <span className="text-sm text-text-muted">{label}</span>
    </motion.div>
  );
}

// ============================================================
// VALUES DATA
// ============================================================
// Defined here as it's specific to the About section.
// Not in the global data file because it's not reused elsewhere.

const values = [
  {
    icon: Code2,
    // Lucide icon COMPONENT (not a string like in data/index.ts).
    // We store it as a component reference here because this data
    // is only used in this file — no need for the string-to-component
    // mapping pattern we use in the global data file.
    title: "Clean Code",
    description:
      "Every line intentional. No dead code, no magic numbers, no unexplained complexity.",
  },
  {
    icon: Zap,
    title: "Performance First",
    description:
      "Fast by default. I optimize for Core Web Vitals from day one, not as an afterthought.",
  },
  {
    icon: Users,
    title: "User Focused",
    description:
      "The best interface is one the user never has to think about. I build for people, not portfolios.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description:
      "The stack evolves. I stay current — not chasing trends, but understanding what matters and why.",
  },
];

// ============================================================
// FUN FACTS DATA
// ============================================================

const funFacts = [
  { icon: MapPin, text: "Based in Lagos, Nigeria 🇳🇬" },
  { icon: BookOpen, text: "Currently reading Myles Munroe" },
  { icon: Coffee, text: "Fueled by focus and discipline" },
  { icon: Star, text: "Available for freelance & full-time" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function About() {
  return (
    <section id="about" className="section-padding border-t border-bg-border">
      <div className="container-custom">
        {/* -----------------------------------------------
            SECTION HEADER
        ----------------------------------------------- */}
        <motion.div
          className="text-center mb-16"
          /*
            text-center → center all text inside
            mb-16       → 64px bottom margin before content
          */
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-brand text-sm font-semibold uppercase tracking-widest mb-3 block">
            {/*
              text-brand      → brand blue label
              text-sm         → 14px
              uppercase       → "ABOUT ME" in caps
              tracking-widest → very wide letter spacing — typical for eyebrow labels
              mb-3 block      → 12px below, display block (spans are inline by default)
            */}
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            The person behind the code
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {/*
              max-w-2xl → constrain width for readability
              mx-auto   → margin-left: auto + margin-right: auto → centers the paragraph
            */}
            A developer who cares about craft, clarity, and building things that
            actually work.
          </p>
        </motion.div>

        {/* -----------------------------------------------
            MAIN GRID — Bio (left) + Values (right)
        ----------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/*
            grid-cols-1    → single column on mobile
            lg:grid-cols-2 → two columns on desktop
            gap-16         → 64px between columns
            mb-20          → 80px below the grid, before the counters
          */}

          {/* LEFT COLUMN — Bio */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            // margin: "-80px" → start animation 80px before element enters view
            // Creates a sense that the animation is "ready" when you see it
            className="flex flex-col gap-6"
          >
            <div className="space-y-4">
              {personalInfo.bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-text-secondary leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    // Each paragraph fades in 150ms after the previous
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  {paragraph}
                  {/*
                    personalInfo.bio is an array of strings.
                    Each string is one paragraph of the bio.
                    .map() renders each as a <p> tag.
                  */}
                </motion.p>
              ))}
            </div>

            {/* Fun Facts */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/*
                grid-cols-1    → single column on mobile
                sm:grid-cols-2 → two columns on sm (640px+)
                gap-3          → 12px between facts
              */}
              {funFacts.map((fact, index) => {
                const Icon = fact.icon;
                // We store icon components as references in funFacts.
                // To render a component stored in a variable, the variable
                // name MUST start with an uppercase letter.
                // fact.icon → lowercase → React treats it as an HTML element (fails)
                // Icon      → uppercase → React treats it as a component (correct)

                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-bg-surface border border-bg-border"
                    /*
                      flex items-center → icon and text side by side, vertically centered
                      gap-3             → 12px between icon and text
                      p-3               → 12px padding
                      rounded-xl        → 16px border radius
                    */
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-brand" />
                      {/* Render the icon component stored in the Icon variable */}
                    </div>
                    <span className="text-sm text-text-secondary">
                      {fact.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Values */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-4"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              // Same uppercase rename pattern — required to render as component

              return (
                <motion.div
                  key={value.title}
                  className="flex gap-4 p-5 rounded-xl bg-bg-surface border border-bg-border hover:border-brand/40 transition-all duration-300 group"
                  /*
                    flex gap-4  → icon block and text content side by side
                    p-5         → 20px padding
                    rounded-xl  → 16px border radius
                    hover:border-brand/40 → blue border tint on hover
                    group       → enables group-hover: on children
                  */
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  whileHover={{ x: 4 }}
                  // whileHover → while the cursor is over this element,
                  // apply x: 4 (move 4px right). When cursor leaves, spring back.
                  // Creates a subtle "nudge right" effect on hover — feels interactive.
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors duration-300">
                    {/*
                      w-10 h-10  → 40×40px icon container
                      bg-brand/10 → blue at 10% opacity
                      group-hover:bg-brand/20 → intensifies to 20% on hover
                    */}
                    <Icon size={18} className="text-brand" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-text-primary font-semibold mb-1 group-hover:text-brand transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* -----------------------------------------------
            STAT COUNTERS
        ----------------------------------------------- */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          /*
            grid-cols-2    → 2 counters per row on mobile
            lg:grid-cols-4 → all 4 in a row on desktop
            gap-4          → 16px between counters
          */
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {heroStats.map((stat, index) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={index}
              // Pass index so StatCounter can stagger its animation delay
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// TechStack.tsx
// src/components/sections/TechStack.tsx
// ============================================================
// TECH STACK SECTION
// ============================================================
// Displays all technologies as an infinite scrolling marquee.
// Two rows — first row scrolls left (forward),
// second row scrolls right (reverse) — creates visual depth.
//
// Structure:
//   - Section header with eyebrow label
//   - Category filter pills
//   - Row 1: frontend + tools (scrolls left)
//   - Row 2: backend + database (scrolls right)
// ============================================================

import { useState } from "react";
// useState → tracks the active category filter

import { motion, AnimatePresence } from "framer-motion";
// motion        → animatable elements
// AnimatePresence → exit animations for the filtered items

import { techStack } from "@/data";
// techStack → array of { name, category } tech items

// ============================================================
// TYPES
// ============================================================

type FilterCategory = "all" | "frontend" | "backend" | "database" | "tools";
// The possible filter values — matches the categories in techStack data.

// ============================================================
// FILTER CATEGORIES CONFIG
// ============================================================

const filterCategories: { label: string; value: FilterCategory }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Database", value: "database" },
  { label: "Tools", value: "tools" },
];
// An array of objects defining each filter pill.
// label → display text in the UI
// value → the category string to filter by

// ============================================================
// MARQUEE ROW COMPONENT
// ============================================================
// A single infinite-scrolling row of tech items.
// Extracted as its own component because we render two of them.

interface MarqueeRowProps {
  items: typeof techStack;
  // typeof techStack → TypeScript infers the exact type of the techStack
  // array from data/index.ts. Equivalent to writing TechItem[] but
  // avoids importing the type separately.

  reverse?: boolean;
  // If true, uses the reverse animation (scrolls right instead of left)

  speed?: "slow" | "normal" | "fast";
  // Controls animation duration
}

function MarqueeRow({
  items,
  reverse = false,
  speed = "normal",
}: MarqueeRowProps) {
  const speedMap = {
    slow: "40s",
    normal: "30s",
    fast: "20s",
  };
  // speedMap converts our human-readable speed prop to CSS duration values.
  // Longer duration = slower scroll.
  // This is a "lookup object" — instead of if/else chains, we index into an object.

  const duration = speedMap[speed];
  // speedMap["normal"] → "30s"
  // speedMap["fast"]   → "20s"

  // Duplicate the items array for the seamless loop technique
  const duplicatedItems = [...items, ...items];
  // Spread operator (...) expands an array into individual elements.
  // [...items, ...items] creates a new array with items appearing twice.
  // [A, B, C] → [A, B, C, A, B, C]
  // This is the DUPLICATE step from our marquee technique explanation above.

  return (
    <div
      className="flex overflow-hidden"
      /*
        flex         → children sit side by side in a row
        overflow-hidden → clips items that scroll outside the container.
                          Without this, the duplicated items would be visible
                          outside the marquee area — we only want to see
                          what's in the "window".
      */
    >
      <motion.div
        className="flex gap-4 w-max"
        /*
          flex  → items sit side by side
          gap-4 → 16px between each item
          w-max → width: max-content.
                  The div is as wide as ALL its children combined.
                  Without this, the div would be constrained to the
                  parent's width and items would wrap to a new line.
                  w-max lets it be infinitely wide — we scroll it
                  horizontally via animation.
        */
        animate={{
          x: reverse ? ["0%", "50%"] : ["0%", "-50%"],
          // For forward marquee: move from 0% to -50% (scroll left)
          // For reverse marquee: move from 0% to +50% (scroll right)
          // We use 50% because the content is doubled — moving 50% of the
          // total width = moving exactly one copy's worth of content.
          // At -50%: the second copy aligns with where the first started.
        }}
        transition={{
          duration: parseInt(duration),
          // parseInt("30s") → 30. We need a number, not a string with "s".
          // Framer Motion's duration is in SECONDS (not ms like CSS).
          ease: "linear",
          // linear → constant speed throughout. Essential for marquees.
          // Any easing would cause the marquee to speed up/slow down
          // at the start/end of each loop — looks broken.
          repeat: Infinity,
          // Repeat forever — never stops.
          repeatType: "loop",
          // "loop" → jump back to start after each iteration.
          // Other options:
          //   "reverse" → plays forward then backward (pendulum)
          //   "mirror"  → same as reverse
          // "loop" is correct for marquees — we jump back to 0% invisibly.
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            // Key combines name + index because names repeat in the duplicate.
            // item.name alone would cause duplicate key warnings since
            // we have two copies of every item.
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-surface border border-bg-border whitespace-nowrap flex-shrink-0 hover:border-brand/50 hover:bg-brand/5 transition-all duration-200"
            /*
              px-5 py-3        → 20px horizontal, 12px vertical padding
              rounded-xl       → 16px border radius — pill-like
              bg-bg-surface    → card background
              border border-bg-border → subtle border
              whitespace-nowrap → prevents text from wrapping to next line.
                                  Each pill must stay on one line.
              flex-shrink-0    → prevents flexbox from compressing the pill.
                                  Without this, flex might shrink pills to
                                  fit them all on one line — breaking the marquee.
              hover:border-brand/50 → blue border on hover
              hover:bg-brand/5 → very subtle blue tint background on hover
            */
          >
            {/* Category color dot */}
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.category === "frontend"
                  ? "bg-brand"
                  : item.category === "backend"
                    ? "bg-gold"
                    : item.category === "database"
                      ? "bg-success"
                      : "bg-text-muted"
                // Ternary chain — each category gets a different dot color:
                // frontend → brand blue
                // backend  → amber/gold
                // database → green
                // tools    → muted grey
                // This helps users visually distinguish categories at a glance.
              }`}
            />

            <span className="text-sm font-medium text-text-secondary whitespace-nowrap">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ============================================================
// FILTERED GRID COMPONENT
// ============================================================
// Shows tech items in a static grid when a filter is active.
// Only visible when a specific category is selected (not "all").

interface FilteredGridProps {
  items: typeof techStack;
}

function FilteredGrid({ items }: FilteredGridProps) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      /*
        Responsive grid:
        grid-cols-2 → 2 columns on mobile
        sm:grid-cols-3 → 3 on sm (640px+)
        md:grid-cols-4 → 4 on md (768px+)
        lg:grid-cols-5 → 5 on lg (1024px+)
      */
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // AnimatePresence in the parent will use this exit animation
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {/*
          mode="popLayout" → when items are removed from the list,
          the remaining items smoothly reflow into their new positions.
          Think of it like items sliding to fill the gap left by removed items.
          Better than "wait" here because we're animating a grid layout change.
        */}
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            // Stable key (name only, not index) so AnimatePresence can
            // track which specific item is entering/exiting.
            layout
            // layout prop → Framer Motion automatically animates this element
            // to its new position when the grid reflows.
            // When you filter from 24 items to 8, the remaining 8 items
            // smoothly slide to their new grid positions.
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-surface border border-bg-border hover:border-brand/50 transition-colors duration-200 group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              delay: index * 0.03,
              // Very fast stagger — 30ms per item.
              // With up to 24 items, total stagger = 720ms.
              // Fast enough to feel snappy, slow enough to be visible.
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            {/* Category dot */}
            <span
              className={`w-2 h-2 rounded-full ${
                item.category === "frontend"
                  ? "bg-brand"
                  : item.category === "backend"
                    ? "bg-gold"
                    : item.category === "database"
                      ? "bg-success"
                      : "bg-text-muted"
              }`}
            />
            <span className="text-sm font-medium text-text-secondary text-center group-hover:text-text-primary transition-colors duration-200">
              {item.name}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TechStack() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  // activeFilter → which category pill is currently selected.
  // Starts as "all" — show everything in marquee mode.
  // useState<FilterCategory> → typed state — can only be one of
  // the five valid FilterCategory values.

  // Filter the tech items based on active category
  const filteredItems =
    activeFilter === "all"
      ? techStack
      : techStack.filter((item) => item.category === activeFilter);
  // Ternary operator:
  // If activeFilter is "all" → use the full techStack array unfiltered.
  // Otherwise → filter to only items whose category matches activeFilter.

  // Split items into two rows for the marquee
  const frontendAndTools = techStack.filter(
    (item) => item.category === "frontend" || item.category === "tools",
  );
  // Row 1: frontend + tools items
  // || means OR — keep item if category is "frontend" OR "tools"

  const backendAndDatabase = techStack.filter(
    (item) => item.category === "backend" || item.category === "database",
  );
  // Row 2: backend + database items

  const isFiltered = activeFilter !== "all";
  // Boolean flag — true when a specific category is selected.
  // Used to switch between marquee view and filtered grid view.

  return (
    <section
      id="stack"
      className="section-padding border-t border-bg-border overflow-hidden"
      /*
        overflow-hidden → clips the marquee rows that extend beyond
                          the section width. Without this, the marquee
                          items scrolling off the right edge would create
                          a horizontal scrollbar on the page.
      */
    >
      <div className="container-custom">
        {/* -----------------------------------------------
            SECTION HEADER
        ----------------------------------------------- */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-brand text-sm font-semibold uppercase tracking-widest mb-3 block">
            Tech Stack
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Tools I build with
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            A curated set of technologies I've worked with professionally —
            chosen for reliability, performance, and developer experience.
          </p>
        </motion.div>

        {/* -----------------------------------------------
            FILTER PILLS
        ----------------------------------------------- */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          /*
            flex-wrap       → pills wrap to next line on small screens
            justify-center  → center the pill row
            gap-2           → 8px between pills
            mb-12           → 48px below pills before content
          */
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          {filterCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveFilter(category.value)}
              // onClick → when clicked, update activeFilter state.
              // This triggers a re-render with the new filter applied.
              // setActiveFilter(category.value) passes the clicked category's
              // value ("frontend", "backend", etc.) to the state setter.
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === category.value
                  ? "bg-brand text-white border border-brand"
                  : // ACTIVE pill: filled blue background, white text
                    "bg-bg-surface text-text-secondary border border-bg-border hover:border-brand/50 hover:text-text-primary"
                // INACTIVE pill: card background, grey text, blue border on hover
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>
      </div>
      {/* ↑ Close container-custom here — marquee rows go full width */}

      {/* -----------------------------------------------
          CONTENT — Marquee OR Filtered Grid
      ----------------------------------------------- */}
      <AnimatePresence mode="wait">
        {!isFiltered ? (
          // ---- MARQUEE VIEW (when "All" is selected) ----
          <motion.div
            key="marquee"
            // key required by AnimatePresence to track this element
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Row 1 — frontend + tools, scrolls LEFT */}
            <div className="marquee-pause">
              {/*
                marquee-pause → our custom utility class from index.css.
                When the user hovers this container, the inner marquee-track
                pauses (animation-play-state: paused).
                Lets users hover to read a specific item.
              */}
              <MarqueeRow
                items={frontendAndTools}
                reverse={false}
                // Scrolls left (default)
                speed="normal"
              />
            </div>

            {/* Row 2 — backend + database, scrolls RIGHT */}
            <div className="marquee-pause">
              <MarqueeRow
                items={backendAndDatabase}
                reverse={true}
                // Scrolls right
                speed="normal"
              />
            </div>
          </motion.div>
        ) : (
          // ---- FILTERED GRID VIEW (when a category is selected) ----
          <motion.div
            key="grid"
            // Different key — AnimatePresence sees "marquee" leave and "grid" enter
            className="container-custom"
            // Re-apply container here for the grid view
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilteredGrid items={filteredItems} />

            {/* Item count */}
            <p className="text-center text-text-muted text-sm mt-6">
              {filteredItems.length} technologies in{" "}
              <span className="text-brand capitalize">{activeFilter}</span>
              {/*
                capitalize → text-transform: capitalize.
                "frontend" → "Frontend"
              */}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

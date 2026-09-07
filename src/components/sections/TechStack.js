import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
// The possible filter values — matches the categories in techStack data.
// ============================================================
// FILTER CATEGORIES CONFIG
// ============================================================
const filterCategories = [
    { label: "All", value: "all" },
    { label: "Frontend", value: "frontend" },
    { label: "Backend", value: "backend" },
    { label: "Database", value: "database" },
    { label: "Tools", value: "tools" },
];
function MarqueeRow({ items, reverse = false, speed = "normal", }) {
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
    return (_jsx("div", { className: "flex overflow-hidden", children: _jsx(motion.div, { className: "flex gap-4 w-max", 
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
            animate: {
                x: reverse ? ["0%", "50%"] : ["0%", "-50%"],
                // For forward marquee: move from 0% to -50% (scroll left)
                // For reverse marquee: move from 0% to +50% (scroll right)
                // We use 50% because the content is doubled — moving 50% of the
                // total width = moving exactly one copy's worth of content.
                // At -50%: the second copy aligns with where the first started.
            }, transition: {
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
            }, children: duplicatedItems.map((item, index) => (_jsxs("div", { 
                // Key combines name + index because names repeat in the duplicate.
                // item.name alone would cause duplicate key warnings since
                // we have two copies of every item.
                className: "flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-surface border border-bg-border whitespace-nowrap flex-shrink-0 hover:border-brand/50 hover:bg-brand/5 transition-all duration-200", children: [_jsx("span", { className: `w-2 h-2 rounded-full flex-shrink-0 ${item.category === "frontend"
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
                        }` }), _jsx("span", { className: "text-sm font-medium text-text-secondary whitespace-nowrap", children: item.name })] }, `${item.name}-${index}`))) }) }));
}
function FilteredGrid({ items }) {
    return (_jsx(motion.div, { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3", 
        /*
          Responsive grid:
          grid-cols-2 → 2 columns on mobile
          sm:grid-cols-3 → 3 on sm (640px+)
          md:grid-cols-4 → 4 on md (768px+)
          lg:grid-cols-5 → 5 on lg (1024px+)
        */
        initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, 
        // AnimatePresence in the parent will use this exit animation
        transition: { duration: 0.3 }, children: _jsx(AnimatePresence, { mode: "popLayout", children: items.map((item, index) => (_jsxs(motion.div, { 
                // Stable key (name only, not index) so AnimatePresence can
                // track which specific item is entering/exiting.
                layout: true, 
                // layout prop → Framer Motion automatically animates this element
                // to its new position when the grid reflows.
                // When you filter from 24 items to 8, the remaining 8 items
                // smoothly slide to their new grid positions.
                className: "flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-surface border border-bg-border hover:border-brand/50 transition-colors duration-200 group", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, transition: {
                    delay: index * 0.03,
                    // Very fast stagger — 30ms per item.
                    // With up to 24 items, total stagger = 720ms.
                    // Fast enough to feel snappy, slow enough to be visible.
                    duration: 0.3,
                    ease: "easeOut",
                }, children: [_jsx("span", { className: `w-2 h-2 rounded-full ${item.category === "frontend"
                            ? "bg-brand"
                            : item.category === "backend"
                                ? "bg-gold"
                                : item.category === "database"
                                    ? "bg-success"
                                    : "bg-text-muted"}` }), _jsx("span", { className: "text-sm font-medium text-text-secondary text-center group-hover:text-text-primary transition-colors duration-200", children: item.name })] }, item.name))) }) }));
}
// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TechStack() {
    const [activeFilter, setActiveFilter] = useState("all");
    // activeFilter → which category pill is currently selected.
    // Starts as "all" — show everything in marquee mode.
    // useState<FilterCategory> → typed state — can only be one of
    // the five valid FilterCategory values.
    // Filter the tech items based on active category
    const filteredItems = activeFilter === "all"
        ? techStack
        : techStack.filter((item) => item.category === activeFilter);
    // Ternary operator:
    // If activeFilter is "all" → use the full techStack array unfiltered.
    // Otherwise → filter to only items whose category matches activeFilter.
    // Split items into two rows for the marquee
    const frontendAndTools = techStack.filter((item) => item.category === "frontend" || item.category === "tools");
    // Row 1: frontend + tools items
    // || means OR — keep item if category is "frontend" OR "tools"
    const backendAndDatabase = techStack.filter((item) => item.category === "backend" || item.category === "database");
    // Row 2: backend + database items
    const isFiltered = activeFilter !== "all";
    // Boolean flag — true when a specific category is selected.
    // Used to switch between marquee view and filtered grid view.
    return (_jsxs("section", { id: "stack", className: "section-padding border-t border-bg-border overflow-hidden", children: [_jsxs("div", { className: "container-custom", children: [_jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: "easeOut" }, children: [_jsx("span", { className: "text-brand text-sm font-semibold uppercase tracking-widest mb-3 block", children: "Tech Stack" }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold text-text-primary mb-4", children: "Tools I build with" }), _jsx("p", { className: "text-text-secondary max-w-xl mx-auto", children: "A curated set of technologies I've worked with professionally \u2014 chosen for reliability, performance, and developer experience." })] }), _jsx(motion.div, { className: "flex flex-wrap justify-center gap-2 mb-12", 
                        /*
                          flex-wrap       → pills wrap to next line on small screens
                          justify-center  → center the pill row
                          gap-2           → 8px between pills
                          mb-12           → 48px below pills before content
                        */
                        initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.2, ease: "easeOut" }, children: filterCategories.map((category) => (_jsx("button", { onClick: () => setActiveFilter(category.value), 
                            // onClick → when clicked, update activeFilter state.
                            // This triggers a re-render with the new filter applied.
                            // setActiveFilter(category.value) passes the clicked category's
                            // value ("frontend", "backend", etc.) to the state setter.
                            className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === category.value
                                ? "bg-brand text-white border border-brand"
                                : // ACTIVE pill: filled blue background, white text
                                    "bg-bg-surface text-text-secondary border border-bg-border hover:border-brand/50 hover:text-text-primary"
                            // INACTIVE pill: card background, grey text, blue border on hover
                            }`, children: category.label }, category.value))) })] }), _jsx(AnimatePresence, { mode: "wait", children: !isFiltered ? (_jsxs(motion.div, { 
                    // key required by AnimatePresence to track this element
                    className: "flex flex-col gap-6", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, children: [_jsx("div", { className: "marquee-pause", children: _jsx(MarqueeRow, { items: frontendAndTools, reverse: false, 
                                // Scrolls left (default)
                                speed: "normal" }) }), _jsx("div", { className: "marquee-pause", children: _jsx(MarqueeRow, { items: backendAndDatabase, reverse: true, 
                                // Scrolls right
                                speed: "normal" }) })] }, "marquee"
                // key required by AnimatePresence to track this element
                )) : (_jsxs(motion.div, { 
                    // Different key — AnimatePresence sees "marquee" leave and "grid" enter
                    className: "container-custom", 
                    // Re-apply container here for the grid view
                    initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, children: [_jsx(FilteredGrid, { items: filteredItems }), _jsxs("p", { className: "text-center text-text-muted text-sm mt-6", children: [filteredItems.length, " technologies in", " ", _jsx("span", { className: "text-brand capitalize", children: activeFilter })] })] }, "grid"
                // Different key — AnimatePresence sees "marquee" leave and "grid" enter
                )) })] }));
}

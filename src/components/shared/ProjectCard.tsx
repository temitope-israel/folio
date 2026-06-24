// src/components/shared/ProjectCard.tsx
// ============================================================
// PROJECT CARD COMPONENT
// ============================================================
// A reusable card that displays a single project.
// Used in two contexts:
//   1. Featured row — larger, more prominent (variant="featured")
//   2. Project grid — standard size (variant="grid")
//
// Hover effects reveal the action buttons and lift the card.
// ============================================================

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight, Clock, CheckCircle } from "lucide-react";

import { SiGithub } from "react-icons/si";

import { Project } from "@/types";
// Import the Project interface defined
// This ensures the card always receives a correctly shaped project object

import { cn } from "@/lib/utils";

// =======================================
// COMPONENT PROPS
// =======================================

interface ProjectCardProps {
  project: Project;
  // The full project object - typed with our Project interface.
  // Every property (title, tagline, tags, live, etc.) is available.

  variant?: "featured" | "grid";
  // Controls the card's visual size and layout.
  // "featured" => larger card shown at the top of projects section
  // "grid" => standard card in the project grid below
  // ? => Optional, defaults to "grid" if not provided.

  index?: number;
  // Position in the list = used to calculate animation stagger delay.
  // Optional - defaults to 0 if not provided.
}

// ==================================
// STATUS BADGE SUB-COMPONENT
// ==================================

function StatusBadge({ status }: { status: Project["status"] }) {
  // Project["status"] => TS "indexed access type".
  // Reads the type of the 'status" property directly from the project interface.
  // Equivalent to: "live" | "in-progress" | "planned"
  // If we ever update Project["status"] in types/index.ts, this updates too.

  const config = {
    live: {
      label: "Live",
      icon: CheckCircle,
      className: "bg-success/10 text-success border-success/20",
    },
    "in-progress": {
      label: "In Progress",
      icon: Clock,
      className: "bg-bold/10 text-gold border-gold/20",
      // gold tones for in-progress
    },
    planned: {
      label: "Planned",
      icon: Clock,
      className: "bg-text-muted/10 text-text-muted border-text-muted/20",
      // muted tones for planned - lowest visual priority.
    },
  };
  // Config is a lookup object - index by status to get the right config.
  // This is cleaner than a chain of if/else or a switch statement.

  const { label, icon: Icon, className } = config[status];
  // Destructure the config for this status.
  // icon: Icon => rename the "icon" property to "Icon" during destructuring.
  // We Must rename to uppercase to render it as a React component.
  // {icon:Icon} means: "take the 'icon' property and call it "Icon" here".

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
        className,
        // cn() merges the base classes witht the status-specific classes.
      )}
    >
      <Icon size={10} />
      {label}
    </span>
  );
}

// =================================
// MAIN COMPONENT
// =================================

export default function ProjectCard({
  project,
  variant = "grid",
  index = 0,
}: ProjectCardProps) {
  const isFeatured = variant === "featured";
  // Boolean flag - cleaner to read than checking variant === "featured" repeatedly.

  const isLive = project.status === "live";
  // true if the project is deployed and accessible.
  // Used to determine if external links should be active.

  return (
    <motion.article
      // <article> is the correct semantic HTML element for a self-contained piece of content - a project card qualifies.
      // motion.article => Framer Motion wraps if for entrance animation.

      className={cn(
        // Base classes - applied to ALL cards regardless of variant
        "group relative flex flex-col rounded-2xl border border-bg-border bg-bg-surface overflow-hidden transition-all duration-300",
        /**
         * group => enables group-hover: on all children
         * relative => positioning context for absolute overlay elements
         * flex flex-col => stack children vertically
         * rounded-2xl => 24px border radius
         * border border-bg-border => subtle border
         * bg-bg-surface => #111722 card bg
         * overflow-hidden => clips the hover overlay and internal
         * decorations.
         * transition-all duration-300 => animate ALL CSS properties over 300ms when state changes (hover, focus)
         */
        "hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/5",
        /**
         * hover:border-brand/40 => border turns brand blue (40% capacity) on hover
         * hover:shadow-2xl => large box shadow appears on hover
         * hover:shadow-brand/5 => shadow tinted with brand blue at 5% opacity - creates a subtle blue glow beneath the card.
         */
        isFeatured && "lg:flex-row lg:min-h-[280px]",
        /**
         * isFeatured => cn() conditionally applies these classes only for featured cards.
         * lg:flex-row => on desktop, featured card lays out horizontally (content left, visual right) instead of stacked vertically.
         * lg:min-h-[280px] => minimum height for the featured card on desktop.
         */
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // whileInView => animate in when card scrolls into view.
      // EAch card animates independently as you scroll down.
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.08,
        // Stagger: card 0 at 0ms, card 1 at 80ms, card 2 at 160ms, etc.
        // 0.08s per card - fast enough to feel snappy, visible enough to notice.
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6 }}
      // on hover: lift the card 6px upward.
      // Combined with the shadow, creates a "floating" effect.
      // CSS transition handles color/shadow, Framer Motion handles the lift.
    >
      {/* ===============================================
                 DECORATIVE TOP GRADIENT LINE
                 A thin colored line at the very top of the card - only visible on hover, slides in from left.
                 ==============================================       */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      {/*
        absolute top-0 left-0 right-0 → pinned to top edge, full width
        h-[2px]          → 2px tall line
        bg-gradient-to-r from-brand to-gold → gradient from blue to amber
        scale-x-0        → starts invisible (width = 0%)
        group-hover:scale-x-100 → full width when parent (.group) is hovered
        transition-transform duration-500 → slide animation takes 500ms
        origin-left      → grow from left to right
      */}

      {/* ====================================
                CARD CONTENT WRAPPER
                Handles the layout difference between featured and grid.
                ================================ */}
      <div className={cn("flex flex-col flex-1 p-6", isFeatured && "lg:p-8")}>
        {/* Header row: status badge + categories */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/*
            items-start    → align badge and tags to their top edges
                             (they might have different heights)
            justify-between → push badge left, tags right
            gap-3          → 12px between them
            mb-4           → 16px below the header row
          */}
          <StatusBadge status={project.status} />
          {/* Renders the colored status pill */}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-end">
            {/*
              flex-wrap    → tags wrap to next line if needed
              justify-end  → align tags to the right
            */}
            {project.tags.slice(0, 3).map((tag) => (
              // .slice(0, 3) → take only the first 3 tags.
              // Cards have limited space — showing all 5-6 tags would overflow.
              // The full list is visible on a detail page (future feature).
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-bg-border text-text-muted"

                /*
                  text-xs  → 12px
                  px-2 py-0.5 → 8px horizontal, 2px vertical padding
                  rounded-full → pill shape
                  bg-bg-border → dark background
                  text-text-muted → muted grey text
                */
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ==== Project Title ==== */}
        <h3
          className={cn(
            "font-bold text-text-primary font-display mb-2 group-hover:text-brand transition-colors duration-300",
            /*
              isFeatured → featured cards get larger title text
              group-hover:text-brand → title turns brand blue when card is hovered
              transition-colors duration-300 → smooth color change
            */
          )}
        >
          {project.title}
        </h3>

        {/* Tagline.... */}
        <p className="text-text-secondary text-sm leading-relaxed mb-auto">
          {project.tagline}
          {/*
            mb-auto → pushes everything BELOW this paragraph to the bottom
                      of the card. "auto" margin consumes all available space.
                      This ensures the action buttons are always at the bottom
                      regardless of how tall the description is.
                      Critical for equal-height cards in a grid.
          */}
        </p>

        {/* Action Buttons */}
        <div
          className={cn(
            "flex items-center gap-3 mt-5",
            // mt-5 → 20px top margin, separating buttons from tagline

            !isFeatured &&
              "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300",
            /*
              For GRID cards only (not featured):
              translate-y-2 → start 8px below final position
              opacity-0     → start invisible
              group-hover:translate-y-0 → slide up to position on hover
              group-hover:opacity-100   → fade in on hover
              transition-all duration-300 → animate both over 300ms

              This creates the "reveal on hover" effect for grid cards.
              Featured cards always show their buttons (no hide/show).
            */
          )}
        >
          {/* Live site link */}
          {isLive && (
            // ONly render the live link if the project is actually live.
            // Planned/in-progress projects have href="#" - no point linking
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors duration-200",
                isFeatured
                  ? "btn-primary text-sm px-4 py-2"
                  : // Featured: full button style
                    "text-text-secondary hover:text-brand",
                // Grid: text link style (buttons appear on hover)
              )}
              onClick={(e) => e.stopPropagation()}
              // e.stopPropagation() => prevents the click from bubbling up
              // to any parent click handlers. Important if we wrap cards
              // in a clickable container later.
            >
              {isFeatured ? (
                <>
                  View Project
                  <ArrowUpRight size={14} />
                </>
              ) : (
                <>
                  <ExternalLink size={14} />
                  Live
                </>
              )}
            </a>
          )}

          {/* Github link */}
          {project.github && (
            // project.github is optional (?) - only render if it exists.
            // planned projects don't have a repo yet
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors duration-200",
                isFeatured
                  ? "btn-outline text-sm px-4 py-2"
                  : "text-text-secondary hover:text-brand",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <SiGithub size={14} />
              {isFeatured && "Source"}
              {/*
                isFeatured && "Source" → only show the word "Source" on
                featured cards. Grid cards show only the icon (space is tight).
                false && "Source" → renders nothing (React ignores false).
                true && "Source"  → renders "Source".
              */}
            </a>
          )}

          {/* Planned badge - shown when project has no live link yet */}
          {!isLive && !project.github && (
            <span className="text-xs text-text-muted italic">Coming Soon</span>
          )}
        </div>
      </div>
      {/* END CONTENT WRAPPER */}

      {/* ========================================
        FEATURED CARD VISUAL PANEL
        Right side panel on featured cards (desktop only).
        Shows a decorative visual area.
        =======================================
*/}

      {isFeatured && (
        <div className="hidden lg:flex lg:w-[280px] flex-shrink-0 items-center justify-center bg-bg-border/50 relative overflow-hidden">
          {/*
            hidden lg:flex → only visible on desktop
            lg:w-[280px]   → fixed 280px width for the visual panel
            flex-shrink-0  → don't let flexbox compress this panel
            bg-bg-border/50 → slightly different background to distinguish
                              the visual panel from the content panel
            relative overflow-hidden → for decorative elements inside
          */}

          {/* Decorative Bg glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-gold/5" />
          {/*
            bg-gradient-to-br → gradient going to bottom-right
            from-brand/10     → starts with brand blue at 10% opacity
            to-gold/5         → ends with gold at 5% opacity
          */}

          {/* project initials as large display text */}
          <span className="relative text-[80px] font-bold font-display text-text-primary/5 select-none">
            {/*
              text-[80px]       → very large display text
              text-text-primary/5 → near white at 5% opacity — extremely subtle
              select-none       → prevents users from accidentally selecting this text
            */}
            {project.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 3)
              .toUpperCase()}
            {/*
              Derive initials from project title:
              "Nexus Pay" → ["Nexus", "Pay"] → ["N", "P"] → "NP"
              "LagoNest"  → ["LagoNest"] → ["L"] → "L"
              .slice(0, 3) → max 3 characters (some titles have 3+ words)
            */}
          </span>
        </div>
      )}
    </motion.article>
  );
}

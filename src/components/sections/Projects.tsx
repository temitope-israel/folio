// src/components/sections/Projects.tsx
// ============================================================
// PROJECTS SECTION
// ============================================================
// Structure:
//   1. Section header
//   2. Featured projects row (always visible, not filtered)
//   3. Category filter pills
//   4. Animated project grid (filtered by category)
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ExternalLink } from "lucide-react";

import { projects } from "@/data";
import { ProjectCategory } from "@/types";
import ProjectCard from "@/components/shared/ProjectCard";

// ======================================
// FILTER CONFIG
// ======================================

const filters: {
  label: string;
  value: ProjectCategory;
  count?: number;
}[] = [
  { label: "All Projects", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Full-Stack", value: "fullstack" },
  { label: "Backend", value: "backend" },
];
// count is optional - we calculate it dynamically below.
// We don't hardcode counts here because they'd go stale if projects change.

// =====================================
// COMPONENT
// =====================================

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  // Tracks which filter pill is active. Starts with "all".

  // ========================================
  // Derived data - calculated from state + data
  // ========================================

  const featuredProjects = projects.filter((p) => p.featured);
  // Featured projects are always shown at the top - not affected by the filter.
  // .filter() keeps only projects where featured === true.
  // Result: [Nexus Pay, LagoNest]

  const nonFeaturedProjects = projects.filter((p) => !p.featured);
  // All non-featured projects go into the filterable grid below.
  // !p.featured => keep projects where featured is FALSe.
  // Result: [Ekklesia, Prestige, Artisano, PulseBoard]

  const filteredProjects = nonFeaturedProjects.filter((p) => {
    // Apply the active category filter to the non-featured projects.
    if (activeFilter === "all") return true;
    // "all" => keep everything => return true for every project.
    return p.category === activeFilter;
    // Specific filter => keep only projects matching the category
  });

  // Calculate count per category for filter pills.
  const getCount = (category: ProjectCategory): number => {
    // A function that takes a category and returns how many projects match.
    if (category === "all") return nonFeaturedProjects.length;
    // "all" => count of ALL non-featured projects
    return nonFeaturedProjects.filter((p) => p.category === category).length;
    // Specific category => count only matching projects
    // .filter(...).length => filter to matching items, then count them.
  };

  return (
    <section
      id="projects"
      className="section-padding border-t border-bg-border"
    >
      <div className="container-custom">
        {/* ==========================
                SECTION HEADER
                ============================ */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Left: label + title + subtitle */}
          <div>
            <span className="text-brand text-sm font-semibold uppercase tracking-widest mb-3 block">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">
              Things I've built
            </h2>
            <p className="text-text-secondary max-w-lg">
              A selection of projects ranging from client work to personal
              builds - each on a different problem, the same standard of craft
            </p>
          </div>

          {/* Right: GitHub profile link */}
          <a
            href="https://github.com/temitope-israel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand transition-colors duration-200 flex-shrink-0 group/link"
            /*
              flex-shrink-0 → prevent this link from shrinking when space is tight
              group/link    → named group for the underline animation
            */
          >
            View GitHub Profile
            <ExternalLink
              size={14}
              className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"

              /*
                On hover: icon moves slightly right AND up —
                mimics the diagonal direction of the ExternalLink arrow.
                translate-x-0.5  → 2px right
                -translate-y-0.5 → 2px up
              */
            />
          </a>
        </motion.div>

        {/* FEATURED PROJECTS */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers size={16} className="text-brand" />
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Featured
            </span>
            {/* Section label for the featured row */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/*
              Two featured projects side by side on desktop.
              Each is a full featured card (horizontal layout).
            */}
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="featured"
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* FILTER PILLS */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {filters.map((filter) => {
            const count = getCount(filter.value);
            // calculate count for this filter category.
            // Runs for every filter on every render - but it's cheap (small array).

            const isActive = activeFilter === filter.value;
            // Boolean: is this pill the currently selected one?

            return (
              <motion.button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`flex item-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                        ${
                          isActive
                            ? "bg-brand text-white border-brand shadow-lg shadow-brand/20"
                            : // Active: filled blue, white text, blue glow shadow
                              "bg-bg-surface text-text-secondary border-bg-border hover:border-b hover:text-text-primary"
                          // Inactive: card background, hover effects
                        }`}
                whileInView={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                // Subtle scale on hover/top - physical feedback
              >
                {filter.label}

                {/* Count badge */}
                <span
                  className={`
                                text-xs px-1.5 py-0.5 rounded-full font-semibold
                                ${
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : // Active: white at 20% opacity on the blue bg
                                      "bg-bg-border text-text-muted"
                                  // Inactive: dark bg, muted text
                                }`}
                >
                  {count}
                  {/* Shows how many projects are in this category */}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* PROJECT GRID */}

        {/* Results count */}
        <motion.p
          className="text-text-muted text-sm mb-6"
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Showing{" "}
          <span className="text-text-primary font-medium">
            {filteredProjects.length}
          </span>{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
          {activeFilter !== "all" && (
            // Only show "in frontend" etc. when a specific filter is active
            <span>
              {" "}
              in <span className="text-brand capitalize">{activeFilter}</span>
            </span>
          )}
        </motion.p>

        {/* Animated grid */}
        <motion.div
          layout
          // layout on the container => when the grid changes size
          // (fewwer/more items), the container smoothly resizes.
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="grid"
                  index={index}
                />
              ))
            ) : (
              <motion.div
                key="empty"
                // Unique key so AnimatePresence tracks thi as a distinct element
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                /*
                  col-span-full → span all 3 grid columns.
                                  The empty state should be centered across
                                  the full width of the grid, not just one cell.
                */

                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-bg-surface border-bg-border flex items-center justify-center mb-4">
                  <Layers size={24} className="text-text-muted" />
                </div>
                <p className="text-text-secondary font-medium mb-1">
                  No projects in this category yet
                </p>
                <p className="text-text-muted text-sm">
                  Check back soon - more projects are in progress.
                </p>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="mt-4 text-sm text-brand hover:underline"
                >
                  View all projects
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

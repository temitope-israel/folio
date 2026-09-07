import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import ProjectCard from "@/components/shared/ProjectCard";
// ======================================
// FILTER CONFIG
// ======================================
const filters = [
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
    const [activeFilter, setActiveFilter] = useState("all");
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
        if (activeFilter === "all")
            return true;
        // "all" => keep everything => return true for every project.
        return p.category === activeFilter;
        // Specific filter => keep only projects matching the category
    });
    // Calculate count per category for filter pills.
    const getCount = (category) => {
        // A function that takes a category and returns how many projects match.
        if (category === "all")
            return nonFeaturedProjects.length;
        // "all" => count of ALL non-featured projects
        return nonFeaturedProjects.filter((p) => p.category === category).length;
        // Specific category => count only matching projects
        // .filter(...).length => filter to matching items, then count them.
    };
    return (_jsx("section", { id: "projects", className: "section-padding border-t border-bg-border", children: _jsxs("div", { className: "container-custom", children: [_jsxs(motion.div, { className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: "easeOut" }, children: [_jsxs("div", { children: [_jsx("span", { className: "text-brand text-sm font-semibold uppercase tracking-widest mb-3 block", children: "Portfolio" }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold text-text-primary mb-3", children: "Things I've built" }), _jsx("p", { className: "text-text-secondary max-w-lg", children: "A selection of projects ranging from client work to personal builds - each on a different problem, the same standard of craft" })] }), _jsxs("a", { href: "https://github.com/temitope-israel", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand transition-colors duration-200 flex-shrink-0 group/link", children: ["View GitHub Profile", _jsx(ExternalLink, { size: 14, className: "transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" })] })] }), _jsxs(motion.div, { className: "mb-16", initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Layers, { size: 16, className: "text-brand" }), _jsx("span", { className: "text-sm font-semibold text-text-secondary uppercase tracking-wider", children: "Featured" })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: featuredProjects.map((project, index) => (_jsx(ProjectCard, { project: project, variant: "featured", index: index }, project.id))) })] }), _jsx(motion.div, { className: "flex flex-wrap gap-2 mb-10", initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.1 }, children: filters.map((filter) => {
                        const count = getCount(filter.value);
                        // calculate count for this filter category.
                        // Runs for every filter on every render - but it's cheap (small array).
                        const isActive = activeFilter === filter.value;
                        // Boolean: is this pill the currently selected one?
                        return (_jsxs(motion.button, { onClick: () => setActiveFilter(filter.value), className: `flex item-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                        ${isActive
                                ? "bg-brand text-white border-brand shadow-lg shadow-brand/20"
                                : // Active: filled blue, white text, blue glow shadow
                                    "bg-bg-surface text-text-secondary border-bg-border hover:border-b hover:text-text-primary"
                            // Inactive: card background, hover effects
                            }`, whileInView: { scale: 1.03 }, whileTap: { scale: 0.97 }, children: [filter.label, _jsx("span", { className: `
                                text-xs px-1.5 py-0.5 rounded-full font-semibold
                                ${isActive
                                        ? "bg-white/20 text-white"
                                        : // Active: white at 20% opacity on the blue bg
                                            "bg-bg-border text-text-muted"
                                    // Inactive: dark bg, muted text
                                    }`, children: count })] }, filter.value));
                    }) }), _jsxs(motion.p, { className: "text-text-muted text-sm mb-6", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 }, children: ["Showing", " ", _jsx("span", { className: "text-text-primary font-medium", children: filteredProjects.length }), " ", filteredProjects.length === 1 ? "project" : "projects", activeFilter !== "all" && (_jsxs("span", { children: [" ", "in ", _jsx("span", { className: "text-brand capitalize", children: activeFilter })] }))] }, activeFilter), _jsx(motion.div, { layout: true, 
                    // layout on the container => when the grid changes size
                    // (fewwer/more items), the container smoothly resizes.
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: _jsx(AnimatePresence, { mode: "popLayout", children: filteredProjects.length > 0 ? (filteredProjects.map((project, index) => (_jsx(ProjectCard, { project: project, variant: "grid", index: index }, project.id)))) : (_jsxs(motion.div, { 
                            // Unique key so AnimatePresence tracks thi as a distinct element
                            className: "col-span-full flex flex-col items-center justify-center py-20 text-center", 
                            /*
                              col-span-full → span all 3 grid columns.
                                              The empty state should be centered across
                                              the full width of the grid, not just one cell.
                            */
                            initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, transition: { duration: 0.4 }, children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-bg-surface border-bg-border flex items-center justify-center mb-4", children: _jsx(Layers, { size: 24, className: "text-text-muted" }) }), _jsx("p", { className: "text-text-secondary font-medium mb-1", children: "No projects in this category yet" }), _jsx("p", { className: "text-text-muted text-sm", children: "Check back soon - more projects are in progress." }), _jsx("button", { onClick: () => setActiveFilter("all"), className: "mt-4 text-sm text-brand hover:underline", children: "View all projects" })] }, "empty"
                        // Unique key so AnimatePresence tracks thi as a distinct element
                        )) }) })] }) }));
}

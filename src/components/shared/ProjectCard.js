import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
// Import the Project interface defined
// This ensures the card always receives a correctly shaped project object
import { cn } from "@/lib/utils";
// ==================================
// STATUS BADGE SUB-COMPONENT
// ==================================
function StatusBadge({ status }) {
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
    return (_jsxs("span", { className: cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border", className), children: [_jsx(Icon, { size: 10 }), label] }));
}
// =================================
// MAIN COMPONENT
// =================================
export default function ProjectCard({ project, variant = "grid", index = 0, }) {
    const isFeatured = variant === "featured";
    // Boolean flag - cleaner to read than checking variant === "featured" repeatedly.
    const isLive = project.status === "live";
    // true if the project is deployed and accessible.
    // Used to determine if external links should be active.
    return (_jsxs(motion.article
    // <article> is the correct semantic HTML element for a self-contained piece of content - a project card qualifies.
    // motion.article => Framer Motion wraps if for entrance animation.
    , { 
        // <article> is the correct semantic HTML element for a self-contained piece of content - a project card qualifies.
        // motion.article => Framer Motion wraps if for entrance animation.
        className: cn(
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
        isFeatured && "lg:flex-row lg:min-h-[280px]"), initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, 
        // whileInView => animate in when card scrolls into view.
        // EAch card animates independently as you scroll down.
        viewport: { once: true, margin: "-60px" }, transition: {
            delay: index * 0.08,
            // Stagger: card 0 at 0ms, card 1 at 80ms, card 2 at 160ms, etc.
            // 0.08s per card - fast enough to feel snappy, visible enough to notice.
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        }, whileHover: { y: -6 }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500" }), _jsxs("div", { className: cn("flex flex-col flex-1 p-6", isFeatured && "lg:p-8"), children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [_jsx(StatusBadge, { status: project.status }), _jsx("div", { className: "flex flex-wrap gap-2 justify-end", children: project.tags.slice(0, 3).map((tag) => (_jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-bg-border text-text-muted", children: tag }, tag))) })] }), _jsx("h3", { className: cn("font-bold text-text-primary font-display mb-2 group-hover:text-brand transition-colors duration-300"), children: project.title }), _jsx("p", { className: "text-text-secondary text-sm leading-relaxed mb-auto", children: project.tagline }), _jsxs("div", { className: cn("flex items-center gap-3 mt-5", 
                        // mt-5 → 20px top margin, separating buttons from tagline
                        !isFeatured &&
                            "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"), children: [isLive && (_jsx("a", { href: project.live, target: "_blank", rel: "noopener noreferrer", className: cn("flex items-center gap-1.5 text-sm font-medium transition-colors duration-200", isFeatured
                                    ? "btn-primary text-sm px-4 py-2"
                                    : // Featured: full button style
                                        "text-text-secondary hover:text-brand"), onClick: (e) => e.stopPropagation(), children: isFeatured ? (_jsxs(_Fragment, { children: ["View Project", _jsx(ArrowUpRight, { size: 14 })] })) : (_jsxs(_Fragment, { children: [_jsx(ExternalLink, { size: 14 }), "Live"] })) })), project.github && (_jsxs("a", { href: project.github, target: "_blank", rel: "noopener noreferrer", className: cn("flex items-center gap-1.5 text-sm font-medium transition-colors duration-200", isFeatured
                                    ? "btn-outline text-sm px-4 py-2"
                                    : "text-text-secondary hover:text-brand"), onClick: (e) => e.stopPropagation(), children: [_jsx(SiGithub, { size: 14 }), isFeatured && "Source"] })), !isLive && !project.github && (_jsx("span", { className: "text-xs text-text-muted italic", children: "Coming Soon" }))] })] }), isFeatured && (_jsxs("div", { className: "hidden lg:flex lg:w-[280px] flex-shrink-0 items-center justify-center bg-bg-border/50 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-brand/10 to-gold/5" }), _jsx("span", { className: "relative text-[80px] font-bold font-display text-text-primary/5 select-none", children: project.title
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 3)
                            .toUpperCase() })] }))] }));
}

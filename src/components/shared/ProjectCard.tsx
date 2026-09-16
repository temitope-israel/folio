// src/components/shared/ProjectCard.tsx

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight, Clock, CheckCircle } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

// =======================================
// COMPONENT PROPS
// =======================================

interface ProjectCardProps {
  project: Project;
  variant?: "featured" | "grid";
  index?: number;
}

// ==================================
// STATUS BADGE SUB-COMPONENT
// ==================================

function StatusBadge({ status }: { status: Project["status"] }) {
  const config = {
    live: {
      label: "Live",
      icon: CheckCircle,
      className: "bg-success/10 text-success border-success/20",
    },
    "in-progress": {
      label: "In Progress",
      icon: Clock,
      className: "bg-gold/10 text-gold border-gold/20",
    },
    planned: {
      label: "Planned",
      icon: Clock,
      className: "bg-text-muted/10 text-text-muted border-text-muted/20",
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
        className,
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
  const isLive = project.status === "live";

  return (
    <motion.article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-bg-border bg-bg-surface overflow-hidden transition-all duration-300",
        "hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/5",
        isFeatured && "lg:flex-row lg:min-h-[280px]",
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      {/* ── Grid card image (shown on hover) ─────────────────────────── */}
      {!isFeatured && project.image && (
        <div className="relative h-44 overflow-hidden">
          {/*
            h-44 → 176px tall image area at the top of grid cards
            overflow-hidden → clips the image when it scales on hover
          */}
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            /*
              object-cover → fills the area, cropping if needed
              object-top   → anchors to the top of the image
                             so the header/hero of the screenshot shows
              group-hover:scale-105 → subtle zoom on hover — feels alive
              transition-transform duration-500 → smooth 500ms zoom
            */
          />
          {/* Dark overlay so text below is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-surface/60" />
          {/*
            gradient from transparent → semi-dark at the bottom
            creates a smooth blend between image and card content
          */}
        </div>
      )}

      {/* ── Grid card — no image fallback ────────────────────────────── */}
      {!isFeatured && !project.image && (
        <div className="h-44 bg-gradient-to-br from-brand/10 to-gold/5 flex items-center justify-center">
          <span className="text-[60px] font-bold font-display text-text-primary/5 select-none">
            {project.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
      )}

      {/* Card content */}
      <div className={cn("flex flex-col flex-1 p-6", isFeatured && "lg:p-8")}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <StatusBadge status={project.status} />
          <div className="flex flex-wrap gap-2 justify-end">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-bg-border text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-text-primary font-display mb-2 group-hover:text-brand transition-colors duration-300">
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="text-text-secondary text-sm leading-relaxed mb-auto">
          {project.tagline}
        </p>

        {/* Action buttons */}
        <div
          className={cn(
            "flex items-center gap-3 mt-5",
            !isFeatured &&
              "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300",
          )}
        >
          {isLive && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors duration-200",
                isFeatured
                  ? "btn-primary text-sm px-4 py-2"
                  : "text-text-secondary hover:text-brand",
              )}
              onClick={(e) => e.stopPropagation()}
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

          {project.github && (
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
            </a>
          )}

          {!isLive && !project.github && (
            <span className="text-xs text-text-muted italic">Coming Soon</span>
          )}
        </div>
      </div>

      {/* ── Featured card visual panel ────────────────────────────────── */}
      {/* ── Featured card visual panel ────────────────────────────────── */}
      {isFeatured && (
        <>
          {/* Mobile image — shown on small screens, hidden on desktop */}
          {project.image && (
            <div className="lg:hidden relative h-48 overflow-hidden">
              {/*
          lg:hidden → only shows below 1024px
          h-48 → 192px tall on mobile
        */}
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Bottom gradient blends into card content */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-surface/60" />
            </div>
          )}

          {/* Desktop image panel — hidden on mobile, shown on lg+ */}
          <div className="hidden lg:flex lg:w-[320px] flex-shrink-0 relative overflow-hidden">
            {project.image ? (
              <>
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-surface/40 via-transparent to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-gold/5" />
                <span className="relative text-[80px] font-bold font-display text-text-primary/5 select-none m-auto">
                  {project.title
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 3)
                    .toUpperCase()}
                </span>
              </>
            )}
          </div>
        </>
      )}
    </motion.article>
  );
}

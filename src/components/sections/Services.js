import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/sections/Services.tsx
// ============================================================
// SERVICES SECTION
// ============================================================
// Four service cards, each with:
//   - Icon
//   - Title + description
//   - Deliverables list (bullet points)
//   - CTA link
// Uses multi-level stagger: cards stagger in, then deliverables
// stagger inside each card.
// ============================================================
import { motion } from "framer-motion";
import { Monitor, Layers, Zap, MessageSquare, CheckCircle2, ArrowRight, } from "lucide-react";
// These match the icon strings stored in services data.
// Monitor      → Frontend Development
// Layers       → Full-Stack Applications
// Zap          → API Development
// MessageSquare → Technical Consulting
// CheckCircle2 → deliverable list bullet
// ArrowRight   → CTA arrow
import { services } from "@/data";
import { cn } from "@/lib/utils";
// ============================================================
// ICON MAP
// ============================================================
// In data/index.ts, icons are stored as strings ("Monitor", "Layers").
// Here we map those strings to the actual Lucide components.
// This keeps the data file free of React/JSX imports.
const iconMap = {
    // Record<string, ComponentType> → TypeScript type for an object
    // where keys are strings and values are React component types.
    // React.ComponentType<Props> → the type of a React component
    // that accepts { size?, className? } props (standard Lucide props).
    Monitor,
    Layers,
    Zap,
    MessageSquare,
};
// ====================================
// ANIMATION VARIANT
// ====================================
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            // 150ms between each service card animating in
            delayChildren: 0.1,
        },
    },
};
const cardVariants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.06,
            // Each deliverable item inside this card staggers by 60ms
            delayChildren: 0.25,
            // Wait 250ms after the card appears before deliverables start
        },
    },
};
const deliverableVariants = {
    // Each item in the deliverables list
    hidden: {
        opacity: 0,
        x: -12,
        // Start 12px to the left
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};
function ServiceCard({ service, index }) {
    const Icon = iconMap[service.icon];
    // Look up the lucide component for this service's icon string.
    // service.icon = "Monitor" => iconMap["Monitor"] => <Monitor/> component
    const isEven = index % 2 === 0;
    // true for cards at index 0, 2 (first and third cards)
    // false for cards at index 1, 3 (second and fourth cards)
    // Used to alternate accent colors for visual variety.
    return (_jsxs(motion.div, { variants: cardVariants, 
        // Inherits initial/animate from parent containerVariants.
        // Parent's staggerChildren controls WHEN this card animates.
        // This card's own staggerChildren controls its deliverables.
        className: "group relative flex flex-col p-7 rounded-2xl bg-bg-surface border border-bg-border hover:border-brand/40 transition-all duration-300 overflow-hidden", whileHover: { y: -4 }, children: [_jsx("div", { className: cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", isEven ? "bg-brand/15" : "bg-gold/15") }), _jsx("div", { className: cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0 transition-colors duration-300", isEven
                    ? "bg-brand/10 group-hover:bg-brand/20"
                    : "bg-gold/10 group-hover:bg-gold/20"), children: Icon && (_jsx(Icon, { size: 22, className: cn("transition-colors duration-300", isEven ? "text-brand" : "text-gold") })) }), _jsx("h3", { className: "text-xl font-bold text-text-primary font-display mb-3 group-hover:text-brand transition-colors duration-300", children: service.title }), _jsx("p", { className: "text-text-secondary text-sm leading-relaxed mb-6", children: service.description }), _jsx("div", { className: "w-full h-px bg-bg-border mb-5" }), _jsx("div", { className: "flex flex-col gap-2 5 flex-1 mb-6", children: service.deliverables.map((deliverable) => (_jsxs(motion.div, { variants: deliverableVariants, className: "flex items-start gap-2.5", children: [_jsx(CheckCircle2, { size: 14, className: cn("flex-shrink-0 mt-0.5", 
                            // mt-0.5 => 2px top margin - aligns icon with first line of text
                            // flex-shrink-0 => icon never compresses if text is long
                            isEven ? "text-brand" : "text-gold") }), _jsx("span", { className: "text-sm text-text-secondary leading-snug", children: deliverable })] }, deliverable))) }), _jsxs("a", { href: "#contact", className: cn("inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200", isEven ? "text-brand" : "text-gold"), children: ["Get Started", _jsx(ArrowRight, { size: 14, className: "transition-transform duration-200 group-hover/cta:translate-x-1" })] })] }));
}
// ================================================
// MAIN COMPONENT
// ================================================
export default function Services() {
    return (_jsx("section", { id: "services", className: "section-padding border-t border-bg-border", children: _jsxs("div", { className: "container-custom", children: [_jsxs(motion.div, { className: "text-center mb-16", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: "easeOut" }, children: [_jsx("span", { className: "text-brand text-sm font-semibold uppercase tracking-widest mb-3 block", children: "Services" }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold text-text-primary mb-4", children: "What I can build for you" }), _jsx("p", { className: "text-text-secondary max-w-2xl mx-auto", children: "From landing pages to full-stack applications - I handle the complete build so you can focus on your product." })] }), _jsx(motion.div, { className: "grid grid-cols-1 md:grid-cols-2 gap-6", variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" }, children: services.map((service, index) => (_jsx(ServiceCard, { service: service, index: index }, service.id))) }), _jsxs(motion.div, { className: "mt-16 p-8 md:p-12 rounded-2xl bg-bg-surface border border-bg-border text-center relative overflow-hidden", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.3 }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-gold/5 pointer-events-none" }), _jsxs("div", { className: "relative", children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold text-text-primary font-display mb-3", children: "Have a project in mind?" }), _jsx("p", { className: "text-text-secondary mb-8 max-w-md mx-auto", children: "Let's talk about what you're building. I'll tell you honestly if I'm the right fit - and if I am, we'll ship something great." }), _jsxs("a", { href: "#contact", className: "btn-primary inline-flex", children: ["Start a conversation", _jsx(ArrowRight, { size: 16 })] })] })] })] }) }));
}

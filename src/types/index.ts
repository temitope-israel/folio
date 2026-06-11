// src/types/index.ts
// ====================================================
// GLOBAL TYPE DEFINITION FOR FOLIO
// ====================================================
// This file defines the shape of every piece of data in the portfolio.
// Every component that uses data will import from here.

// Having all types in one place means:
// 1. One source of truth - change a type here, it updates everywhere.
// 2. TypeScript will catch mismatches immediately
// 3. Editor will autocomplete property names.
// ====================================================


/**
 * NAVIGATION
 *
 */

export interface NavLink {
    // A single item in the navigation menu
    label: string;  // The text displayed: "About", "Projects", etc.
    href: string;   // The anchor link: "#about", "#projects", etc.
}


// ========================================
// PROJECTS
// ========================================

export type ProjectCategory =
| "all" // Used for the "show everything filter button"
| "frontend" // Purely frontend projects
| "fullstack"   // Frontend + backend projects
| "backend"     // API/Server-only projects



export interface Project {
    id: string; // Unique identifier for this project. Uses as React list keys and for filtering logic.
    title: string;  // Display name: "Nexus Pay".
    tagline: string;        // One-line description shown on the card: "Nigerian fintech SaaS landing page"
    description: string;    // Longer description shown in expanded view or modal
    tags: string[];        // Tech tags: ["React", "TypeScript", "Tailwind CSS"].
    // string[] means an array where every element is a string
    category: ProjectCategory;
    live: string;   // URL to the deployed live site
    github?: string; // ? makes it optional
    featured: boolean; // true = show in the features section at the top of Projects else show only in the full grid
    status: "live" | "in-progress" | "planned";
    // Inline union type - this property can only be one of these three strings.
    // "live" = deployed and working
    // "in-progress" - currently building
    // "planned" = placeholder, not started yet

}

// ========================================
// TECH STACK
// ========================================

export interface TechItem {
    // A single technology in the marquee
    name: string;   // "React", "TypeScript", "PostgreSQL"
    category: "frontend" | "backend" | "database" | "tools";    // Which row/category this tech belongs to
}

// =====================================
// SERVICES
// =====================================

export interface Service {
    id: string;
    icon: string;
    title: string;  // "Frontend Development", "Full-stack Apps", etc.
    description: string;
    deliverables: string[];     // List of what the client gets: ["Responsive UI", "TypeScript codebase", "Vercel deployment"]
}


// =================================
// PROCESS STEPS
// =================================

export interface ProcessStep {
    step: number; // 01, 02, 03, 04
    title: string;  // "Discovery", "Design", "Build", "Deploy"
    description: string;
}

// =================================
// STATS (Shown in Hero and About sections)
// =================================

export interface Stat {
    value: string;  // The number/text to display: "3+", "20+", "100%"
    // We use string (not number) because values like "3+" are not pure numbers.
    label: string;      // Description below the value: "Years Experience", "Projects Delivered"
}

// ================================
// CONTACT FORM
// ================================

export interface ContactFormData{
    // The shape of data collected by the contact form.
    // Also used by Zod for validation and by the backend API.

    name: string;
    email: string;
    subject: string;

}

export interface ContactFormState {
    // Tracks the state of the form submission
    status: "idle" | "loading" | "success" | "error";
    // "idle" = form has not been submitted yet
    // "loading" = fetch request in progress
    // "success" = server responded with 200
    // "error" = something went wrong
    message: string;
    // The message to show the user after submission: "Message sent!" or "Something went wrong, please try again."
}


// ===============================================
// SOCIAL LINKS
// ===============================================

export interface SocialLink{
    label: string;     // "GitHub", "LinkedIn", "Twitter"
    href: string;   // Full URL
    icon: string;   // Icon name string - mapped to Lucide icon in component
}


// ================================================
// ANALYTICS FOR ADMIN DASHBOARD
// ================================================

export interface PageVisit {
    // Same with Prisma Model
    id: number;
    page: string;   // "/" or "/admin"
    visitedAt: string;  // ISO date string from PostgreSQL
    userAgent?: string;     // Browser/device info - optional
}


export interface ContactMessage {
    // Same with Prisma Model
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;      // ISO date string
    read: boolean;      // Has the admin seen this message?
}
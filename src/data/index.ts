// src/data/index.ts
// ==============================
// FOLIO - PORTFOLIO CONTENT DATA
// ==============================

import type {
    NavLink,
    Project,
    TechItem,
    Service,
    ProcessStep,
    Stat,
    SocialLink,
} from "@/types";

// ================================================================
// PERSONAL INFO
// ================================================================

export const personalInfo = {
    name: "Temitope Israel Omoniyi",
    shortName: "Tope",
    title: "Full-Stack Developer",
    location: "Lagos, Nigeria",
    email: "omoniyitemitopeisrael@gmail.com",
    github: "https://github.com/temitope-israel",
    linkedin: "https://linkedin.com/in/omoniyitemitopeisrael",
    twitter: "https://x.com/itstopeorisrael",
    tagline: "I build things that work.",
    subTagline: "Fast. Scalable. Beautiful.",
    available: true,
    bio: [
        "I am Temitope Omoniyi - a Full-Stack Developer based in Lagos, Nigeria, with 3 years of freelance experience building fast, scalable, and beautiful web applications.",
        "My stack is React, TypeScript, Next.js, Node.js, MongoDB, and PostgreSQL — but what drives me isn't the tools, it's the craft. I care deeply about performance, clean architecture, and interfaces that feel effortless to use.",
        "When I'm not building, I'm reading — currently working through Myles Munroe. I believe the same principles of purpose and potential that apply to people apply to software.",
    ] as string[],
    resumeUrl: "/resume.pdf",
} as const;

// ====================================
// NAVIGATION LINKS
// ====================================

export const navLinks: NavLink[] = [
    { label: "About", href: "#about" },
    { label: "Stack", href: "#stack" },
    { label: "Projects", href: "#projects" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
];

// =================================================
// HERO STATS
// =================================================

export const heroStats: Stat[] = [
    { value: "3+", label: "Years Experience" },
    { value: "10+", label: "Projects Delivered" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "4", label: "Live Client Projects" },
];

// ===================================================
// PROJECTS
// ===================================================

export const projects: Project[] = [
    {
        id: "smooth-ride-motorcycles",
        title: "Smooth Ride Motorcycles",
        tagline: "Customer Profiling Application",
        description: "A full-stack web application for registering and managing Smooth Ride Motorcycle customers with barcode scanning, admin roles, and analytics.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Next.js", "MongoDB"],
        category: "fullstack",
        live: "https://smooth-ride-motorcycles.vercel.app/",
        github: "https://github.com/temitope-israel/smooth-ride-motorcycles",
        featured: true,
        status: "live",
        image: "/projects/smooth-ride.png",
    },
    {
        id: "website-health-check",
        title: "Website Health Check",
        tagline: "Comprehensive website performance monitoring",
        description: "A full-stack site auditing tool that scores any website and generates a downloadable, branded report.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "PostgreSQL", "Prisma", "Zod"],
        category: "fullstack",
        live: "https://webbsite-health-check.vercel.app/",
        github: "https://github.com/temitope-israel/website-health-check",
        featured: true,
        status: "live",
        image: "/projects/website-health-check.png",
    },
    {
        id: "nexus-pay",
        title: "Nexus Pay",
        tagline: "Nigerian fintech SaaS landing page",
        description: "A high-converting SaaS landing page for a Nigerian fintech product. Built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion. Features animated hero, feature cards, pricing section, and mobile-first responsive design.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn UI"],
        category: "frontend",
        live: "https://nexus-pay-eight.vercel.app/",
        github: "https://github.com/temitope-israel/nexus-pay",
        featured: false,
        status: "live",
        image: "/projects/nexus-pay.png",
    },
    {
        id: "lagonest",
        title: "LagoNest",
        tagline: "Premium Nigerian real estate platform",
        description: "A full real estate platform UI for the Nigerian market. Property listings, search and filter, property detail pages, and agent profiles. Built with React 19, TypeScript, Tailwind CSS v4, Framer Motion, and Shadcn UI.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn UI"],
        category: "frontend",
        live: "https://lagonest.vercel.app/",
        github: "https://github.com/temitope-israel/lagonest",
        featured: false,
        status: "live",
        image: "/projects/lagonest.png",
    },
    {
        id: "classyart_interior",
        title: "ClassyArt_Interior Deco",
        tagline: "Luxury Interior Design and Decoration",
        description: "A full Luxury interior design and decoration landing page. Built with React, TypeScript, Tailwind CSS v4, and Framer Motion.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        category: "frontend",
        live: "https://classyart-interior.vercel.app/",
        github: "https://github.com/temitope-israel/classyart-interior",
        featured: false,
        status: "live",
        image: "/projects/classyart-interior.png",
    },
    {
        id: "misa_limited",
        title: "MISA Limited",
        tagline: "Real Estate & Property Development",
        description: "A landing page redesign for a Lagos-based real estate and property development company, showcasing developments and services. Built with React, TypeScript, Tailwind CSS v4, and Framer Motion.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        category: "frontend",
        live: "https://misaltd.vercel.app/", // update with your actual deployed URL
        github: "https://github.com/temitope-israel/misa-redesign", // update with your actual repo
        featured: false,
        status: "live",
        image: "/projects/misa-limited.png",
    },
    {
        id: "ekklesia",
        title: "Ekklesia",
        tagline: "Church management platform",
        description: "A full-stack church management system with member records, attendance tracking, giving management, and event scheduling. Built for Nigerian church communities.",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
        category: "fullstack",
        live: "#",
        featured: false,
        status: "planned",
    },
];

// ===== =======================================
// TECH STACK
// ===== =======================================

export const techStack: TechItem[] = [
    { name: "React", category: "frontend" },
    { name: "Next.js", category: "frontend" },
    { name: "TypeScript", category: "frontend" },
    { name: "Tailwind CSS", category: "frontend" },
    { name: "Framer Motion", category: "frontend" },
    { name: "Shadcn UI", category: "frontend" },
    { name: "Vite", category: "frontend" },
    { name: "Zod", category: "frontend" },
    { name: "Node.js", category: "backend" },
    { name: "Express.js", category: "backend" },
    { name: "NestJS", category: "backend" },
    { name: "REST APIs", category: "backend" },
    { name: "Nodemailer", category: "backend" },
    { name: "JWT Auth", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "Prisma ORM", category: "database" },
    { name: "MongoDB", category: "database" },
    { name: "Redis", category: "database" },
    { name: "Git & GitHub", category: "tools" },
    { name: "Vercel", category: "tools" },
    { name: "Render", category: "tools" },
    { name: "Postman", category: "tools" },
    { name: "VS Code", category: "tools" },
    { name: "Figma", category: "tools" },
];

// ====================================================
// SERVICES
// ====================================================

export const services: Service[] = [
    {
        id: "frontend",
        icon: "Monitor",
        title: "Frontend Development",
        description: "Pixel-perfect, performant interfaces built with React and TypeScript. Every component is accessible, responsive, and animated with purpose.",
        deliverables: [
            "React 19 + TypeScript codebase",
            "Tailwind CSS v4 styling",
            "Framer Motion animations",
            "Mobile-first responsive design",
            "Vercel deployment",
        ],
    },
    {
        id: "fullstack",
        icon: "Layers",
        title: "Full-Stack Applications",
        description: "End-to-end web applications with robust backends, real databases, and production-ready architecture. From landing page to admin dashboard.",
        deliverables: [
            "React frontend + Node.js backend",
            "PostgreSQL database with Prisma",
            "REST API design and implementation",
            "Authentication and authorization",
            "Vercel + Render deployment",
        ],
    },
    {
        id: "api",
        icon: "Zap",
        title: "API Development",
        description: "Clean, documented REST APIs with proper error handling, validation, rate limiting, and security. Built with Node.js and Express or NestJS.",
        deliverables: [
            "RESTful API design",
            "Input validation with Zod",
            "JWT authentication",
            "Rate limiting and security headers",
            "Postman documentation",
        ],
    },
    {
        id: "consulting",
        icon: "MessageSquare",
        title: "Technical Consulting",
        description: "Architecture reviews, code audits, and technical strategy for early-stage startups and teams looking to move faster with fewer bugs.",
        deliverables: [
            "Codebase architecture review",
            "Performance audit and report",
            "Tech stack recommendation",
            "Refactoring roadmap",
            "1-hour follow-up session",
        ],
    },
];

// =========================================
// PROCESS STEPS
// =========================================

export const processSteps: ProcessStep[] = [
    {
        step: 1,
        title: "Discovery",
        description: "We start with a focused conversation about your goals, users, and constraints.",
    },
    {
        step: 2,
        title: "Design",
        description: "Wireframes and component architecture planned before building. I map out the user flow, define the data model, and establish the visual direction so there are no surprises mid-build.",
    },
    {
        step: 3,
        title: "Build",
        description: "Clean, typed, commented code. I build in iterations — frontend first with mock data, then wire up the backend, then integrate and test. You see progress every week.",
    },
    {
        step: 4,
        title: "Deploy",
        description: "Production deployment to Vercel and Render with environment variables, CORS, and security headers properly configured. I don't hand over broken code.",
    },
];

// ================================================
// SOCIAL LINKS
// ================================================

export const socialLinks: SocialLink[] = [
    {
        label: "GitHub",
        href: "https://github.com/temitope-israel",
        icon: "Github",
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/omoniyitemitopeisrael",
        icon: "Linkedin",
    },
    {
        label: "Email",
        href: `mailto:${personalInfo.email}`,
        icon: "Mail",
    },
];
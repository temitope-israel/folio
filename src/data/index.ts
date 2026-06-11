// src/data/index.ts
// ==============================
// FOLIO - PORTFOLIO CONTENT DATA
// ==============================

// This is the single source of truth for ALL content on the site.
// Every section component imports its data from here.
//
// Why this patterm matters:
// If content is scattered across components, updating your job title
// means hunting through 5 files. Here, you change it in ONE place
// and every other component reflects it immediately.
// ==============================================================================


// Import the TypeSCript interfaces defined in types/index.ts.
// This ensures that our data matches the expected shape exactly.
// If you add a required field to an interface but forget to add it
// here, TypeScript will show a red underline immediately.

import type {
    NavLink,
    Project,
    TechItem,
    Service,
    ProcessStep,
    Stat,
    SocialLink,

} from "@/types";

// `import type` is a TypeScript-specific syntax.
// It tells TypeScript: "I'm importing these only for type checking,
// not as runtime values."  This means they're stripped completely
// from the compiled JS - zero bundle size impact.



// ================================================================
// PERSONAL INFO
// ================================================================
// A plain object (not typed with interfaces - it's unique not repeated)
// containing core personal details used across multiple sections.

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
    // Bio is an array of strings — each string is one paragraph.
    // Using an array (instead of one long string) lets us render
    // each paragraph as a separate <p> tag in the About section.
    "I'm a Full-Stack Developer based in Lagos, Nigeria, with 3 years of freelance experience building fast, scalable, and beautiful web applications.",
    "My stack is React, Next.js, TypeScript, Node.js, and PostgreSQL — but what drives me isn't the tools, it's the craft. I care deeply about performance, clean architecture, and interfaces that feel effortless to use.",
    "When I'm not building, I'm reading — currently working through Myles Munroe. I believe the same principles of purpose and potential that apply to people apply to software.",
  ] as string[],
  resumeUrl: "/resume.pdf",
} as const;
// `as const` freezes this entire object.
// Without it: personalInfo.title has type string (any string).
// With it:    personalInfo.title has type "Full-Stack Developer" (exactly that string).
// This prevents accidental mutation and gives you the most precise types possible.



// ====================================
// NAVIGATION LINKS
// ====================================

export const navLinks: NavLink[] = [
    // NavLink[] means: "an array where every element matches the NavLink interface"
    // Each object MUST have label: string and href: string — TypeScript enforces this.

    {label: "About", href: "#about"},
    {label: "Stack", href: "#stack"},
    {label: "Projects", href: "#projects"},
    {label: "Services", href: "#services"},
    {label: "Process", href: "#process"},
    {label: "Contact", href: "#contact"},
];

// =================================================
// HERO STATS
// =================================================

export const heroStats: Stat[] = [
    {value: "3+", label: "Years Experience"},
    {value: "20+", label: "Projects Delivered"},
    {value: "100%", label: "Client Satisfaction"},
    {value: "2", label: "Live Client Projects"},
];




// ===================================================
// PROJECTS
// ===================================================


export const projects: Project[] = [
    // === REAL PROJECTS (Built and Deployed) ===
    {
        id: "nexus-pay", // Kebab-case id - lowercase, words separated by hyphens.
        // Used as React list key and for URL slugs.
        title: "Nexus Pay",
        tagline: "Nigerian fintech SaaS landing page",
        description:       "A high-converting SaaS landing page for a Nigerian fintech product. Built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion. Features animated hero, feature cards, pricing section, and mobile-first responsive design.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn UI"],
        category: "frontend",
        live: "https://nexus-pay-eight.vercel.app/",
        github: "https://github.com/temitope-israel/nexus-pay",
        featured: true, // featured: true = appears in the featured row at the top of the Projects section.
        status: "live",
    },

     {
    id: "lagonest",
    title: "LagoNest",
    tagline: "Premium Nigerian real estate platform",
    description:
      "A full real estate platform UI for the Nigerian market. Property listings, search and filter, property detail pages, and agent profiles. Built with React 19, TypeScript, Tailwind CSS v4, Framer Motion, and Shadcn UI.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn UI"],
    category: "frontend",
    live: "https://lagonest.vercel.app/",
    github: "https://github.com/temitope-israel/lagonest",
    featured: true,
    status: "live",
  },

  // === PLACEHOLDER PROJECTS (NOT YET BUILT) ===
  // This show in the grid with an "in-progress" or "planned" badge.

  {
    id: "ekklesia",
    title: "Ekklesia",
    tagline: "Church management platform",
    description:
      "A full-stack church management system with member records, attendance tracking, giving management, and event scheduling. Built for Nigerian church communities.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
    category: "fullstack",
    live: "#",
    featured: false,
    status: "planned",
  },
  {
    id: "prestige",
    title: "Prestige",
    tagline: "Luxury e-commerce storefront",
    description:
      "A premium e-commerce storefront for luxury goods, featuring product catalog, cart, checkout flow with Paystack integration, and order management.",
    tags: ["Next.js", "TypeScript", "Paystack", "Prisma", "Tailwind CSS"],
    category: "fullstack",
    live: "#",
    featured: false,
    status: "planned",
  },
  {
    id: "artisano",
    title: "Artisano",
    tagline: "Nigerian artisan marketplace",
    description:
      "A two-sided marketplace connecting Nigerian artisans with customers. Features vendor onboarding, product listings, messaging, and Flutterwave payment processing.",
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Flutterwave"],
    category: "fullstack",
    live: "#",
    featured: false,
    status: "planned",
  },
  {
    id: "pulse",
    title: "PulseBoard",
    tagline: "Real-time analytics dashboard",
    description:
      "A real-time analytics dashboard with live charts, KPI tracking, CSV export, and role-based access control. Built for business intelligence use cases.",
    tags: ["React", "Node.js", "PostgreSQL", "WebSockets", "Recharts"],
    category: "fullstack",
    live: "#",
    featured: false,
    status: "planned",
  },
]


// ===== =======================================
// TECH STACK
// ===== =======================================

export const techStack: TechItem[] = [
    // Frontend row
    {name: "React 19", category: "frontend"},
    {name: "Next.js", category: "frontend"},
    {name: "TypeScript", category: "frontend"},
    {name: "Tailwind CSS", category: "frontend"},
    {name: "Framer Motion", category: "frontend"},
    {name: "Shadcn UI", category: "frontend"},
    {name: "Vite", category: "frontend"},
    {name: "Zod", category: "frontend"},



    // Backend row
    {name: "Node.js", category: "backend"},
    {name: "Express.js", category: "backend"},
    {name: "NestJS", category: "backend"},
    {name: "REST APIs", category: "backend"},
    {name: "Nodemailer", category: "backend"},
    {name: "JWT Auth", category: "backend"},

    // Database row
    {name: "PostgreSQL", category: "database"},
    {name: "Prisma ORM", category: "database"},
    {name: "MongoDB", category: "database"},
    {name: "Redis", category: "database"},

    // Tools row
    {name: "Git & GitHub", category: "tools"},
    {name: "Vercel", category: "tools"},
    {name: "Render", category: "tools"},
    {name: "Postman", category: "tools"},
    {name: "VS Code", category: "tools"},
    {name: "Figma", category: "tools"},

]


// ====================================================
// SERVICES
// ====================================================

export const services: Service[] = [
    {
        id: "frontend",
        icon: "Monitor",
        // "Monitor is the name of a Lucide React Icon".
        // IN the Service component, we'll do: import {Monitor} from "lucide-react"
        // Storing the name as a string keeps this data file JSX free.
        title: "Frontend Development",
        description:       "Pixel-perfect, performant interfaces built with React and TypeScript. Every component is accessible, responsive, and animated with purpose.",
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
    description:
      "End-to-end web applications with robust backends, real databases, and production-ready architecture. From landing page to admin dashboard.",
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
    description:
      "Clean, documented REST APIs with proper error handling, validation, rate limiting, and security. Built with Node.js and Express or NestJS.",
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
    description:
      "Architecture reviews, code audits, and technical strategy for early-stage startups and teams looking to move faster with fewer bugs.",
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
        description: "We start with a focused conversation about your goals, users, and constraints."
    },
    {
        step: 2,
        title: "Design",
        description:       "Wireframes and component architecture planned before building. I map out the user flow, define the data model, and establish the visual direction so there are no surprises mid-build.",
    },
    {
        step: 3,
        title: "Build",
        description:       "Clean, typed, commented code. I build in iterations — frontend first with mock data, then wire up the backend, then integrate and test. You see progress every week.",

    },
    {
        step: 4,
        title: "Deploy",
        description:       "Production deployment to Vercel and Render with environment variables, CORS, and security headers properly configured. I don't hand over broken code.",

    }
];


// ================================================
// SOCIAL LINKS
// ================================================

export const socialLinks: SocialLink[] =[
    {
        label: "GitHub",
        href: "https://github.com/temitope-israel",
        icon: "Github"
    },
    {
    label: "LinkedIn",
    href: "https://linkedin.com/in/temitope-israel", // update with real URL
    icon: "Linkedin",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/temitope_dev", // update or remove
    icon: "Twitter",
  },
  {
    label: "Email",
    href: `mailto:${personalInfo.email}`,
    // Template literal: backtick strings that can embed expressions with ${}
    // This produces: "mailto:temitope@example.com"
    // If you update personalInfo.email above, this updates automatically.
    icon: "Mail",
  },
]
// prisma.ts — full Prisma 7 version

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

// Detect if running in production or connecting to Render
const isRenderHost = connectionString.includes("onrender.com");
const isProduction = process.env.NODE_ENV === "production";
const useSSL = isRenderHost || isProduction;

const adapter = new PrismaPg({
  connectionString,
  // Enable SSL only for production/Render; disable for local PostgreSQL
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

export default prisma;

// // prisma.ts — full Prisma 7 version

// import "dotenv/config";
// import { PrismaClient } from "../generated/prisma/client";
// // Generated client — Prisma 7 outputs here instead of node_modules

// import { PrismaPg } from "@prisma/adapter-pg";
// // The PostgreSQL adapter — bridges Prisma and the pg driver
// // Prisma 7 no longer bundles database drivers; you provide one via an adapter

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
//   ssl: { rejectUnauthorized: false },
//   // Reads the same DATABASE_URL from your .env
//   // "!" = TypeScript non-null assertion (we know it exists)
// });

// const prisma = new PrismaClient({
//   adapter,
//   // Pass the adapter in — Prisma uses it to talk to PostgreSQL
//   log: ["error", "warn"],
// });

// export default prisma;
// prisma.ts — full Prisma 7 version

import { PrismaClient } from "../generated/prisma/client";
// Generated client — Prisma 7 outputs here instead of node_modules

import { PrismaPg } from "@prisma/adapter-pg";
// The PostgreSQL adapter — bridges Prisma and the pg driver
// Prisma 7 no longer bundles database drivers; you provide one via an adapter

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  // Reads the same DATABASE_URL from your .env
  // "!" = TypeScript non-null assertion (we know it exists)
});

const prisma = new PrismaClient({
  adapter,
  // Pass the adapter in — Prisma uses it to talk to PostgreSQL
  log: ["error", "warn"],
});

export default prisma;
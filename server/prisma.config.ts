// prisma.config.ts


import "dotenv/config";
// Loads your .env file first — so DATABASE_URL is available below

import { defineConfig, env } from "prisma/config";
// defineConfig = helper that gives you type safety on the config object
// env = Prisma's helper to read environment variables

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Where your schema file lives

  migrations: {
    path: "prisma/migrations",
    // Where migration files get stored
  },

  datasource: {
    url: env("DATABASE_URL"),
    // This is where the database URL now lives — read from your .env
    // env() is Prisma's own env reader (works the same as process.env)
  },
});
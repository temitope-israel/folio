// vite.config.ts
// Vite is your BUILD TOOL and DEV SERVER.
// This file configures how Vite bundles your code and serves it during development.

import { defineConfig } from "vite";
// defineConfig gives you TypeScript autocomplete inside this config file.

import react from "@vitejs/plugin-react";
// This is the official Vite plugin for React.
// It enables: JSX transformation, React Fast Refresh (hot reload that preserves state),
// and automatic React imports.

import path from "path";
// Node.js built-in module for working with file paths.
// path.resolve() converts relative paths to absolute paths.

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    // Activates the React plugin. Without this, Vite wouldn't know how to handle JSX.
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // This tells VITE (the bundler) about the @ alias.
      // When Vite sees an import starting with @/, it replaces it with ./src/
      // This works in tandem with the tsconfig.json "paths" setting.
      // tsconfig → TypeScript type checking knows about @
      // vite.config → Vite bundler can actually FIND the files at runtime
    },
  },

  server: {
    port: 3000,
    // Run the dev server on port 3000 instead of Vite's default 5173.
    // So your local URL will be http://localhost:3000
  },
});
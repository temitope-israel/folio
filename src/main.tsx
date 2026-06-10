// src/main.tsx
// This is the entry point of my React App
// Vite reads this file first when it starts.

import {StrictMode} from "react";
// StrictMode is a React tool that helps catch bugs during development
// It renders components twice in dev mode to expose side effects.
// It has zero effect in production - it's dev-only.


import {createRoot} from 'react-dom/client';
// createRoot is the React 19 API for mounting app into the HTML page.
// "Mounting" means take your React components and inject them into real DOM elements.

import "./index.css";
// Imports global stylesheet

import App from "./App";
// Imports root App component from App.tsx


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>
);

// The !after getElementById is TypeScript telling the compiler:
// "Trust me - this element exists. Dont' warn me that it might be null."
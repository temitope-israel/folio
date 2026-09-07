// api.ts
// Centralizes all API calls in one place.
// Components import functions from here — they never write fetch() directly.
// If the API URL changes, you update it here, not in every component.

// Base URL for all API calls.
// import.meta.env is Vite's way of reading environment variables.
// In development: reads from .env.local in your project root (src/)
// In production: Vite replaces this at build time with the actual value
// VITE_ prefix is required — Vite only exposes variables with this prefix to the browser
// Replace this:
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// With this:
const BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";
// Fallback to localhost:4000 if the env variable isn't set yet

// ─── Types ────────────────────────────────────────────────────────────────────

// Shape of data we send to the contact endpoint
interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Shape of the response we get back from the server
interface ApiResponse {
  success: boolean;
  message?: string;   // "?" = optional — not always present
  errors?: Array<{    // validation errors array — only present on 400 responses
    field: string;
    message: string;
  }>;
}

// ─── Contact API ──────────────────────────────────────────────────────────────

export const submitContactForm = async (payload: ContactPayload): Promise<ApiResponse> => {
  // "payload" is the form data — name, email, subject, message

  const response = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    // Tell the server we're sending JSON — without this header,
    // Express's express.json() middleware won't parse the body
    headers: {
      "Content-Type": "application/json",
    },
    // JSON.stringify() converts the JS object to a JSON string
    // fetch sends strings, not objects — this conversion is required
    body: JSON.stringify(payload),
  });

  // response.ok is true when status is 200-299
  // response.ok is false for 400, 500, etc.
  // IMPORTANT: fetch does NOT throw on 4xx/5xx — you must check response.ok manually
  // This trips up everyone the first time — a 400 response does NOT go to catch

  const data: ApiResponse = await response.json();
  // Parse the response body regardless of status code —
  // we need the error details from 400 responses too

  if (!response.ok) {
    // For validation errors (400), throw with the server's message
    // For server errors (500), throw a generic message
    throw new Error(data.message || "Something went wrong");
  }

  return data;
  // Caller gets back { success: true, message: "..." }
};

// ─── Analytics API ────────────────────────────────────────────────────────────

export const recordPageVisit = async (page: string): Promise<void> => {
  try {
    await fetch(`${BASE_URL}/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page,
        // navigator.userAgent is the browser's description of itself
        // We use it to detect device type on the server side (Day 24)
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        // /Mobi|Android/i is a regex — tests if the user agent string contains
        // "Mobi" or "Android" (case insensitive due to the "i" flag)
        // If true = mobile, if false = desktop
      }),
    });
    // No error handling here — analytics is fire-and-forget.
    // If this fails, we don't want it to affect the user's experience.
  } catch {
    // Silently swallow errors — analytics failure should never break the app
  }
};
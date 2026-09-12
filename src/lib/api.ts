// api.ts
// Centralizes all API calls in one place.
// Components import functions from here — they never write fetch() directly.
// If the API URL changes, you update it here, not in every component.

const BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// ─── Contact API ──────────────────────────────────────────────────────────────

export const submitContactForm = async (payload: ContactPayload): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ─── Analytics API ────────────────────────────────────────────────────────────

export const recordPageVisit = async (page: string): Promise<void> => {
  try {
    await fetch(`${BASE_URL}/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page,
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      }),
    });
  } catch {
    // Fire and forget — never break the app for analytics
  }
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// ─── Token helpers ────────────────────────────────────────────────────────────

export const saveToken = (token: string): void => {
  localStorage.setItem("admin_token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("admin_token");
};

export const removeToken = (): void => {
  localStorage.removeItem("admin_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
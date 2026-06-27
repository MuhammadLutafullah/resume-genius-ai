import axios from "axios";

/**
 * Centralized Axios instance.
 * Base URL comes from the VITE_API_URL environment variable (your FastAPI backend).
 * When VITE_API_URL is not set, the app falls back to a local mock data layer
 * (see patientService.ts) so the UI is fully functional in preview.
 */
export const API_URL = import.meta.env.VITE_API_URL as string | undefined;
export const USE_MOCK = !API_URL;

const api = axios.create({
  baseURL: API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor — attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pms-api-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalize errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export default api;

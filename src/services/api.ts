import axios from "axios";
import { clearAuthSession, getAuthToken } from "@/services/auth/auth-storage";

// En desarrollo, usar `/api` (proxy de Vite) evita CORS.
// En producción, `VITE_API_URL` debe apuntar al backend real (ej: https://dominio.com/api).
const envBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
export const API_BASE_URL = (envBaseUrl || "http://localhost:8000/api").replace(/\/+$/, "");
const baseURL =
  import.meta.env.DEV && (!envBaseUrl || /localhost:8000\/api/i.test(envBaseUrl))
    ? "/api"
    : envBaseUrl || "/api";

export const api = axios.create({
  baseURL: baseURL.replace(/\/+$/, ""),
  timeout: 50000,
  headers: {
    Accept: "application/json",
  },
});

// Interceptor para el token
api.interceptors.request.use((config) => {
  const requestUrl = String(config.url ?? "").replace(/^\/+/, "");
  const isPublicAuthEndpoint = requestUrl === "login" || requestUrl === "register";
  const token = isPublicAuthEndpoint ? null : getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 419) {
      clearAuthSession();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

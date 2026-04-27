import axios from "axios";
import { getAuthToken } from "@/services/auth/auth-storage";

// En desarrollo, usar `/api` (proxy de Vite) evita CORS.
// En producción, `VITE_API_URL` debe apuntar al backend real (ej: https://dominio.com/api).
const envBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
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
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

import axios from "axios";
import { getAuthToken } from "@/services/auth/auth-storage";

const rawBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
// En desarrollo, usar `/api` (proxy de Vite) evita CORS.
// En producción, `VITE_API_URL` debe apuntar al backend real (ej: https://dominio.com/api).
const envBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
const baseURL =
  import.meta.env.DEV && (!envBaseUrl || /localhost:8000\/api/i.test(envBaseUrl))
    ? "/api"
    : envBaseUrl || "/api";

export const api = axios.create({
  // Limpia las barras diagonales extras al final de la URL si existen
  baseURL: rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para inyectar el token de autenticación en cada petición
api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
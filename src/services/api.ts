import axios from "axios";
import { getAuthToken } from "@/services/auth/auth-storage";

const rawBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

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
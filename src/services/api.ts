import axios from "axios";
import { getAuthToken } from "@/services/auth/auth-storage";

// La URL del backend se configura por entorno; si falta, usa el backend local.
const baseURL =  "http://localhost:8000/api";

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

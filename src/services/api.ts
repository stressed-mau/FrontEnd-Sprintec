import axios from "axios";
import { getAuthToken } from "@/services/auth/auth-storage";

// Vite usa import.meta.env. Si no existe la variable, usa el localhost de Laravel
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  // .replace limpia barras diagonales extras al final si las hay
  baseURL: baseURL.replace(/\/+$/, ""), 
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json', //borrar
    'Accept': 'application/json',
  },
});

// Interceptor para el Token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
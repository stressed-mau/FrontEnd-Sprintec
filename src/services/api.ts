import axios from "axios"

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const api = axios.create({
  baseURL: rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

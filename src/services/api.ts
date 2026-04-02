<<<<<<< HEAD
﻿import axios from "axios"

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const api = axios.create({
  baseURL: rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})
=======
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});
>>>>>>> 52d6d19f149bc1c7a2fab2942cafaf6e495bc4b3

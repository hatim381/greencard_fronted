import axios from "axios";

// Détection CRA (REACT_APP_*) ou Vite (import.meta.env)
export const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  "https://greencard-backend.onrender.com/api";

// Instance Axios dédiée à l'API
const http = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  // timeout: 15000,
});

// Ajoute automatiquement le token d'authentification à chaque requête
http.interceptors.request.use((config) => {
  const stored = localStorage.getItem("greencart_user");
  if (stored) {
    try {
      const token = JSON.parse(stored)?.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore JSON parse errors and continue without token
    }
  }
  return config;
});

// --- Auth ---
export const auth = {
  register: (data) => http.post("/auth/register", data),
  login: (data) => http.post("/auth/login", data),
};

// --- Produits ---
export const products = {
  getAll: () => http.get("/products/"),
  add: (data) => http.post("/products/", data),
  update: (id, data) => http.put(`/products/${id}`, data),
};

// --- Commandes ---
export const orders = {
  create: (data) => http.post("/orders", data),
  getByUser: (userId) => http.get(`/orders/${userId}`),
};

// --- IA ---
export const ai = {
  getRecommendations: () => http.get("/ai/recommendations"),
};

// --- Témoignages ---
export const testimonials = {
  getAll: () => http.get("/testimonials"),
};

// --- Newsletter ---
export const newsletter = {
  subscribe: (email) => http.post("/newsletter/subscribe", { email }),
};

export default { auth, products, orders, ai, testimonials, newsletter, API_URL };

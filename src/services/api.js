import axios from "axios";

// Détection CRA (REACT_APP_*) ou Vite (import.meta.env)
export const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  "https://greencard-backend.onrender.com/api";

// Instance Axios dédiée à l'API
const http = axios.create({
  baseURL: API_URL,
  // Empêche l'envoi automatique des cookies sur les requêtes cross-origin
  withCredentials: false,
  // timeout: 15000,
});

// commentaire
// Ajoute automatiquement le token d'authentification à chaque requête
http.interceptors.request.use((config) => {
  // Injecte le token si présent
  const stored = localStorage.getItem("greencart_user");
  if (stored) {
    try {
      const token = JSON.parse(stored)?.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore JSON parse errors et continue sans token
    }
  }

  // IMPORTANT : si on envoie un FormData, on supprime tout header Content-Type
  // pour laisser Axios définir le bon "multipart/form-data; boundary=..."
  if (config.data instanceof FormData && config.headers) {
    delete config.headers["Content-Type"];
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
  // On accepte une config optionnelle pour pouvoir passer des headers (ex: multipart/form-data)
  add: (data, config = {}) => http.post("/products/", data, config),
  update: (id, data, config = {}) => http.put(`/products/${id}`, data, config),
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

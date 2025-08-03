import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';
console.log("API_URL =", API_URL); // Ajoutez ceci pour vérifier la valeur en production
console.log("API_URL utilisé pour les produits :", API_URL);

export const auth = {
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
};

export const products = {
  getAll: () => axios.get(`${API_URL}/products/`),
  add: (data, config) => axios.post(`${API_URL}/products/`, data, config),
  update: (id, data, config) => axios.put(`${API_URL}/products/${id}`, data, config),
};

export const orders = {
  create: (data) => axios.post(`${API_URL}/orders`, data),
  getByUser: (userId) => axios.get(`${API_URL}/orders/${userId}`),
};

export const ai = {
  getRecommendations: () => axios.get(`${API_URL}/ai/recommendations`),
};

export const testimonials = {
  getAll: () => axios.get(`${API_URL}/testimonials`),
};

export const newsletter = {
  subscribe: (email) => axios.post(`${API_URL}/newsletter/subscribe`, { email }),
};

export const blog = {
  getAll: () => axios.get(`${API_URL}/blog`),
};

// Empêche l'import par défaut accidentel
export default undefined;

import axios from 'axios';
// axios.defaults.baseURL est configuré dans index.js

export const auth = {
  register: (data) => axios.post('/auth/register', data),
  login: (data) => axios.post('/auth/login', data),
};

export const products = {
  getAll: () => axios.get('/products/'),
  add: (data) => axios.post('/products/', data),
  update: (id, data) => axios.put(`/products/${id}`, data),
};

export const orders = {
  create: (data) => axios.post('/orders', data),
  getByUser: (userId) => axios.get(`/orders/${userId}`),
};

export const ai = {
  getRecommendations: () => axios.get('/ai/recommendations'),
};

export const testimonials = {
  getAll: () => axios.get('/testimonials'),
};

export const newsletter = {
  subscribe: (email) => axios.post('/newsletter/subscribe', { email }),
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx'; // <-- utilise App.jsx

// Configure axios to use the deployed backend and attach auth tokens
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';
// Ne jamais envoyer automatiquement des cookies afin d'éviter les erreurs CORS
axios.defaults.withCredentials = false;
axios.interceptors.request.use((config) => {
  const stored = localStorage.getItem('greencart_user');
  if (stored) {
    try {
      const token = JSON.parse(stored)?.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore JSON parse errors and send request without token
    }
  }
  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

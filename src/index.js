import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';

// Configure axios to use the deployed backend and send cookies
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

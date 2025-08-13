import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

// Centralised user authentication management
export default function useUser() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('greencart_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('greencart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('greencart_user');
    }
  }, [user]);

  const login = async (credentials) => {
    const res = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
    if (res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await axios.post(`${API_URL}/auth/register`, data, { withCredentials: true });
    if (res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || 'Register failed');
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch {
      // ignore error on logout
    }
    setUser(null);
  };

  return { user, setUser, login, register, logout };
}

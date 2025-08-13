import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';
const cache = new Map();

// Fetch products list with very small cache and simple pagination
export default function useProducts(page = 1) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    const key = `page-${page}`;
    if (cache.has(key)) {
      setData(cache.get(key));
      setLoading(false);
      return () => {};
    }
    setLoading(true);
    axios
      .get(`${API_URL}/products`, { params: { page } })
      .then((res) => {
        if (!ignore) {
          const payload = { items: res.data || [], total: res.data?.length || 0 };
          cache.set(key, payload);
          setData(payload);
        }
      })
      .catch(() => !ignore && setError('Erreur lors du chargement des produits'))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [page]);

  return { ...data, loading, error };
}

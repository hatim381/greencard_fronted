import { useEffect, useState } from 'react';

// Manage shopping cart with localStorage persistence
export default function useCart() {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('greencart_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('greencart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product?.id) return;
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  return { cart, addToCart, removeFromCart, clearCart };
}

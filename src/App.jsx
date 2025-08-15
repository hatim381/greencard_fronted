import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import useDeviceDetection from './hooks/useDeviceDetection';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './components/Cart';
import Blog from './pages/Blog';
import About from './pages/About';
import Producers from './pages/Producers';
import Impact from './pages/Impact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Legal from './pages/Legal';
import Cookies from './pages/Cookies';
import Accessibilite from './pages/Accessibilite';
import PlanDuSite from './pages/PlanDuSite';
import Faq from './pages/Faq';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

function App() {
  const { isMobile } = useDeviceDetection();
  const [user, setUser] = useState(() => {
    // Persistance utilisateur (optionnel)
    const stored = localStorage.getItem('greencart_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('greencart_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('greencart_darkmode') === 'true';
  });

  // Fonction utilitaire pour recharger le user depuis l'API
  const fetchUserFromAPI = async (userObj) => {
    if (!userObj) return null;
    try {
      const res = await axios.get(`${API_URL}/auth/users`);
      const updated = res.data.find(u => u.id === userObj.id);
      if (updated) {
        setUser(updated);
        localStorage.setItem('greencart_user', JSON.stringify(updated));
        return updated;
      }
    } catch {
      // ignore
    }
    return userObj;
  };

  // Recharge le user à jour au montage si présent dans le localStorage
  useEffect(() => {
    if (user && user.id) {
      fetchUserFromAPI(user);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem('greencart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('greencart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('greencart_user');
    }
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('greencart_darkmode', darkMode);
  }, [darkMode]);

  const handleLogin = async (u) => {
    // Recharge le user à jour depuis l'API après login
    const updated = await fetchUserFromAPI(u);
    setUser(updated);
  };
  const handleRegister = async (u) => {
    // Recharge le user à jour depuis l'API après inscription
    const updated = await fetchUserFromAPI(u);
    setUser(updated);
  };
  const handleLogout = () => {
    setUser(null);
    // Redirection vers l'accueil après déconnexion
    window.location.href = '/';
  };
  const handleAddToCart = (product) => {
    if (!product.id) return;
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  return (
    <Router>
      <Navbar
        user={user}
        onLogout={handleLogout}
        cartCount={user && user.role === 'consumer' ? cart.reduce((sum, i) => sum + i.quantity, 0) : 0}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(dm => !dm)}
      />
      <Routes>
        <Route path="/" element={
          <Home
            user={user}
            onAddToCart={user && user.role === 'consumer' ? handleAddToCart : undefined}
          />
        } />
        <Route path="/products" element={
          <ProductList
            onAddToCart={user && user.role === 'consumer' ? handleAddToCart : undefined}
            user={user}
          />
        } />
        <Route path="/dashboard" element={
          user ? (
            <Dashboard user={user} setUser={(u) => {
              setUser(u);
              if (u) {
                localStorage.setItem('greencart_user', JSON.stringify(u));
              } else {
                localStorage.removeItem('greencart_user');
              }
            }} />
          ) : (
            <main style={{ textAlign: 'center', marginTop: '3em' }}>
              <div style={{
                display: 'inline-block',
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 8px #22C55E22',
                padding: '2em 3em'
              }}>
                <h2 style={{ color: '#e11d48' }}>Accès refusé</h2>
                <p>Vous devez être connecté pour accéder au tableau de bord.</p>
              </div>
            </main>
          )
        } />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/cart" element={
          user && user.role === 'consumer' ? (
            <Cart
              cart={cart}
              onRemove={handleRemoveFromCart}
              onClear={handleClearCart}
              user={user}
            />
          ) : (
            <main style={{ textAlign: 'center', marginTop: '3em' }}>
              <div style={{
                display: 'inline-block',
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 8px #22C55E22',
                padding: '2em 3em'
              }}>
                <h2 style={{ color: '#e11d48' }}>Accès refusé</h2>
                <p>Vous devez être connecté en tant que consommateur pour accéder au panier.</p>
              </div>
            </main>
          )
        } />
        <Route path="/blog" element={<Blog />} />
        <Route path="/apropos" element={<About />} />
        <Route path="/producteurs" element={<Producers />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/conditions-generales" element={<Terms />} />
        <Route path="/confidentialite" element={<Privacy />} />
        <Route path="/mentions-legales" element={<Legal />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/accessibilite" element={<Accessibilite />} />
        <Route path="/plan-du-site" element={<PlanDuSite />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;




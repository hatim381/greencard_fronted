import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = ({ user }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: 'Accueil' },
    { path: '/products', icon: '🛒', label: 'Produits' },
    { path: user ? '/dashboard' : '/login', icon: user ? '👤' : '🔐', label: user ? 'Profil' : 'Connexion' },
    { path: '/about', icon: 'ℹ️', label: 'À propos' }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '1px solid #E5E7EB',
      padding: '0.5rem 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#22C55E' : '#6B7280',
              fontSize: '0.75rem',
              fontWeight: location.pathname === item.path ? '600' : '400',
              padding: '0.25rem',
              transition: 'color 0.2s'
            }}
          >
            <span style={{ fontSize: '1.2rem', marginBottom: '0.125rem' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

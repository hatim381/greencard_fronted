import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

// Carte producteur (simple et clean)
const ProducerCard = ({ producer }) => {
  const initial = producer?.name?.trim()?.charAt(0)?.toUpperCase() || '?';
  const address = producer?.default_address || 'Adresse non renseignée';

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        boxShadow: '0 2px 8px #0001',
        padding: 16,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#ECFDF5',
          color: '#059669',
          fontWeight: 800,
          display: 'grid',
          placeItems: 'center',
          fontSize: 22,
          flexShrink: 0,
          border: '1px solid #D1FAE5',
        }}
      >
        {initial}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>
          {producer?.name || 'Producteur'}
        </div>
        <div
          style={{
            fontSize: 13.5,
            color: '#374151',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={address}
        >
          {address}
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>
          {producer?.email}
        </div>
      </div>
    </div>
  );
};

const Home = ({ user }) => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/users`)
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data.filter((u) => (u.role || '').toLowerCase() === 'producer')
          : [];
        setProducers(list);
      })
      .catch(() => setError("Erreur lors du chargement des producteurs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <img src="/Images/logo.jpeg" alt="GreenCart" className="hero-logo" />
          <h1 className="hero-title">Nos producteurs partenaires</h1>
          <p className="hero-sub">
            Découvrez les producteurs inscrits sur GreenCart et leurs invendus disponibles.
          </p>

          <div className="cta-group">
            <Link to="/products" className="btn-green">Voir les produits</Link>
            {user?.role === 'producer' && (
              <Link to="/products?add=1" className="btn-outline-green">Vendre mes invendus</Link>
            )}
          </div>
        </div>
      </section>

      {/* LISTE DES PRODUCTEURS */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>
              Producteurs inscrits
            </h2>
            <div className="text-muted" style={{ fontWeight: 600 }}>
              {loading ? '—' : `${producers.length} producteur${producers.length > 1 ? 's' : ''}`}
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', color: '#059669', padding: '24px 0' }}>
              Chargement…
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', color: '#DC2626', padding: '24px 0' }}>
              {error}
            </div>
          )}

          {!loading && !error && producers.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#374151',
                background: '#fff',
                border: '1px dashed #CBD5E1',
                padding: 22,
                borderRadius: 12,
              }}
            >
              Aucun producteur n’est inscrit pour le moment.
            </div>
          )}

          {!loading && !error && producers.length > 0 && (
            <div className="producers-grid">
              {producers.map((p) => (
                <ProducerCard key={p.id} producer={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

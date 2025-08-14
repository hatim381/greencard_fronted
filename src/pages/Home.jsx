import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const SkeletonCard = () => (
  <div className="card skeleton">
    <div className="skeleton-avatar" />
    <div className="skeleton-line w-70" />
    <div className="skeleton-line w-90" />
    <div className="skeleton-line w-45" />
  </div>
);

// Remplace ce composant dans Home.jsx
const ProducerCard = ({ producer }) => {
  const name =
    producer?.name ? producer.name.charAt(0).toUpperCase() + producer.name.slice(1) : "Producteur";
  const address = producer?.default_address?.trim() || "Adresse non renseignée";

  return (
    <div className="card producer-card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div className="producer-content" style={{ minWidth: 0 }}>
        <div className="card-title">{name}</div>
        <div className="card-sub" title={address} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="chip chip-soft">📍</span>
          <span className="truncate">{address}</span>
        </div>
        <div className="card-email" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="chip chip-soft">✉️</span>
          {producer?.email || "—"}
        </div>
      </div>
    </div>
  );
};


const Home = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/auth/users`)
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data.filter(u => (u.role || '').toLowerCase() === 'producer')
          : [];
        list.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
        setProducers(list);
      })
      .catch(() => setError("Erreur lors du chargement des producteurs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Nos producteurs partenaires</h1>
          <p className="hero-sub">
            Découvrez les producteurs inscrits sur GreenCart et leurs invendus disponibles.
          </p>
          <div className="cta-group">
            <Link to="/products" className="btn btn-primary">Voir tous les produits</Link>
          </div>
        </div>
      </section>

      {/* LISTE DES PRODUCTEURS */}
      <section className="section">
        <div className="container">
          <div className="producers-header">
            <h2 className="section-title">Producteurs inscrits</h2>
            <div className="text-muted count">
              {loading ? '—' : `${producers.length} producteur${producers.length > 1 ? 's' : ''}`}
            </div>
          </div>

          {error && (
            <div className="alert-error">😕 {error}</div>
          )}

          {loading && (
            <div className="producers-grid">
              {Array.from({length: 6}).map((_,i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && !error && producers.length === 0 && (
            <div className="empty">Aucun producteur n’est inscrit pour le moment.</div>
          )}

          {!loading && !error && producers.length > 0 && (
            <div className="producers-grid">
              {producers.map(p => <ProducerCard key={p.id} producer={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;

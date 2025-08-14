import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const ProducerCard = ({ producer }) => {
  const initial = producer?.name?.trim()?.charAt(0)?.toUpperCase() || '?';
  const address = producer?.default_address || 'Adresse non renseignée';

  return (
    <div className="card hstack" style={{ gap: 14 }}>
      <div className="avatar">{initial}</div>
      <div className="vstack" style={{ gap: 2, flex: 1, minWidth: 0 }}>
        <div className="title">{producer?.name || 'Producteur'}</div>
        <div className="line" title={address}>{address}</div>
        <div className="email">{producer?.email}</div>
      </div>
      {/* Lien pour voir ses produits (facultatif) */}
      <Link
        to={`/products?producer_id=${producer?.id}`}
        className="btn btn-outline"
        style={{ whiteSpace:'nowrap' }}
      >
        Voir ses produits
      </Link>
    </div>
  );
};

const Home = ({ user }) => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/auth/users`)
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data.filter(u => (u.role || '').toLowerCase() === 'producer')
          : [];
        // tri alpha pour un rendu propre
        list.sort((a,b) => (a.name||'').localeCompare(b.name||''));
        setProducers(list);
      })
      .catch(() => setError("Erreur lors du chargement des producteurs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <img src="/Images/logo.jpeg" alt="GreenCart" className="hero-logo" />
          <h1 className="hero-title">Nos producteurs partenaires</h1>
          <p className="hero-sub">
            Découvrez les producteurs inscrits sur GreenCart et leurs invendus disponibles.
          </p>

          <div className="cta-group">
            <Link to="/products" className="btn btn-primary">Voir les produits</Link>
            {user?.role === 'producer' && (
              <Link to="/products?add=1" className="btn btn-outline">Vendre mes invendus</Link>
            )}
          </div>
        </div>
      </section>

      {/* LISTE DES PRODUCTEURS */}
      <section className="section">
        <div className="container">
          <div className="producers-header">
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
            <div className="empty">Aucun producteur n’est inscrit pour le moment.</div>
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

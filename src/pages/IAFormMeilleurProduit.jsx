import React, { useState } from 'react';
import axios from 'axios';
import Meta from '../components/Meta';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const categories = ["Produits laitiers", "Légumes", "Fruits", "Boulangerie"];

export default function IAFormMeilleurProduit() {
  const [categorie, setCategorie] = useState(categories[0]);
  const [mois, setMois] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.get(
        `${API_URL}/ai/meilleur_produit?categorie=${encodeURIComponent(categorie)}&mois=${mois}`
      );
      setResult(res.data.meilleur_produit);
    } catch (err) {
      setError("Erreur lors de la recherche du meilleur produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Meta title="GreenCart – IA Meilleur produit" />
      <h4 style={{ color: '#16A34A', marginBottom: 12 }}>Trouver le meilleur produit</h4>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: window.innerWidth < 500 ? 'column' : 'row',
        width: "100%"
      }}>
        <select value={categorie} onChange={e => setCategorie(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <input type="number" min={1} max={12} value={mois} onChange={e => setMois(Number(e.target.value))} style={{ width: 70 }} />
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Recherche..." : "Trouver"}</button>
      </form>
      {result && (
        <div style={{ marginTop: 14, color: '#22C55E', fontWeight: 700 }}>Meilleur produit : {result}</div>
      )}
      {error && <div style={{ color: '#e11d48', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

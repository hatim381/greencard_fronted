import React, { useState } from 'react';
import axios from 'axios';
import Meta from '../components/Meta';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const categories = ["Produits laitiers", "Légumes", "Fruits", "Boulangerie"];
const regions = ["Grand Est", "Nouvelle-Aquitaine", "Bourgogne-Franche-Comté", "Pays de la Loire", "Hauts-de-France", "Auvergne-Rhône-Alpes", "Occitanie", "Provence-Alpes-Côte d'Azur", "Normandie"];

export default function IAFormPredictGoodSale() {
  const [form, setForm] = useState({
    produit: '',
    categorie: categories[0],
    mois: 1
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'mois' ? Number(value) : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      // N'envoie que produit, categorie, mois
      const dataToSend = {
        produit: form.produit,
        categorie: form.categorie,
        mois: form.mois
      };
      const user = JSON.parse(localStorage.getItem('greencart_user'));
      const token = user?.token;
      const res = await axios.post(
        `${API_URL}/ai/predict_good_sale`,
        dataToSend,
        token ? { headers: { Authorization: 'Bearer ' + token } } : {}
      );
      setResult(res.data.good_sale);
    } catch (err) {
      setError("Erreur lors de la prédiction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <Meta title="GreenCart – IA Prévision ventes" />
      <h4 style={{ color: '#16A34A', marginBottom: 12 }}>Prédire une bonne vente</h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <input
          name="produit"
          type="text"
          placeholder="Nom du produit"
          value={form.produit}
          onChange={handleChange}
          required
          style={{ width: 180 }}
        />
        <select name="categorie" value={form.categorie} onChange={handleChange}>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <input type="number" name="mois" min={1} max={12} value={form.mois} onChange={handleChange} style={{ width: 70 }} />
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Prédiction..." : "Prédire"}</button>
      </form>
      {result !== null && (
        <div style={{ marginTop: 14, color: '#22C55E', fontWeight: 700 }}>
          {result === 1 ? "✅ Bonne vente probable" : result === 0 ? "❌ Vente difficile probable" : null}
        </div>
      )}
      {error && <div style={{ color: '#e11d48', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

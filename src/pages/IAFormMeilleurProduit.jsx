import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const categories = ["Produits laitiers", "Légumes", "Fruits", "Boulangerie"];

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const categories = ["Produits laitiers", "Légumes", "Fruits", "Boulangerie"];

// Mapping des mois
const mois = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" }
];

export default function IAFormMeilleurProduit() {
  const [form, setForm] = useState({
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
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const user = JSON.parse(localStorage.getItem('greencart_user'));
      const token = user?.token;
      const res = await axios.post(
        `${API_URL}/ai/best_product`,
        form,
        token ? { headers: { Authorization: 'Bearer ' + token } } : {}
      );
      setResult(res.data.best_product);
    } catch (err) {
      setError("Erreur lors de la recherche du meilleur produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)",
      borderRadius: "16px",
      padding: "2rem",
      border: "2px solid #fbbf24",
      marginBottom: "2rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Image IA en arrière-plan */}
      <div style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        width: "80px",
        height: "80px",
        borderRadius: "12px",
        overflow: "hidden",
        opacity: 0.8,
        boxShadow: "0 4px 12px rgba(251, 191, 36, 0.2)"
      }}>
        <img
          src="/Images/IA.jpeg"
          alt="Intelligence Artificielle"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </div>

      {/* Header avec icône */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.5rem"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
        }}>
          🏆
        </div>
        <h4 style={{ 
          color: "#92400e", 
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "700"
        }}>
          Trouver le meilleur produit
        </h4>
      </div>

      <p style={{
        color: "#92400e",
        marginBottom: "1.5rem",
        fontSize: "0.95rem",
        opacity: 0.8
      }}>
        Découvrez les produits les plus performants par catégorie et saison grâce à l'IA
      </p>

      <form onSubmit={handleSubmit} style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: "1rem",
        alignItems: "end",
        marginBottom: "1rem"
      }}>
        {/* Catégorie */}
        <div>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "#92400e",
            marginBottom: "0.5rem"
          }}>
            📂 Catégorie
          </label>
          <select
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #fbbf24",
              borderRadius: "8px",
              fontSize: "0.9rem",
              background: "white",
              cursor: "pointer"
            }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Mois */}
        <div>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "#92400e",
            marginBottom: "0.5rem"
          }}>
            📅 Mois
          </label>
          <select
            name="mois"
            value={form.mois}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #fbbf24",
              borderRadius: "8px",
              fontSize: "0.9rem",
              background: "white",
              cursor: "pointer"
            }}
          >
            {mois.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "linear-gradient(135deg, #9ca3af, #6b7280)" : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(245, 158, 11, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)";
            }
          }}
        >
          {loading ? "🔍 Recherche..." : "🎯 Analyser"}
        </button>
      </form>

      {/* Résultat */}
      {result && (
        <div style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
        }}>
          <div style={{
            fontSize: "1.2rem",
            fontWeight: "700",
            marginBottom: "0.5rem"
          }}>
            🥇 Produit recommandé
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "800",
            textTransform: "capitalize",
            letterSpacing: "0.5px"
          }}>
            {result}
          </div>
          <div style={{
            fontSize: "0.9rem",
            opacity: 0.9,
            marginTop: "0.5rem"
          }}>
            Basé sur les données de performance saisonnière
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
          color: "#dc2626",
          borderRadius: "8px",
          border: "2px solid #fecaca",
          fontSize: "0.9rem"
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

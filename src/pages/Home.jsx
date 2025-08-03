import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as productsApi, ai } from '../services/api';

const categories = [
  { label: 'Tous les produits', value: '' },
  { label: 'Fruits & légumes', value: 'Fruits & légumes' },
  { label: 'Produits laitiers', value: 'Produits laitiers' },
  { label: 'Viandes & Volaille', value: 'Viandes & Volaille' },
  { label: 'Boulangerie', value: 'Boulangerie' },
  { label: 'Boissons', value: 'Boissons' }
];

const Home = ({ user, onAddToCart }) => {
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    productsApi.getAll()
      .then(res => {
        console.log("✅ Produits récupérés :", res.data);
        if (!Array.isArray(res.data)) {
          throw new Error("La réponse API n'est pas un tableau.");
        }
        setAllProducts(res.data);
      })
      .catch((err) => {
        // Affichez l'erreur complète pour diagnostic
        if (err.response) {
          console.error("❌ Erreur produits :", err.response.status, err.response.data);
          setErrorProducts("Erreur lors du chargement des produits : " + (err.response.data?.error || err.response.statusText || err.message));
        } else {
          console.error("❌ Erreur produits :", err);
          setErrorProducts("Erreur lors du chargement des produits : " + (err.message || "Erreur inconnue"));
        }
      })
      .finally(() => setLoadingProducts(false));

    ai.getRecommendations()
      .then(res => setRecommendations(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }
    let filtered = allProducts;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    setDisplayedProducts(filtered.slice(0, 4));
  }, [allProducts, selectedCategory]);

  return (
    <div>
      {/* 🔍 Pour diagnostic : voir les produits en brut */}
      <pre style={{ background: "#f0f0f0", padding: "1rem", marginBottom: "1rem" }}>
        {JSON.stringify(allProducts, null, 2)}
      </pre>

      {/* 🌟 Exemple d'affichage simplifié */}
      <section style={{ padding: "2rem" }}>
        <h2>Produits populaires</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {loadingProducts ? (
            <p>Chargement en cours...</p>
          ) : errorProducts ? (
            <p style={{ color: "red" }}>{errorProducts}</p>
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map(p => (
              <div key={p.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: 8, width: 200 }}>
                <h4>{p.name}</h4>
                <p>Prix : {p.price} €</p>
                <p>Quantité : {p.quantity}</p>
                <button
                  onClick={() =>
                    onAddToCart && user && user.role === 'consumer'
                      ? onAddToCart(p)
                      : window.location.href = '/login'
                  }
                >
                  Ajouter au panier
                </button>
              </div>
            ))
          ) : (
            <p>Aucun produit disponible.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProducerProductForm from '../components/ProducerProductForm';
import useDeviceDetection from '../hooks/useDeviceDetection';

// Définir l'URL de base de l'API à partir des variables d'environnement
const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const categories = [
  { label: 'Tous les produits', value: '' },
  { label: 'Fruits & légumes', value: 'Fruits & légumes' },
  { label: 'Produits laitiers', value: 'Produits laitiers' },
  { label: 'Viandes & Volaille', value: 'Viandes & Volaille' },
  { label: 'Boulangerie', value: 'Boulangerie' },
  { label: 'Boissons', value: 'Boissons' }
];

const ProductList = ({ onAddToCart, user }) => {
  const { isMobile } = useDeviceDetection();
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fonction utilitaire pour savoir si un produit est périmé
  function isExpired(product) {
    if (!product.dlc) return false;
    const today = new Date();
    const dlcDate = new Date(product.dlc);
    return dlcDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  useEffect(() => {
    // Modification de l'appel API pour inclure l'URL complète
    axios.get(`${API_URL}/products`)
      .then(res => {
        if (user && user.role === 'producer') {
          const filteredProducts = res.data.filter(p => p.producer_id === user.id);
          setItems(filteredProducts);
          setAllItems(filteredProducts);
        } else {
          const filteredProducts = res.data.filter(p => p.quantity > 0 && !isExpired(p));
          setItems(filteredProducts);
          setAllItems(filteredProducts);
        }
      })
      .catch(() => setError("Erreur lors du chargement des produits"))
      .finally(() => setLoading(false));
  }, [user]);

  // Effect pour filtrer par catégorie
  useEffect(() => {
    if (!selectedCategory) {
      setItems(allItems);
    } else {
      setItems(allItems.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, allItems]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setShowForm(false);
    setEditProduct(null);
    if (refresh) {
      setLoading(true);
      // Modification de l'appel API pour inclure l'URL complète
      axios.get(`${API_URL}/products`)
        .then(res => {
          if (user && user.role === 'producer') {
            const filteredProducts = res.data.filter(p => p.producer_id === user.id);
            setItems(filteredProducts);
            setAllItems(filteredProducts);
          } else {
            const filteredProducts = res.data.filter(p => p.quantity > 0 && !isExpired(p));
            setItems(filteredProducts);
            setAllItems(filteredProducts);
          }
        })
        .catch(() => setError("Erreur lors du chargement des produits"))
        .finally(() => setLoading(false));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '2em 0' }}>Chargement…</div>;
  if (error) return <div style={{ textAlign: 'center', margin: '2em 0', color: '#e11d48' }}>{error}</div>;

  // Séparation des produits actifs et épuisés/périmés pour le producteur
  let activeProducts = items;
  let soldOrExpired = [];
  if (user && user.role === 'producer') {
    activeProducts = items.filter(p => p.quantity > 0 && !isExpired(p));
    soldOrExpired = items.filter(p => p.quantity === 0 || isExpired(p));
  }

  return (
    <main>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        {user && user.role === 'producer' ? "Mes produits" : "Nos produits"}
      </h2>
      {user && user.role === 'producer' && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Ajouter un produit
          </button>
        </div>
      )}

      {/* Filtres par catégorie - uniquement pour les consommateurs et visiteurs */}
      {(!user || user.role === 'consumer') && (
        <section style={{ 
          background: "#fff", 
          borderRadius: 16, 
          maxWidth: 1200, 
          margin: "0 auto", 
          padding: isMobile ? "1.5rem 1rem" : "2rem 2rem", 
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <div style={{ 
            textAlign: "center", 
            color: "#22C55E", 
            fontWeight: 600, 
            fontSize: "0.95em", 
            letterSpacing: 1, 
            marginBottom: 4 
          }}>
            FILTRER PAR CATÉGORIE
          </div>
          
          {/* Version Desktop */}
          {!isMobile && (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 8, 
              flexWrap: "wrap", 
              margin: "1.2rem 0 1.5rem 0" 
            }}>
              {categories.map(cat => (
                <button
                  key={cat.label}
                  className="category-pill"
                  style={{
                    background: selectedCategory === cat.value ? "#22C55E" : "#F3F4F6",
                    color: selectedCategory === cat.value ? "#fff" : "#22C55E",
                    border: "1px solid #22C55E",
                    fontWeight: 500,
                    padding: "0.45em 1.5em",
                    borderRadius: 20,
                    fontSize: "1em",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setSelectedCategory(cat.value)}
                  onMouseOver={e => {
                    if (selectedCategory !== cat.value) {
                      e.target.style.background = "#E5F7ED";
                    }
                  }}
                  onMouseOut={e => {
                    if (selectedCategory !== cat.value) {
                      e.target.style.background = "#F3F4F6";
                    }
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Version Mobile */}
          {isMobile && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)", 
              gap: 8, 
              margin: "1.2rem 0 1.5rem 0" 
            }}>
              {categories.map(cat => (
                <button
                  key={cat.label}
                  className="category-pill"
                  style={{
                    background: selectedCategory === cat.value ? "#22C55E" : "#F3F4F6",
                    color: selectedCategory === cat.value ? "#fff" : "#22C55E",
                    border: "1px solid #22C55E",
                    fontWeight: 500,
                    padding: "0.6em 1em",
                    borderRadius: 15,
                    fontSize: "0.9em",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "center"
                  }}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ 
            color: "#888", 
            fontSize: "1em", 
            textAlign: "center",
            marginTop: "1rem"
          }}>
            {items.length > 1
              ? `${items.length} produits disponibles`
              : items.length === 1
                ? "1 produit disponible"
                : "Aucun produit disponible"}
          </div>
        </section>
      )}
      {/* Liste des produits actifs */}
      <div
        className="product-list"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile 
            ? "repeat(auto-fit, minmax(280px, 1fr))" 
            : "repeat(auto-fit, minmax(340px, 1fr))",
          gap: isMobile ? 20 : 32,
          margin: "0 auto",
          maxWidth: 1200,
          padding: isMobile ? "0 1rem" : "0",
        }}
      >
        {activeProducts.map(p => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 18px #22C55E11",
              overflow: "hidden",
              border: "1.5px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              minHeight: isMobile ? 350 : 370,
              position: "relative",
              transition: "box-shadow 0.18s, transform 0.13s",
            }}
          >
            <div style={{ position: "relative" }}>
              {(() => {
                let img = p.image_url || p.image;
                if (img && !img.startsWith('http') && img.startsWith('/uploads/')) {
                  img = `${API_URL.replace('/api', '')}${img}`;
                }
                if (!img) img = '/placeholder.jpg';
                return (
                  <img
                    src={img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: isMobile ? 160 : 180,
                      objectFit: "cover",
                      background: "#f3f3f3",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  />
                );
              })()}
              {(p.co2_reduction || p.co2) && (
                <span style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  background: "#22C55E",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "4px 14px",
                  boxShadow: "0 2px 8px #22C55E33",
                  letterSpacing: 0.5,
                }}>
                  {p.co2_reduction || p.co2}%
                </span>
              )}
            </div>
            <div style={{
              padding: isMobile ? "1.1em 1em 0.7em 1em" : "1.3em 1.2em 0.7em 1.2em",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: isMobile ? "1.1em" : "1.18em", 
                  marginBottom: 6 
                }}>{p.name}</div>
                <div style={{ 
                  color: "#22C55E", 
                  fontWeight: 700, 
                  fontSize: isMobile ? "1.08em" : "1.13em", 
                  marginBottom: 2 
                }}>
                  {p.price} <span style={{ fontWeight: 400, color: "#222" }}>{p.price && p.price.toString().endsWith('kg') ? "" : "€"}</span>
                </div>
                {p.dlc && (
                  <div style={{ fontSize: "1em", color: "#888", marginBottom: 8 }}>
                    DLC : {typeof p.dlc === "string" ? p.dlc.split("T")[0] : p.dlc}
                  </div>
                )}
                {p.description && (
                  <div style={{ fontSize: "0.98em", color: "#666", marginBottom: 8 }}>
                    {p.description}
                  </div>
                )}
                <div style={{ fontSize: "0.97em", color: "#16A34A", fontWeight: 600, marginBottom: 6 }}>
                  {p.quantity > 1
                    ? `${p.quantity} exemplaires disponibles`
                    : p.quantity === 1
                      ? "1 exemplaire disponible"
                      : "Rupture de stock"}
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  marginTop: 16,
                  background: "#22C55E",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.08em",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px #22C55E22",
                  letterSpacing: 0.5,
                  transition: "background 0.18s, transform 0.13s",
                }}
                onClick={onAddToCart ? () => onAddToCart(p) : undefined}
                disabled={!onAddToCart}
              >
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Section produits vendus ou périmés */}
      {user && user.role === 'producer' && soldOrExpired.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ color: "#888", marginBottom: 16 }}>Produits vendus ou périmés</h3>
          <div className="product-list" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            opacity: 0.7
          }}>
            {soldOrExpired.map(p => (
              <div key={p.id} style={{ position: "relative" }}>
                <ProductCard
                  product={p}
                  onEdit={() => handleEdit(p)}
                />
                <div style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: isExpired(p) ? "#e11d48" : "#f59e42",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "2px 10px",
                  fontWeight: 700,
                  fontSize: 13
                }}>
                  {isExpired(p)
                    ? "Périmé"
                    : "Épuisé / Vendu"}
                </div>
                <button
                  className="btn btn-outline-green"
                  style={{ marginTop: 10, width: "100%" }}
                  onClick={() => handleEdit(p)}
                >
                  Remettre en vente / Modifier
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      {showForm && user && user.role === 'producer' && (
        <ProducerProductForm
          user={user}
          product={editProduct}
          onClose={handleFormClose}
        />
      )}
    </main>
  );
};

export default ProductList;

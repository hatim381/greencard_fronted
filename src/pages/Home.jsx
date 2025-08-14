import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "https://greencard-backend.onrender.com/api";

/* ---------- UI: petits composants ---------- */

const SkeletonProducer = () => (
  <div className="card producer-card skeleton">
    <div className="avatar" />
    <div className="producer-content">
      <div className="skeleton-line w-70" />
      <div className="skeleton-line w-90" />
      <div className="skeleton-line w-45" />
    </div>
  </div>
);

const SkeletonProduct = () => (
  <div className="card product-card skeleton">
    <div className="product-thumb skeleton-box" />
    <div className="skeleton-line w-80" />
    <div className="skeleton-line w-60" />
    <div className="skeleton-line w-40" />
  </div>
);

const ProducerCard = ({ producer }) => {
  const name = producer?.name
    ? producer.name.charAt(0).toUpperCase() + producer.name.slice(1)
    : "Producteur";
  const address = producer?.default_address?.trim() || "Adresse non renseignée";

  return (
    <div className="card producer-card">
      {/* avatar circulaire propre (pas une simple lettre qui traine) */}
      <div className="avatar">{name?.charAt(0) || "?"}</div>

      <div className="producer-content">
        <div className="card-title">{name}</div>
        <div className="card-sub" title={address}>
          <span className="chip chip-soft">📍</span>
          <span className="truncate">{address}</span>
        </div>
        <div className="card-email">
          <span className="chip chip-soft">✉️</span>
          {producer?.email || "—"}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ p, onAddToCart, user }) => {
  // image absolute si /uploads
  let img = p.image_url || p.image;
  if (img && !img.startsWith("http") && img.startsWith("/uploads/")) {
    img = `${API_URL.replace("/api", "")}${img}`;
  }
  if (!img) img = "/placeholder.jpg";

  const isNumber = (v) => typeof v === "number" || /^\d+([.,]\d+)?$/.test(String(v));
  const price =
    p?.price != null
      ? `${p.price}${isNumber(p.price) ? " €" : ""}`
      : "—";
  const dlc = p?.dlc ? (typeof p.dlc === "string" ? p.dlc.split("T")[0] : p.dlc) : null;

  return (
    <div className="card product-card">
      <div className="product-thumb-wrap">
        <img src={img} alt={p.name} className="product-thumb" />
        {p?.co2_reduction ? <span className="badge badge-green">-{p.co2_reduction}% CO₂</span> : null}
      </div>

      <div className="product-body">
        <div className="product-title truncate">{p.name}</div>

        <div className="product-price">{price}</div>

        {p.description && <div className="product-desc truncate-2">{p.description}</div>}

        <div className="product-meta">
          {dlc && <span className="badge">DLC : {dlc}</span>}
          {p.status && <span className="badge badge-soft">{p.status}</span>}
          {typeof p.quantity === "number" && (
            <span className="badge badge-soft">
              {p.quantity > 1 ? `${p.quantity} dispo` : p.quantity === 1 ? "1 dispo" : "Rupture"}
            </span>
          )}
        </div>

        {user?.role === "consumer" && onAddToCart && (
          <button className="btn btn-primary w-full" onClick={() => onAddToCart(p)}>
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------- Page Home ---------- */

const Home = ({ user, onAddToCart }) => {
  const [producers, setProducers] = useState([]);
  const [pLoading, setPLoading] = useState(true);
  const [pError, setPError] = useState("");

  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState("");

  // Charge producteurs (réels)
  useEffect(() => {
    axios
      .get(`${API_URL}/auth/users`)
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data.filter((u) => (u.role || "").toLowerCase() === "producer")
          : [];
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        setProducers(list);
      })
      .catch(() => setPError("Erreur lors du chargement des producteurs"))
      .finally(() => setPLoading(false));
  }, []);

  // Charge derniers produits (réels)
  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        const today = new Date();
        const inStock = (res.data || []).filter((it) => {
          if (it.quantity <= 0) return false;
          if (it.dlc) {
            const d = new Date(it.dlc);
            // on ne montre pas les périmés
            if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false;
          }
          return true;
        });
        // Si created_at dispo → tri récents
        inStock.sort((a, b) => {
          const da = a.created_at ? new Date(a.created_at).getTime() : 0;
          const db = b.created_at ? new Date(b.created_at).getTime() : 0;
          return db - da;
        });
        setProducts(inStock.slice(0, 8));
      })
      .catch(() => setProdError("Erreur lors du chargement des produits"))
      .finally(() => setProdLoading(false));
  }, []);

  return (
    <main>
      {/* HERO propre, sans logo (le logo est dans la navbar) */}
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

      {/* Derniers produits (réels) */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Derniers produits</h2>
            {!prodLoading && !prodError && (
              <Link to="/products" className="link">Tout voir</Link>
            )}
          </div>

          {prodError && <div className="alert-error">😕 {prodError}</div>}

          {prodLoading ? (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonProduct key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty">Aucun produit disponible pour le moment.</div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} user={user} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Producteurs (réels) */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Producteurs inscrits</h2>
            <div className="text-muted">
              {pLoading ? "—" : `${producers.length} producteur${producers.length > 1 ? "s" : ""}`}
            </div>
          </div>

          {pError && <div className="alert-error">😕 {pError}</div>}

          {pLoading ? (
            <div className="producers-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonProducer key={i} />)}
            </div>
          ) : producers.length === 0 ? (
            <div className="empty">Aucun producteur n’est inscrit pour le moment.</div>
          ) : (
            <div className="producers-grid">
              {producers.map((pr) => <ProducerCard key={pr.id} producer={pr} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;

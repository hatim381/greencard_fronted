import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const categories = [
  { label: 'Tous les produits', value: '' },
  { label: 'Fruits & légumes', value: 'Fruits & légumes' },
  { label: 'Produits laitiers', value: 'Produits laitiers' },
  { label: 'Viandes & Volaille', value: 'Viandes & Volaille' },
  { label: 'Boulangerie', value: 'Boulangerie' },
  { label: 'Boissons', value: 'Boissons' }
];

const testimonials = [
  {
    name: 'Marie D.',
    rating: 5,
    text: 'Je fais mes courses sur GreenCart depuis 6 mois et j’ai fais de belles économies tout en découvrant des producteurs près de chez moi. Le système de notification pour les produits à DLC courte est génial !'
  },
  {
    name: 'Pierre L.',
    rating: 5,
    text: 'En tant que petit producteur, GreenCart m’a permis d’écouler mes surplus sans effort. Les outils de prévision des ventes sont très utiles pour planifier mes prochaines récoltes.'
  },
  {
    name: 'Sophie T.',
    rating: 4,
    text: 'J’adore voir l’impact concret de chaque achat. Cela me motive à continuer à consommer local et à éviter le gaspillage. Les produits sont toujours au rendez-vous, souvent meilleurs qu’en grande surface !'
  }
];

const producerCards = [
  {
    icon: "📦",
    title: "Vendez vos invendus",
    text: "Transformez vos surplus et invendus en revenus supplémentaires sans effort de commercialisation."
  },
  {
    icon: "📊",
    title: "Tableaux de bord intelligents",
    text: "Accédez à des analyses prédictives pour anticiper la demande et optimiser votre production."
  },
  {
    icon: "👥",
    title: "Segmentations clients",
    text: "Découvrez les profils de vos clients et personnalisez vos recommandations pour augmenter vos ventes."
  }
];

const impactCards = [
  {
    icon: "🌱",
    title: "Réduction CO2",
    text: "En moyenne, nos produits génèrent 45% moins d’émissions de CO2 que les circuits traditionnels."
  },
  {
    icon: "🥕",
    title: "Gaspillage évité",
    text: "Plus de 8 tonnes de nourriture sauvées du gaspillage chaque mois grâce à notre plateforme."
  },
  {
    icon: "💶",
    title: "Revenus supplémentaires",
    text: "Nos producteurs augmentent jusqu’à 15% de revenu en plus grâce à la valorisation de leurs invendus."
  }
];

const Home = ({ user, onAddToCart }) => {
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState('');
  // Pour recommandations IA (optionnel)
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Récupère les produits disponibles (quantité > 0 et non périmés)
    axios.get(`${API_URL}/products`)
      .then(res => {
        const today = new Date();
        const filtered = res.data.filter(p => {
          if (p.quantity <= 0) return false;
          if (p.dlc) {
            const dlcDate = new Date(p.dlc);
            if (dlcDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false;
          }
          return true;
        });
        setAllProducts(filtered);
      })
      .catch(() => setErrorProducts("Erreur lors du chargement des produits"))
      .finally(() => setLoadingProducts(false));

    // Pour recommandations IA (optionnel)
    axios.get(`${API_URL}/ai/recommendations`)
      .then(res => setRecommendations(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Filtre selon la catégorie sélectionnée
    let filtered = allProducts || [];
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    setProducts(filtered.slice(0, 4));
  }, [allProducts, selectedCategory]);

  return (
    <div style={{ background: "#F8FAFB" }}>
      {/* Hero */}
            {/* Section Hero */}
      <section className="hero text-center py-20" style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', color: '#1F2937' }}>
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-green-600">GreenCart</span>
            <br />
            <span className="text-lg md:text-xl font-normal text-gray-600 mt-2 block">
              Commerce équitable et circuits courts
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Découvrez une nouvelle façon de consommer : 
            <strong> des produits frais et locaux</strong> directement chez les producteurs de votre région.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products" className="btn btn-primary text-lg px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              🛒 Découvrir nos produits
            </Link>
            <Link to="/producers" className="btn btn-secondary text-lg px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
              🌱 Nos producteurs
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories + produits populaires */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-green-600 font-semibold text-sm tracking-wide uppercase mb-2">
              NOS CATÉGORIES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Trouvez ce qui vous plaît
            </h2>
          </div>

          {/* Filtres par catégorie */}
          <div className="category-pills-container">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`category-pill ${selectedCategory === category.value ? 'active' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end mb-6">
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Tri : Pertinence</option>
              <option>Prix : Croissant</option>
              <option>Prix : Décroissant</option>
              <option>Nouveautés</option>
            </select>
          </div>

          <div className="font-semibold mb-6 text-lg text-gray-800">Produits populaires</div>

          {/* Grille de produits */}
          <div className="responsive-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="product-card-responsive animate-in">
                <div className="product-image-container">
                  <img
                    src={`${API_URL.replace('/api', '')}/uploads/${product.image || 'default-product.jpg'}`}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/Images/prod1.png';
                    }}
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">{product.price} €</p>
                  <p className="product-description">{product.description}</p>
                  <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-primary text-lg px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>
        <div style={{ color: "#888", fontSize: "1em", marginBottom: 10 }}>
          {products.length > 1
            ? `${products.length} produits disponibles`
            : products.length === 1
              ? "1 produit disponible"
              : "Aucun produit disponible"}
        </div>
        {loadingProducts ? (
          <div style={{ textAlign: "center", color: "#22C55E", margin: "2em 0" }}>Chargement…</div>
        ) : errorProducts ? (
          <div style={{ textAlign: "center", color: "#e11d48", margin: "2em 0" }}>{errorProducts}</div>
        ) : products.length > 0 ? (
          <div className="responsive-grid" style={{ gap: "clamp(12px, 3vw, 18px)" }}>
            {products.map((p, i) => (
              <div key={i} style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
                padding: 0,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ position: "relative" }}>
                  {(() => {
                    let img = p.image_url || p.image;
                    if (img && !img.startsWith('http') && img.startsWith('/uploads/')) {
                      img = `${API_URL.replace('/api', '')}${img}`;
                    }
                    if (!img) img = '/placeholder.jpg';
                    return (
                      <img src={img} alt={p.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                    );
                  })()}
                  {(p.co2_reduction || p.co2) && (
                    <span style={{
                      position: "absolute", top: 10, left: 10, background: "#22C55E", color: "#fff",
                      borderRadius: 6, fontSize: 13, fontWeight: 600, padding: "2px 10px"
                    }}>{p.co2_reduction || p.co2}%</span>
                  )}
                </div>
                <div style={{ padding: "1.1em 1em 1em 1em", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.08em", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ color: "#22C55E", fontWeight: 600, fontSize: "1.05em" }}>
                    {p.price} <span style={{ fontWeight: 400, color: "#222" }}>{p.price && p.price.toString().endsWith('kg') ? "" : "€"}</span>
                  </div>
                  <div style={{ fontSize: "0.98em", color: "#666", marginBottom: 2 }}>{p.description}</div>
                  {p.dlc && <div style={{ fontSize: "0.95em", color: "#888", marginBottom: 8 }}>DLC : {typeof p.dlc === "string" ? p.dlc.split("T")[0] : p.dlc}</div>}
                  {p.status && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      <span style={{
                        background: p.status === "Invendu" ? "#DCFCE7" : "#F0FDF4",
                        color: "#22C55E",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 13,
                        padding: "2px 10px"
                      }}>{p.status}</span>
                    </div>
                  )}
                  <div style={{ fontSize: "0.97em", color: "#16A34A", fontWeight: 600, marginBottom: 6 }}>
                    {p.quantity > 1
                      ? `${p.quantity} exemplaires disponibles`
                      : p.quantity === 1
                        ? "1 exemplaire disponible"
                        : "Rupture de stock"}
                  </div>
                  <button
                    className="btn btn-white"
                    style={{ border: "1px solid #22C55E", color: "#22C55E", fontWeight: 600, marginTop: "auto" }}
                    onClick={() => onAddToCart && user && user.role === 'consumer' ? onAddToCart(p) : window.location.href = '/login'}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Si pas de produits, affiche les recommandations IA si dispo
          recommendations.length > 0 ? (
            <div style={{ textAlign: "center", color: "#22C55E", margin: "2em 0" }}>
              Suggestions IA :<br />
              <ul style={{ display: "inline-block", textAlign: "left" }}>
                {recommendations.slice(0, 4).map((r, i) => (
                  <li key={i}>{r.name || r}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#888", margin: "2em 0" }}>Aucun produit disponible pour le moment.</div>
          )
        )}
        <div style={{ textAlign: "center", marginTop: 22 }}>
          <Link to="/products" className="btn btn-outline-green" style={{ minWidth: 220, border: "1px solid #22C55E", color: "#22C55E" }}>Voir plus de produits</Link>
        </div>
      </section>

      {/* Mission */}
      <section className="responsive-flex tablet-stack" style={{ 
        gap: "clamp(2rem, 5vw, 3rem)", 
        alignItems: "center", 
        background: "#fff", 
        borderRadius: 16, 
        maxWidth: 1200, 
        margin: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, auto)", 
        padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)", 
        marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" 
      }}>
        <img 
          src="/Images/prod3.png" 
          alt="Producteur" 
          className="mobile-full-width"
          style={{ 
            width: "clamp(280px, 40vw, 320px)", 
            height: "clamp(300px, 45vw, 380px)", 
            objectFit: "cover", 
            borderRadius: 14, 
            boxShadow: "0 2px 8px #0001",
            flexShrink: 0
          }} 
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="responsive-subtitle" style={{ marginTop: 0 }}>Notre mission</h2>
          <div className="responsive-text" style={{ color: "#444", marginBottom: 18 }}>
            GreenCart est née d’une conviction simple : il est possible de mieux consommer tout en soutenant les producteurs locaux et en luttant contre le gaspillage alimentaire.
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <span style={{ color: "#22C55E", fontSize: 22, marginTop: 2 }}>✔️</span>
              <div>
                <b style={{ color: "#22C55E" }}>Circuit court</b><br />
                Nous mettons directement en relation les consommateurs avec les producteurs de leur région, réduisant ainsi les intermédiaires et les kilomètres parcourus.
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <span style={{ color: "#22C55E", fontSize: 22, marginTop: 2 }}>✔️</span>
              <div>
                <b style={{ color: "#22C55E" }}>Anti-gaspillage</b><br />
                Nous valorisons les invendus et les surplus de production qui seraient autrement jetés, donnant une seconde vie dans votre assiette.
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ color: "#22C55E", fontSize: 22, marginTop: 2 }}>✔️</span>
              <div>
                <b style={{ color: "#22C55E" }}>Technologie responsable</b><br />
                Nous utilisons l’IA pour optimiser les ventes des producteurs tout en minimisant notre empreinte numérique.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Producteurs */}
      <section style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", marginBottom: "2.5rem" }}>
        <h2 style={{ marginBottom: 8 }}>Pour les producteurs</h2>
        <div style={{ color: "#444", marginBottom: 28 }}>
          Rejoignez notre réseau de producteurs engagés et bénéficiez d’outils modernes pour développer votre activité.
        </div>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginBottom: 28 }}>
          {producerCards.map((c, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
              padding: "1.5em 1em",
              minWidth: 220,
              maxWidth: 300,
              flex: "1 1 220px",
              textAlign: "left"
            }}>
              <div style={{ fontSize: 28, color: "#22C55E", marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
              <div style={{ color: "#444", fontSize: "0.98em" }}>{c.text}</div>
            </div>
          ))}
        </div>
        <Link to="/register?role=producer" className="btn btn-outline-green" style={{ border: "1px solid #22C55E", color: "#22C55E", minWidth: 260 }}>Inscrivez-vous en tant que producteur</Link>
      </section>

      {/* Impact */}
      <section style={{ background: "#22C55E", color: "#fff", padding: "3rem 0", textAlign: "center", marginBottom: "2.5rem" }}>
        <h2 style={{ marginBottom: 8 }}>Votre impact</h2>
        <div style={{ marginBottom: 28 }}>Chaque achat sur GreenCart contribue à un système alimentaire plus durable.</div>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginBottom: 32 }}>
          {impactCards.map((c, i) => (
            <div key={i} style={{ minWidth: 220 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: "0.98em" }}>{c.text}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-white" style={{ color: "#22C55E", border: "1px solid #fff", minWidth: 220 }}>Calculer mon impact</button>
      </section>

      {/* Témoignages */}
      <section style={{ maxWidth: 1200, margin: "0 auto", marginBottom: "2.5rem" }}>
        <div style={{ textAlign: "center", color: "#22C55E", fontWeight: 600, fontSize: "0.95em", letterSpacing: 1, marginBottom: 4 }}>TÉMOIGNAGES</div>
        <h2 style={{ textAlign: "center", marginBottom: 18 }}>Ce que disent nos clients</h2>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
              padding: "1.2em 1em",
              minWidth: 220,
              maxWidth: 320,
              flex: "1 1 220px"
            }}>
              <div style={{ fontWeight: 600 }}>{t.name}</div>
              <div style={{ color: "#fbbf24", fontSize: "1.1em", margin: "0.2em 0" }}>
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <div style={{ fontSize: "0.98em", color: "#444" }}>{t.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

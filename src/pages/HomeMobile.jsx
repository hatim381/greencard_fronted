import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const categories = [
  { label: 'Tous', value: '' },
  { label: 'Fruits & légumes', value: 'Fruits & légumes' },
  { label: 'Produits laitiers', value: 'Produits laitiers' },
  { label: 'Viandes', value: 'Viandes & Volaille' },
  { label: 'Boulangerie', value: 'Boulangerie' },
  { label: 'Boissons', value: 'Boissons' }
];

const testimonials = [
  {
    name: 'Marie D.',
    rating: 5,
    text: 'Je fais mes courses sur GreenCart depuis 6 mois et j\'ai fais de belles économies !'
  },
  {
    name: 'Pierre L.',
    rating: 5,
    text: 'En tant que producteur, GreenCart m\'a permis d\'écouler mes surplus sans effort.'
  },
  {
    name: 'Sophie T.',
    rating: 4,
    text: 'J\'adore voir l\'impact concret de chaque achat. Cela me motive à continuer !'
  }
];

const impactCards = [
  {
    icon: "🌱",
    title: "45% moins de CO2",
    text: "Circuits courts"
  },
  {
    icon: "🥕",
    title: "8 tonnes sauvées",
    text: "Chaque mois"
  },
  {
    icon: "💶",
    title: "+15% revenus",
    text: "Pour producteurs"
  }
];

const HomeMobile = ({ user, onAddToCart }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    let filtered = allProducts || [];
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    setProducts(filtered.slice(0, 6));
  }, [allProducts, selectedCategory]);

  return (
    <div style={{ 
      background: "#F8FAFB", 
      minHeight: "100vh",
      paddingBottom: "80px" // Space for bottom nav
    }}>
      {/* Hero Mobile */}
      <section style={{ 
        background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", 
        color: "#fff", 
        padding: "2rem 1rem 1.5rem 1rem", 
        textAlign: "center",
        borderRadius: "0 0 20px 20px"
      }}>
        <img 
          src="/Images/logo.jpeg" 
          alt="GreenCart" 
          style={{ 
            height: 80, 
            marginBottom: 12, 
            borderRadius: 12, 
            background: "#F0FDF4" 
          }} 
        />
        <h1 style={{ 
          fontSize: "1.5rem", 
          fontWeight: 700, 
          margin: "0 0 0.5rem 0",
          lineHeight: 1.3
        }}>
          Mangez local,<br />luttez contre le gaspillage
        </h1>
        <p style={{ 
          fontSize: "0.9rem", 
          margin: "0.5rem 0 1.5rem 0",
          opacity: 0.9
        }}>
          Produits locaux à prix réduits
        </p>
        <Link
          to="/products"
          style={{
            background: "#fff",
            color: "#22C55E",
            fontWeight: 700,
            fontSize: "1rem",
            border: "none",
            borderRadius: 25,
            padding: "0.8rem 2rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span>🛒</span>
          Découvrir
        </Link>
      </section>

      {/* Categories Mobile */}
      <section style={{ padding: "1rem" }}>
        <div style={{ 
          fontSize: "0.8rem", 
          color: "#22C55E", 
          fontWeight: 600, 
          letterSpacing: 1, 
          marginBottom: 8,
          textAlign: "center"
        }}>
          CATÉGORIES
        </div>
        <div style={{ 
          display: "flex", 
          overflowX: "auto", 
          gap: 8, 
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}>
          {categories.map(cat => (
            <button
              key={cat.label}
              style={{
                background: selectedCategory === cat.value ? "#22C55E" : "#fff",
                color: selectedCategory === cat.value ? "#fff" : "#22C55E",
                border: "1px solid #22C55E",
                fontWeight: 500,
                padding: "0.4rem 1rem",
                borderRadius: 20,
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                minWidth: "fit-content"
              }}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products Mobile */}
      <section style={{ padding: "0 1rem 1rem 1rem" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 12 
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: "1.1rem", 
            fontWeight: 600 
          }}>
            Produits populaires
          </h3>
          <Link 
            to="/products" 
            style={{ 
              color: "#22C55E", 
              fontSize: "0.85rem", 
              textDecoration: "none",
              fontWeight: 500
            }}
          >
            Voir tout →
          </Link>
        </div>
        
        {loadingProducts ? (
          <div style={{ textAlign: "center", color: "#22C55E", padding: "2rem 0" }}>
            Chargement…
          </div>
        ) : errorProducts ? (
          <div style={{ textAlign: "center", color: "#e11d48", padding: "2rem 0" }}>
            {errorProducts}
          </div>
        ) : products.length > 0 ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: 12 
          }}>
            {products.map((p, i) => (
              <div key={i} style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                overflow: "hidden",
                border: "1px solid #E5E7EB"
              }}>
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
                          height: 100, 
                          objectFit: "cover" 
                        }} 
                      />
                    );
                  })()}
                  {(p.co2_reduction || p.co2) && (
                    <span style={{
                      position: "absolute", 
                      top: 6, 
                      left: 6, 
                      background: "#22C55E", 
                      color: "#fff",
                      borderRadius: 4, 
                      fontSize: 10, 
                      fontWeight: 600, 
                      padding: "2px 6px"
                    }}>
                      {p.co2_reduction || p.co2}%
                    </span>
                  )}
                </div>
                <div style={{ padding: "0.8rem 0.6rem" }}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: "0.9rem", 
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {p.name}
                  </div>
                  <div style={{ 
                    color: "#22C55E", 
                    fontWeight: 600, 
                    fontSize: "0.95rem",
                    marginBottom: 4
                  }}>
                    {p.price} {!p.price?.toString().endsWith('kg') && "€"}
                  </div>
                  <div style={{ 
                    fontSize: "0.75rem", 
                    color: "#16A34A", 
                    fontWeight: 500,
                    marginBottom: 8
                  }}>
                    {p.quantity > 1 ? `${p.quantity} disponibles` : "Dernier exemplaire"}
                  </div>
                  <button
                    style={{
                      width: "100%",
                      background: "#22C55E",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                    onClick={() => onAddToCart && user && user.role === 'consumer' ? onAddToCart(p) : window.location.href = '/login'}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#888", padding: "2rem 0" }}>
            Aucun produit disponible
          </div>
        )}
      </section>

      {/* Mission Mobile */}
      <section style={{ 
        background: "#fff", 
        margin: "1rem", 
        borderRadius: 16, 
        padding: "1.5rem 1rem" 
      }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img 
            src="/Images/prod3.png" 
            alt="Producteur" 
            style={{ 
              width: "100%", 
              maxWidth: 200, 
              height: 120, 
              objectFit: "cover", 
              borderRadius: 12,
              marginBottom: 12
            }} 
          />
          <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Notre mission</h3>
        </div>
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 12 
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 10 
          }}>
            <span style={{ 
              color: "#22C55E", 
              fontSize: 18, 
              marginTop: 2 
            }}>✔️</span>
            <div>
              <div style={{ 
                fontWeight: 600, 
                color: "#22C55E", 
                fontSize: "0.9rem" 
              }}>
                Circuit court
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#666", 
                lineHeight: 1.4 
              }}>
                Direct producteur-consommateur
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 10 
          }}>
            <span style={{ 
              color: "#22C55E", 
              fontSize: 18, 
              marginTop: 2 
            }}>✔️</span>
            <div>
              <div style={{ 
                fontWeight: 600, 
                color: "#22C55E", 
                fontSize: "0.9rem" 
              }}>
                Anti-gaspillage
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#666", 
                lineHeight: 1.4 
              }}>
                Valorisation des invendus
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 10 
          }}>
            <span style={{ 
              color: "#22C55E", 
              fontSize: 18, 
              marginTop: 2 
            }}>✔️</span>
            <div>
              <div style={{ 
                fontWeight: 600, 
                color: "#22C55E", 
                fontSize: "0.9rem" 
              }}>
                IA responsable
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#666", 
                lineHeight: 1.4 
              }}>
                Optimisation intelligente
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Mobile */}
      <section style={{ 
        background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", 
        color: "#fff", 
        margin: "1rem", 
        borderRadius: 16, 
        padding: "1.5rem 1rem",
        textAlign: "center"
      }}>
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem" }}>Votre impact</h3>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 16 
        }}>
          {impactCards.map((c, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "1rem",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
              <div style={{ 
                fontWeight: 600, 
                fontSize: "0.95rem", 
                marginBottom: 2 
              }}>
                {c.title}
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                {c.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Mobile */}
      <section style={{ padding: "1rem" }}>
        <div style={{ 
          fontSize: "0.8rem", 
          color: "#22C55E", 
          fontWeight: 600, 
          letterSpacing: 1, 
          marginBottom: 8,
          textAlign: "center"
        }}>
          TÉMOIGNAGES
        </div>
        <h3 style={{ 
          textAlign: "center", 
          margin: "0 0 1rem 0", 
          fontSize: "1.2rem" 
        }}>
          Ils nous font confiance
        </h3>
        
        <div style={{ 
          display: "flex", 
          overflowX: "auto", 
          gap: 12, 
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: "1rem",
              minWidth: 250,
              maxWidth: 280
            }}>
              <div style={{ 
                fontWeight: 600, 
                fontSize: "0.9rem",
                marginBottom: 4
              }}>
                {t.name}
              </div>
              <div style={{ 
                color: "#fbbf24", 
                fontSize: "0.9rem", 
                marginBottom: 8 
              }}>
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#444", 
                lineHeight: 1.4 
              }}>
                {t.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section style={{ 
        padding: "1rem", 
        textAlign: "center", 
        marginBottom: "1rem" 
      }}>
        <Link
          to="/register"
          style={{
            background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            borderRadius: 25,
            padding: "0.8rem 2rem",
            boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span>📝</span>
          Rejoindre GreenCart
        </Link>
      </section>
    </div>
  );
};

export default HomeMobile;

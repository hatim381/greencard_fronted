import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useDeviceDetection from '../hooks/useDeviceDetection';

const Navbar = ({ cartCount, user, onLogout, darkMode, onToggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isMobile } = useDeviceDetection();

  // Style pour les liens de navigation avec effet actif
  const navLinkStyle = (path) => ({
    color: location.pathname === path ? "#FFFFFF" : (darkMode ? "#E0E7FF" : "#1F2937"),
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "25px",
    fontWeight: 600,
    fontSize: "0.95rem",
    position: "relative",
    background: location.pathname === path 
      ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
      : "transparent",
    boxShadow: location.pathname === path 
      ? "0 4px 15px rgba(34, 197, 94, 0.4)"
      : "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "inline-block",
    transform: location.pathname === path ? "translateY(-1px)" : "translateY(0)",
  });

  // Style pour les boutons d'action
  const actionButtonStyle = {
    background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  };

  return (
    <>
      {/* CSS embarqué pour les animations */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .nav-link:hover {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%) !important;
          color: #16A34A !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 25px rgba(34, 197, 94, 0.25) !important;
        }

        .action-btn:hover {
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 8px 30px rgba(34, 197, 94, 0.3) !important;
          background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%) !important;
          color: white !important;
        }

        .action-btn:hover .icon {
          animation: pulse 1s infinite;
        }

        .mobile-menu-btn {
          display: none;
        }

        .nav-backdrop {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(34, 197, 94, 0.1);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: -100%;
          width: 280px;
          height: 100vh;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          padding: 20px;
          overflow-y: auto;
        }

        .mobile-menu.open {
          left: 0;
        }

        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(34, 197, 94, 0.1);
          padding: 8px 0;
          z-index: 1000;
          display: none;
        }

        .mobile-bottom-nav.show {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          text-decoration: none;
          color: #6B7280;
          transition: all 0.2s ease;
          border-radius: 12px;
          min-width: 60px;
          position: relative;
        }

        .bottom-nav-item.active {
          color: #22C55E;
          background: rgba(34, 197, 94, 0.1);
        }

        .bottom-nav-item:hover {
          color: #22C55E;
          background: rgba(34, 197, 94, 0.05);
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }
          
          .nav-links {
            display: none;
          }
          
          .nav-actions-desktop {
            display: none;
          }

          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>

      <nav style={{
        background: darkMode 
          ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        padding: isMobile ? "12px 16px" : "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        borderBottom: "1px solid rgba(34, 197, 94, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        minHeight: isMobile ? "60px" : "80px",
        animation: "slideIn 0.6s ease-out"
      }}>
        
        {/* Version Mobile */}
        {isMobile ? (
          <>
            {/* Header mobile avec hamburger et logo */}
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {/* Menu hamburger à gauche */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: "transparent",
                  border: "none",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#22C55E"
                }}
                aria-label="Menu"
              >
                <span style={{ fontSize: "24px" }}>
                  {menuOpen ? "✕" : "☰"}
                </span>
              </button>

              {/* Logo centré */}
              <Link to="/" style={{ 
                display: "flex", 
                alignItems: "center", 
                textDecoration: "none",
                margin: "0 auto"
              }}>
                <img
                  src="/Images/logo.jpeg"
                  alt="GreenCart"
                  style={{
                    height: 35,
                    borderRadius: "8px",
                    marginRight: "8px"
                  }}
                />
                <span style={{
                  color: "#22C55E",
                  fontWeight: 700,
                  fontSize: "1.1rem"
                }}>
                  GreenCart
                </span>
              </Link>

              {/* Espace vide à droite pour équilibrer */}
              <div style={{ width: "40px" }}></div>
            </div>

            {/* Menu mobile overlay */}
            <div 
              className={`mobile-overlay${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu mobile coulissant - Avec connexion/déconnexion */}
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "30px",
                paddingBottom: "20px",
                borderBottom: "1px solid rgba(34, 197, 94, 0.2)"
              }}>
                <img
                  src="/Images/logo.jpeg"
                  alt="GreenCart"
                  style={{
                    height: 40,
                    borderRadius: "10px",
                    marginRight: "12px"
                  }}
                />
                <span style={{
                  color: "#22C55E",
                  fontWeight: 800,
                  fontSize: "1.2rem"
                }}>
                  GreenCart
                </span>
              </div>

              {/* Info utilisateur */}
              {user && (
                <div style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "12px",
                  padding: "15px",
                  marginBottom: "20px",
                  border: "1px solid rgba(34, 197, 94, 0.2)"
                }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "8px" 
                  }}>
                    <span style={{ fontSize: "18px", marginRight: "10px" }}>👋</span>
                    <span style={{ fontWeight: 600, color: "#22C55E" }}>
                      Bonjour {user.username || user.email}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#666",
                    textTransform: "capitalize" 
                  }}>
                    {user.role === 'consumer' ? 'Consommateur' : 
                     user.role === 'producer' ? 'Producteur' : 'Administrateur'}
                  </div>
                </div>
              )}

              {/* Navigation mobile */}
              {[
                { path: "/apropos", label: "À propos", icon: "💡" },
                { path: "/producteurs", label: "Producteurs", icon: "👨‍🌾" },
                { path: "/impact", label: "Impact", icon: "🌍" },
                { path: "/blog", label: "Conseils", icon: "📚" }
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px 20px",
                    textDecoration: "none",
                    color: location.pathname === item.path ? "#22C55E" : "#374151",
                    backgroundColor: location.pathname === item.path ? "rgba(34, 197, 94, 0.1)" : "transparent",
                    borderRadius: "12px",
                    marginBottom: "8px",
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ marginRight: "12px", fontSize: "18px" }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}

              {user && user.role === 'owner' && (
                <Link 
                  to="/admin" 
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px 20px",
                    textDecoration: "none",
                    color: location.pathname === "/admin" ? "#EF4444" : "#374151",
                    backgroundColor: location.pathname === "/admin" ? "rgba(239, 68, 68, 0.1)" : "transparent",
                    borderRadius: "12px",
                    marginBottom: "8px",
                    fontWeight: location.pathname === "/admin" ? 600 : 500
                  }}
                >
                  <span style={{ marginRight: "12px", fontSize: "18px" }}>⚙️</span>
                  Admin
                </Link>
              )}

              {/* Actions utilisateur mobile */}
              <div style={{ 
                marginTop: "auto", 
                paddingTop: "20px",
                borderTop: "1px solid rgba(34, 197, 94, 0.2)"
              }}>
                {user ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setMenuOpen(false);
                      window.location.href = '/';
                    }}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "1rem",
                      padding: "15px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <span>🚪</span>
                    Se déconnecter
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        padding: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxSizing: "border-box"
                      }}
                    >
                      <span>🔑</span>
                      Se connecter
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        width: "100%",
                        background: "#fff",
                        color: "#22C55E",
                        textDecoration: "none",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        padding: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        border: "2px solid #22C55E",
                        boxSizing: "border-box"
                      }}
                    >
                      <span>📝</span>
                      Créer un compte
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Version Desktop - Inchangée */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <div style={{
                  background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                  borderRadius: "20px",
                  padding: "12px",
                  boxShadow: "0 8px 30px rgba(34, 197, 94, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <img
                    src="/Images/logo.jpeg"
                    alt="GreenCart"
                    style={{
                      height: 40,
                      borderRadius: "12px",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "rotate(5deg) scale(1.1)"}
                    onMouseLeave={(e) => e.target.style.transform = "rotate(0deg) scale(1)"}
                  />
                  <span style={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    letterSpacing: "-0.5px"
                  }}>
                    GreenCart
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="nav-links" style={{
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}>
              {[
                { path: "/", label: "Accueil", icon: "🏠" },
                { path: "/products", label: "Produits", icon: "🌱" },
                { path: "/apropos", label: "À propos", icon: "💡" },
                { path: "/producteurs", label: "Producteurs", icon: "👨‍🌾" },
                { path: "/impact", label: "Impact", icon: "🌍" },
                { path: "/blog", label: "Conseils", icon: "📚" }
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className="nav-link"
                  style={navLinkStyle(item.path)}
                >
                  <span style={{ marginRight: "6px" }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              
              {user && user.role === 'owner' && (
                <Link 
                  to="/admin" 
                  className="nav-link"
                  style={{
                    ...navLinkStyle("/admin"),
                    background: location.pathname === "/admin" 
                      ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                      : "transparent",
                    boxShadow: location.pathname === "/admin" 
                      ? "0 4px 15px rgba(239, 68, 68, 0.4)"
                      : "none"
                  }}
                >
                  <span style={{ marginRight: "6px" }}>⚙️</span>
                  Admin
                </Link>
              )}
            </div>

            {/* Action Buttons Desktop */}
            <div className="nav-actions-desktop" style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              {/* Panier */}
              {(!user || user.role === 'consumer') && (
                <Link 
                  to="/cart" 
                  className="action-btn"
                  style={{
                    ...actionButtonStyle,
                    position: "relative"
                  }}
                >
                  <span className="icon" style={{ fontSize: "20px", color: "#22C55E" }}>🛒</span>
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: '#fff',
                      borderRadius: '50%',
                      fontSize: "12px",
                      fontWeight: 700,
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: "2px solid #fff",
                      boxShadow: "0 2px 10px rgba(239, 68, 68, 0.5)",
                      animation: "pulse 2s infinite"
                    }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Dashboard */}
              <Link 
                to="/dashboard" 
                className="action-btn"
                style={actionButtonStyle}
              >
                <span className="icon" style={{ fontSize: "20px", color: "#22C55E" }}>👤</span>
              </Link>

              {/* Connexion/Déconnexion */}
              {user ? (
                <button
                  className="action-btn"
                  onClick={() => {
                    onLogout();
                    window.location.href = '/';
                  }}
                  style={{
                    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "25px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    padding: "12px 24px",
                    boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    letterSpacing: "0.5px",
                    height: "48px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 30px rgba(239, 68, 68, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 20px rgba(239, 68, 68, 0.3)";
                  }}
                >
                  <span style={{ marginRight: "8px" }}>🚪</span>
                  Déconnexion
                </button>
              ) : (
                <Link
                  to="/login"
                  style={{
                    background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "25px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    padding: "12px 24px",
                    boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    letterSpacing: "0.5px",
                    display: "flex",
                    alignItems: "center",
                    height: "48px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 30px rgba(34, 197, 94, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 20px rgba(34, 197, 94, 0.3)";
                  }}
                >
                  <span style={{ marginRight: "8px" }}>🔑</span>
                  Connexion
                </Link>
              )}

              {/* Toggle Dark Mode */}
              <button
                className="action-btn"
                onClick={onToggleDarkMode}
                style={{
                  ...actionButtonStyle,
                  background: darkMode 
                    ? "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)"
                    : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
                }}
                title={darkMode ? "Mode clair" : "Mode sombre"}
              >
                <span 
                  className="icon" 
                  style={{ 
                    fontSize: "20px", 
                    color: darkMode ? "#1F2937" : "#FCD34D",
                    transition: "transform 0.5s ease"
                  }}
                >
                  {darkMode ? "☀️" : "🌙"}
                </span>
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Bottom Navigation Mobile */}
      {isMobile && (
        <div className="mobile-bottom-nav show">
          {/* Accueil */}
          <Link 
            to="/" 
            className={`bottom-nav-item${location.pathname === '/' ? ' active' : ''}`}
          >
            <span style={{ fontSize: "20px", marginBottom: "4px" }}>🏠</span>
            <span style={{ fontSize: "11px", fontWeight: 500 }}>Accueil</span>
          </Link>

          {/* Produits */}
          <Link 
            to="/products" 
            className={`bottom-nav-item${location.pathname === '/products' ? ' active' : ''}`}
          >
            <span style={{ fontSize: "20px", marginBottom: "4px" }}>🌱</span>
            <span style={{ fontSize: "11px", fontWeight: 500 }}>Produits</span>
          </Link>

          {/* Panier */}
          {(!user || user.role === 'consumer') && (
            <Link 
              to="/cart" 
              className={`bottom-nav-item${location.pathname === '/cart' ? ' active' : ''}`}
              style={{ position: "relative" }}
            >
              <span style={{ fontSize: "20px", marginBottom: "4px" }}>🛒</span>
              <span style={{ fontSize: "11px", fontWeight: 500 }}>Panier</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  right: 8,
                  background: '#EF4444',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: "9px",
                  fontWeight: 700,
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Profil/Dashboard */}
          <Link 
            to="/dashboard" 
            className={`bottom-nav-item${location.pathname === '/dashboard' ? ' active' : ''}`}
          >
            <span style={{ fontSize: "20px", marginBottom: "4px" }}>👤</span>
            <span style={{ fontSize: "11px", fontWeight: 500 }}>Profil</span>
          </Link>

          {/* Connexion/Déconnexion */}
          {user ? (
            <button 
              onClick={() => {
                onLogout();
                window.location.href = '/';
              }}
              className="bottom-nav-item"
              style={{ 
                background: "transparent", 
                border: "none", 
                cursor: "pointer",
                color: "#EF4444"
              }}
            >
              <span style={{ fontSize: "20px", marginBottom: "4px" }}>🚪</span>
              <span style={{ fontSize: "11px", fontWeight: 500 }}>Sortir</span>
            </button>
          ) : (
            <Link 
              to="/login" 
              className={`bottom-nav-item${location.pathname === '/login' ? ' active' : ''}`}
            >
              <span style={{ fontSize: "20px", marginBottom: "4px" }}>🔑</span>
              <span style={{ fontSize: "11px", fontWeight: 500 }}>Connexion</span>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;

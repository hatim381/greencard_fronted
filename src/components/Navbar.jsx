import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ cartCount, user, onLogout, darkMode, onToggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }
          
          .nav-links {
            display: none;
          }
          
          .nav-links.open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
          }
        }
      `}</style>

      <nav style={{
        background: darkMode 
          ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        borderBottom: "1px solid rgba(34, 197, 94, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        minHeight: "80px",
        animation: "slideIn 0.6s ease-out"
      }}>
        {/* Logo Section */}
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

        {/* Bouton menu mobile */}
        <button
          className="mobile-menu-btn action-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            ...actionButtonStyle,
            background: darkMode ? "#374151" : "#F8FAFC"
          }}
          aria-label="Menu"
        >
          <span style={{ fontSize: "20px", color: darkMode ? "#E5E7EB" : "#374151" }}>
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-links${menuOpen ? ' open' : ''}`} style={{
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

        {/* Action Buttons */}
        <div className={`nav-actions${menuOpen ? ' open' : ''}`} style={{
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
      </nav>
    </>
  );
};

export default Navbar;

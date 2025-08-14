import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ cartCount = 0, user, onLogout, darkMode, onToggleDarkMode }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header
      className="navbar"
      style={{
        background: darkMode ? "rgba(2, 6, 23, 0.9)" : "rgba(255,255,255,0.86)",
        color: darkMode ? "#fff" : "#111827",
        backdropFilter: "saturate(180%) blur(10px)",
        borderBottom: "1px solid #E5E7EB",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="nav-inner container" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Brand */}
        <Link to="/" className="brand" onClick={close} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img
            src="/Images/logo.jpeg"
            alt="GreenCart"
            className="brand-logo"
            style={{
              height: 36,
              width: 36,
              objectFit: "cover",
              borderRadius: 10,
              border: "1px solid #DCFCE7",
              background: "#F0FDF4",
              boxShadow: "0 1px 6px rgba(34,197,94,0.12)",
            }}
          />
          <span className="brand-name" style={{ fontWeight: 900, letterSpacing: ".2px", color: darkMode ? "#fff" : "#111827" }}>
            GreenCart
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="nav-links" style={{ display: "flex", gap: 18 }}>
          <NavLink to="/" end className="nav-link" style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 10px",
            borderRadius: 10,
            color: isActive ? (darkMode ? "#A7F3D0" : "#065F46") : (darkMode ? "#E5E7EB" : "#374151"),
            background: isActive ? (darkMode ? "rgba(16,185,129,0.15)" : "#E7F8F0") : "transparent",
          })}>
            Accueil
          </NavLink>
          <NavLink to="/products" className="nav-link" style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 10px",
            borderRadius: 10,
            color: isActive ? (darkMode ? "#A7F3D0" : "#065F46") : (darkMode ? "#E5E7EB" : "#374151"),
            background: isActive ? (darkMode ? "rgba(16,185,129,0.15)" : "#E7F8F0") : "transparent",
          })}>
            Produits
          </NavLink>
          <NavLink to="/apropos" className="nav-link" style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 10px",
            borderRadius: 10,
            color: isActive ? (darkMode ? "#A7F3D0" : "#065F46") : (darkMode ? "#E5E7EB" : "#374151"),
            background: isActive ? (darkMode ? "rgba(16,185,129,0.15)" : "#E7F8F0") : "transparent",
          })}>
            À propos
          </NavLink>
          <NavLink to="/producteurs" className="nav-link" style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 10px",
            borderRadius: 10,
            color: isActive ? (darkMode ? "#A7F3D0" : "#065F46") : (darkMode ? "#E5E7EB" : "#374151"),
            background: isActive ? (darkMode ? "rgba(16,185,129,0.15)" : "#E7F8F0") : "transparent",
          })}>
            Producteurs
          </NavLink>
          <NavLink to="/impact" className="nav-link" style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 10px",
            borderRadius: 10,
            color: isActive ? (darkMode ? "#A7F3D0" : "#065F46") : (darkMode ? "#E5E7EB" : "#374151"),
            background: isActive ? (darkMode ? "rgba(16,185,129,0.15)" : "#E7F8F0") : "transparent",
          })}>
            Notre impact
          </NavLink>
          <NavLink to="/blog" className="nav-link" style={({ isActive }) => ({
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 10px",
            borderRadius: 10,
            color: isActive ? (darkMode ? "#A7F3D0" : "#065F46") : (darkMode ? "#E5E7EB" : "#374151"),
            background: isActive ? (darkMode ? "rgba(16,185,129,0.15)" : "#E7F8F0") : "transparent",
          })}>
            Conseils
          </NavLink>
          {user && user.role === "owner" && (
            <NavLink to="/admin" className="nav-link" style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: 800,
              padding: "8px 10px",
              borderRadius: 10,
              color: isActive ? "#fff" : "#fff",
              background: isActive ? "#e11d48" : "#f43f5e",
            })}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right actions (desktop) */}
        <div className="nav-actions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {(!user || user.role === "consumer") && (
            <Link to="/cart" className="cart-icon" style={{
              position: "relative",
              fontSize: 24,
              color: darkMode ? "#A7F3D0" : "#16A34A",
              background: darkMode ? "rgba(255,255,255,0.08)" : "#F0FDF4",
              borderRadius: "50%",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: darkMode ? "none" : "0 2px 8px #22C55E22"
            }}>
              <span role="img" aria-label="panier">🛒</span>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: -8,
                  right: -10,
                  background: "#22C55E",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: 12,
                  minWidth: 20,
                  height: 20,
                  padding: "0 6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  border: "2px solid #fff",
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <Link to="/dashboard" title="Mon compte" style={{
            fontSize: 22,
            color: darkMode ? "#A7F3D0" : "#16A34A",
            background: darkMode ? "rgba(255,255,255,0.08)" : "#F0FDF4",
            borderRadius: "50%",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span role="img" aria-label="profil">👤</span>
          </Link>

          {user ? (
            <button
              className="btn btn-primary"
              onClick={onLogout}
              style={{
                background: "#22C55E",
                color: "#fff",
                border: "1px solid #16A34A",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "1.0em",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{
                background: "#22C55E",
                color: "#fff",
                border: "1px solid #16A34A",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "1.0em",
                padding: "10px 16px",
                textDecoration: "none",
              }}
            >
              Connexion
            </Link>
          )}

          <button
            aria-label="Basculer mode sombre"
            onClick={onToggleDarkMode}
            style={{
              background: darkMode ? "#0B1220" : "#F0FDF4",
              color: darkMode ? "#fff" : "#16A34A",
              border: "1px solid",
              borderColor: darkMode ? "#1f2937" : "#DCFCE7",
              borderRadius: "50%",
              width: 36,
              height: 36,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title={darkMode ? "Mode clair" : "Mode sombre"}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="hamburger"
          aria-label="Ouvrir le menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen(!open)}
          style={{
            display: "none",
            width: 40,
            height: 40,
            border: "none",
            background: "transparent",
            padding: 8,
            borderRadius: 10,
          }}
        >
          <span style={{ display: "block", height: 2, background: darkMode ? "#fff" : "#111827", margin: "5px 0", borderRadius: 2 }} />
          <span style={{ display: "block", height: 2, background: darkMode ? "#fff" : "#111827", margin: "5px 0", borderRadius: 2 }} />
          <span style={{ display: "block", height: 2, background: darkMode ? "#fff" : "#111827", margin: "5px 0", borderRadius: 2 }} />
        </button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <>
          <div
            className="drawer-inner"
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              height: "100vh",
              width: "88%",
              maxWidth: 360,
              background: darkMode ? "#0B1220" : "#fff",
              color: darkMode ? "#E5E7EB" : "#111827",
              borderLeft: "1px solid #E5E7EB",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              boxShadow: "-10px 0 30px rgba(2,6,23,0.15)",
              zIndex: 60,
            }}
          >
            <nav className="drawer-links" onClick={close} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <NavLink to="/" end className="drawer-link" style={{ textDecoration: "none", fontWeight: 700, padding: 12, borderRadius: 12, border: "1px solid #F3F4F6", color: darkMode ? "#E5E7EB" : "#111827" }}>Accueil</NavLink>
              <NavLink to="/products" className="drawer-link" style={{ textDecoration: "none", fontWeight: 700, padding: 12, borderRadius: 12, border: "1px solid #F3F4F6", color: darkMode ? "#E5E7EB" : "#111827" }}>Produits</NavLink>
              <NavLink to="/apropos" className="drawer-link" style={{ textDecoration: "none", fontWeight: 700, padding: 12, borderRadius: 12, border: "1px solid #F3F4F6", color: darkMode ? "#E5E7EB" : "#111827" }}>À propos</NavLink>
              <NavLink to="/producteurs" className="drawer-link" style={{ textDecoration: "none", fontWeight: 700, padding: 12, borderRadius: 12, border: "1px solid #F3F4F6", color: darkMode ? "#E5E7EB" : "#111827" }}>Producteurs</NavLink>
              <NavLink to="/impact" className="drawer-link" style={{ textDecoration: "none", fontWeight: 700, padding: 12, borderRadius: 12, border: "1px solid #F3F4F6", color: darkMode ? "#E5E7EB" : "#111827" }}>Notre impact</NavLink>
              <NavLink to="/blog" className="drawer-link" style={{ textDecoration: "none", fontWeight: 700, padding: 12, borderRadius: 12, border: "1px solid #F3F4F6", color: darkMode ? "#E5E7EB" : "#111827" }}>Conseils</NavLink>
              {user && user.role === "owner" && (
                <NavLink to="/admin" className="drawer-link" style={{ textDecoration: "none", fontWeight: 800, padding: 12, borderRadius: 12, color: "#fff", background: "#f43f5e", border: "1px solid #f43f5e" }}>Admin</NavLink>
              )}
            </nav>

            <div className="drawer-actions" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(!user || user.role === "consumer") && (
                <Link to="/cart" onClick={close} className="btn btn-outline" style={{ textAlign: "center", textDecoration: "none" }}>
                  🛒 Mon panier {cartCount > 0 ? `(${cartCount})` : ""}
                </Link>
              )}
              {user ? (
                <button className="btn btn-primary" onClick={() => { onLogout?.(); close(); }}>
                  Se déconnecter
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={close} className="btn btn-outline" style={{ textAlign: "center", textDecoration: "none" }}>
                    Se connecter
                  </Link>
                  <Link to="/register" onClick={close} className="btn btn-primary" style={{ textAlign: "center", textDecoration: "none" }}>
                    Créer un compte
                  </Link>
                </>
              )}
              <button
                onClick={() => { onToggleDarkMode?.(); }}
                className="btn btn-outline"
              >
                {darkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
              </button>
            </div>
          </div>

          <button
            className="drawer-backdrop"
            aria-label="Fermer"
            onClick={close}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.32)", zIndex: 55, border: "none" }}
          />
        </>
      )}
    </header>
  );
};

export default Navbar;

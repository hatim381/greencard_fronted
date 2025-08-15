import { useState } from 'react';
import useDeviceDetection from '../hooks/useDeviceDetection';

const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const { isMobile } = useDeviceDetection();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        // Ne pas inclure de cookies sur le cross-origin
        credentials: 'omit'
      });
      if (res.ok) {
        setMsg('Merci ! Vous êtes inscrit à la newsletter.');
        setEmail('');
      } else {
        const data = await res.json();
        setMsg(data.error || "Erreur lors de l'inscription.");
      }
    } catch {
      setMsg('Erreur lors de l’inscription.');
    }
  };

  return (
    <footer style={{marginTop: "3rem", background: "none"}}>
      {/* Newsletter section */}
      <div style={{
        background: "#22C55E",
        color: "#fff",
        padding: isMobile ? "2rem 0 1.5rem 0" : "2.5rem 0 2rem 0",
        borderTopLeftRadius: isMobile ? 20 : 32,
        borderTopRightRadius: isMobile ? 20 : 32,
        textAlign: "left"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "0 1rem" : "0 2rem",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 8 : 10
        }}>
          <div style={{ 
            fontWeight: 700, 
            fontSize: isMobile ? "1.3rem" : "1.5rem", 
            marginBottom: isMobile ? 4 : 6 
          }}>
            Restez informé
          </div>
          <div style={{ 
            fontSize: isMobile ? "1rem" : "1.08rem", 
            marginBottom: isMobile ? 15 : 18 
          }}>
            Abonnez-vous à notre newsletter pour recevoir nos offres spéciales et des conseils anti-gaspillage.
          </div>
          <form
            onSubmit={handleSubscribe}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              gap: isMobile ? 10 : 12,
              maxWidth: 600,
              marginBottom: 8
            }}
          >
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                border: "none",
                padding: isMobile ? "1rem 1em" : "0.9em 1em",
                fontSize: isMobile ? "1rem" : "1.08em",
                outline: "none",
                background: "#fff",
                borderRadius: 8,
                color: "#222",
                flex: isMobile ? "none" : 1
              }}
            />
            <button
              type="submit"
              className="btn btn-white"
              style={{
                color: "#22C55E",
                fontWeight: 700,
                background: "#fff",
                border: "none",
                borderRadius: 8,
                padding: isMobile ? "1rem 1.7em" : "0.9em 1.7em",
                fontSize: isMobile ? "1rem" : "1.08em",
                letterSpacing: 0.5,
                cursor: "pointer"
              }}
            >
              S’abonner
            </button>
          </form>
          <div style={{ fontSize: "0.95em", color: "#d1fae5", marginBottom: 4 }}>
            Nous respectons votre vie privée. Vous pouvez vous désabonner à tout moment.
          </div>
          {msg && (
            <div style={{
              color: msg.includes("Merci") ? "#fff" : "#e11d48",
              background: msg.includes("Merci") ? "#16A34A" : "#fee2e2",
              borderRadius: 8,
              padding: "0.5em 1.2em",
              fontWeight: 500,
              textAlign: "center",
              fontSize: "1.05em",
              marginTop: 4,
              marginBottom: 4,
              transition: "color 0.2s"
            }}>
              {msg}
            </div>
          )}
        </div>
      </div>

      {/* Main footer - Version conditionnelle mobile/desktop */}
      {isMobile ? (
        /* Footer mobile simplifié */
        <div style={{
          background: "#181F2A",
          color: "#fff",
          padding: "2rem 0 6rem 0", // Extra padding pour la bottom nav
          textAlign: "center"
        }}>
          <div style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "0 1rem"
          }}>
            {/* Logo et description */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ 
                fontWeight: 700, 
                fontSize: "1.2rem",
                marginBottom: 8, 
                letterSpacing: 1,
                color: "#22C55E"
              }}>
                GREENCART
              </div>
              <div style={{ 
                color: "#d1fae5", 
                fontSize: "0.9rem", 
                lineHeight: 1.5 
              }}>
                La plateforme qui connecte consommateurs et producteurs locaux pour une alimentation durable.
              </div>
            </div>

            {/* Contact essentiel */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ 
                fontWeight: 600, 
                fontSize: "1rem",
                marginBottom: 8,
                color: "#22C55E"
              }}>
                CONTACT
              </div>
              <div style={{ 
                color: "#d1fae5", 
                fontSize: "0.9rem",
                marginBottom: 8 
              }}>
                📞 01 23 45 67 89<br />
                📍 Paris, France
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "center",
                gap: 15, 
                marginTop: 10 
              }}>
                <a href="mailto:contact@greencart.fr" style={{ color: "#fff", fontSize: 20 }}>✉️</a>
                <a href="https://facebook.com" style={{ color: "#fff", fontSize: 20 }}>📘</a>
                <a href="https://twitter.com" style={{ color: "#fff", fontSize: 20 }}>🐦</a>
                <a href="https://instagram.com" style={{ color: "#fff", fontSize: 20 }}>📸</a>
              </div>
            </div>

            {/* Liens essentiels */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "15px",
                fontSize: "0.9rem"
              }}>
                <a href="/apropos" style={{ color: "#d1fae5", textDecoration: "none" }}>À propos</a>
                <a href="/faq" style={{ color: "#d1fae5", textDecoration: "none" }}>FAQ</a>
                <a href="/cookies" style={{ color: "#d1fae5", textDecoration: "none" }}>Cookies</a>
                <a href="/accessibilite" style={{ color: "#d1fae5", textDecoration: "none" }}>Accessibilité</a>
              </div>
            </div>

            {/* Copyright */}
            <div style={{
              borderTop: "1px solid #263043",
              paddingTop: 15,
              color: "#b6c2d1",
              fontSize: "0.85rem"
            }}>
              © 2023 GreenCart. Tous droits réservés.
            </div>
          </div>
        </div>
      ) : (
        /* Footer desktop complet */
        <div style={{
          background: "#181F2A",
          color: "#fff",
          padding: "2.5rem 0 1.5rem 0"
        }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: 32
        }}>
          {/* GreenCart */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>GREENCART</div>
            <div style={{ color: "#d1fae5", fontSize: "0.98em" }}>
              La plateforme qui connecte consommateurs et producteurs locaux pour une alimentation durable et anti-gaspillage.
            </div>
          </div>
          {/* Navigation */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>NAVIGATION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <a href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Accueil</a>
              <a href="/products" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Produits</a>
              <a href="/apropos" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>À propos</a>
              <a href="/producteurs" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Producteurs</a>
              <a href="/impact" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Notre impact</a>
            </div>
          </div>
          {/* Légal */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>LÉGAL</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <a href="/conditions-generales" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Conditions générales</a>
              <a href="/confidentialite" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Politique de confidentialité</a>
              <a href="/mentions-legales" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Mentions légales</a>
              <a href="/cookies" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Cookies</a>
            </div>
          </div>
          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>CONTACT</div>
            <div style={{ color: "#d1fae5", fontSize: "0.98em", marginBottom: 4 }}>
              <span role="img" aria-label="phone">📞</span> 01 23 45 67 89<br />
              <span role="img" aria-label="location">📍</span> Paris, France
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <a href="mailto:contact@greencart.fr" style={{ color: "#fff", fontSize: 18 }} aria-label="mail"><span role="img" aria-label="mail">✉️</span></a>
              <a href="https://facebook.com" style={{ color: "#fff", fontSize: 18 }} aria-label="facebook"><span role="img" aria-label="fb">📘</span></a>
              <a href="https://twitter.com" style={{ color: "#fff", fontSize: 18 }} aria-label="twitter"><span role="img" aria-label="tw">🐦</span></a>
              <a href="https://instagram.com" style={{ color: "#fff", fontSize: 18 }} aria-label="instagram"><span role="img" aria-label="ig">📸</span></a>
              <a href="https://linkedin.com" style={{ color: "#fff", fontSize: 18 }} aria-label="linkedin"><span role="img" aria-label="in">💼</span></a>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #263043",
          marginTop: 32,
          paddingTop: 18,
          color: "#b6c2d1",
          fontSize: "0.97em",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
          flexWrap: "wrap"
        }}>
          <div>© 2023 GreenCart. Tous droits réservés.</div>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="/accessibilite" style={{ color: "#b6c2d1", textDecoration: "none" }}>Accessibilité</a>
            <a href="/plan-du-site" style={{ color: "#b6c2d1", textDecoration: "none" }}>Plan du site</a>
            <a href="/faq" style={{ color: "#b6c2d1", textDecoration: "none" }}>FAQ</a>
          </div>
        </div>
      </div>
      )}
    </footer>
  );
};

export default Footer;

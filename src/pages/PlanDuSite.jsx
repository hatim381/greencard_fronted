import React from "react";
import { Link } from "react-router-dom";
import Meta from '../components/Meta';

export default function PlanDuSite() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: window.innerWidth < 600 ? "1em 0.5em" : "2em 1em" }}>
      <Meta title="GreenCart – Plan du site" />
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Plan du site</h1>
        <ul style={{ margin: "1.5em 0", paddingLeft: 24, fontSize: "1.1em" }}>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/apropos">À propos</Link></li>
          <li><Link to="/producteurs">Producteurs</Link></li>
          <li><Link to="/impact">Notre impact</Link></li>
          <li><Link to="/blog">Conseils</Link></li>
          <li><Link to="/dashboard">Tableau de bord</Link></li>
          <li><Link to="/cart">Panier</Link></li>
          <li><Link to="/conditions-generales">Conditions générales</Link></li>
          <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
          <li><Link to="/mentions-legales">Mentions légales</Link></li>
          <li><Link to="/cookies">Cookies</Link></li>
          <li><Link to="/accessibilite">Accessibilité</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </section>
    </main>
  );
}

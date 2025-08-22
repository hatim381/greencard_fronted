import React from "react";

export default function Cookies() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2em 1em" }}>
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Gestion des cookies</h1>
        <p>
          Le site GreenCart utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visite.
        </p>
        <ul style={{ margin: "1.5em 0", paddingLeft: 24 }}>
          <li>Les cookies sont utilisés uniquement à des fins techniques et analytiques.</li>
          <li>Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur.</li>
          <li>Aucune donnée personnelle n’est collectée à des fins publicitaires.</li>
        </ul>
        <p>
          Pour toute question relative à la gestion des cookies, contactez-nous à l’adresse : contact@greencart.fr
        </p>
      </section>
    </main>
  );
}

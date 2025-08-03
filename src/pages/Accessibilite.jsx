import React from "react";

export default function Accessibilite() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2em 1em" }}>
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Accessibilité</h1>
        <p>
          GreenCart s’engage à rendre son site accessible à tous, y compris aux personnes en situation de handicap.
        </p>
        <ul style={{ margin: "1.5em 0", paddingLeft: 24 }}>
          <li>Navigation clavier optimisée sur toutes les pages</li>
          <li>Contrastes de couleurs respectés pour une meilleure lisibilité</li>
          <li>Compatibilité avec les lecteurs d’écran</li>
          <li>Images avec textes alternatifs</li>
        </ul>
        <p>
          Si vous rencontrez une difficulté d’accès, contactez-nous à <a href="mailto:contact@greencart.fr">contact@greencart.fr</a>.
        </p>
      </section>
    </main>
  );
}

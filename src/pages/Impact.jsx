import React from "react";

export default function Impact() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2em 1em" }}>
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Notre impact</h1>
        <p>
          Chaque achat sur GreenCart contribue à un système alimentaire plus durable et solidaire. Ensemble, nous agissons concrètement pour :
        </p>
        <ul style={{ margin: "1.5em 0", paddingLeft: 24 }}>
          <li><b>Réduire le gaspillage alimentaire</b> : plus de 8 tonnes de nourriture sauvées chaque mois.</li>
          <li><b>Limiter les émissions de CO₂</b> : nos produits génèrent en moyenne 45% moins d’émissions que les circuits traditionnels.</li>
          <li><b>Soutenir les producteurs locaux</b> : jusqu’à 15% de revenu supplémentaire grâce à la valorisation des invendus.</li>
          <li><b>Favoriser l’économie circulaire</b> et les circuits courts.</li>
        </ul>
        <p>
          Merci à tous nos utilisateurs et partenaires pour leur engagement en faveur d’une alimentation plus responsable !
        </p>
      </section>
    </main>
  );
}

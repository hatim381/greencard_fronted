import React from "react";
import Meta from '../components/Meta';

export default function About() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2em 1em" }}>
      <Meta title="GreenCart – À propos" />
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>À propos de GreenCart</h1>
        <p>
          GreenCart est une plateforme web écoresponsable qui connecte directement les producteurs locaux et les consommateurs afin de lutter contre le gaspillage alimentaire et de favoriser une alimentation durable.
        </p>
        <p>
          Notre mission est de valoriser les invendus et les surplus de production, tout en offrant aux consommateurs des produits frais, locaux et à prix réduits. Nous croyons qu’il est possible de mieux consommer tout en soutenant l’économie locale et en réduisant notre impact environnemental.
        </p>
        <ul style={{ margin: "1.5em 0", paddingLeft: 24 }}>
          <li>Réduction du gaspillage alimentaire</li>
          <li>Valorisation des circuits courts</li>
          <li>Accompagnement des producteurs dans la digitalisation</li>
          <li>Consommation responsable et locale</li>
        </ul>
        <p>
          Rejoignez-nous dans cette aventure pour une alimentation plus durable et solidaire !
        </p>
      </section>
    </main>
  );
}

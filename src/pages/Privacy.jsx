import React from "react";

export default function Privacy() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2em 1em" }}>
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Politique de confidentialité</h1>
        <p>
          GreenCart attache une grande importance à la protection de vos données personnelles. Les informations collectées sont utilisées uniquement dans le cadre de la gestion de votre compte et de vos commandes.
        </p>
        <ul style={{ margin: "1.5em 0", paddingLeft: 24 }}>
          <li>Vos données ne sont jamais revendues à des tiers.</li>
          <li>Vous disposez d’un droit d’accès, de rectification et de suppression de vos informations.</li>
          <li>Pour exercer vos droits, contactez-nous à l’adresse : contact@greencart.fr</li>
        </ul>
        <p>
          Pour plus d’informations, consultez notre politique complète sur la confidentialité.
        </p>
      </section>
    </main>
  );
}

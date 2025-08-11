import React from "react";

export default function Terms() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2em 1em" }}>
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Conditions Générales d’Utilisation</h1>
        <p>
          Les présentes conditions générales régissent l’utilisation du site GreenCart. En accédant à la plateforme, vous acceptez sans réserve les présentes CGU.
        </p>
        <ul style={{ margin: "1.5em 0", paddingLeft: 24 }}>
          <li>L’utilisateur s’engage à fournir des informations exactes lors de son inscription.</li>
          <li>Les contenus publiés sur GreenCart ne doivent pas porter atteinte aux droits de tiers.</li>
          <li>GreenCart se réserve le droit de suspendre ou supprimer un compte en cas de non-respect des présentes conditions.</li>
          <li>Les transactions sont réalisées sous la responsabilité des utilisateurs.</li>
        </ul>
        <p>
          Pour toute question relative à l’utilisation du site, contactez-nous à l’adresse : contact@greencart.fr
        </p>
      </section>
    </main>
  );
}

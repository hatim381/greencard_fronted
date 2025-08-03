import React from "react";

export default function Faq() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2em 1em" }}>
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Foire aux questions (FAQ)</h1>
        <div style={{ marginBottom: 24 }}>
          <b>Comment commander sur GreenCart ?</b>
          <p>
            Sélectionnez vos produits, ajoutez-les au panier puis validez votre commande en renseignant vos informations de livraison et de paiement.
          </p>
        </div>
        <div style={{ marginBottom: 24 }}>
          <b>Qui sont les producteurs partenaires ?</b>
          <p>
            Ce sont des producteurs locaux sélectionnés pour la qualité de leurs produits et leur engagement contre le gaspillage alimentaire.
          </p>
        </div>
        <div style={{ marginBottom: 24 }}>
          <b>Puis-je payer à la livraison ?</b>
          <p>
            Oui, vous pouvez choisir le paiement en espèces à la livraison lors de la validation de votre commande.
          </p>
        </div>
        <div style={{ marginBottom: 24 }}>
          <b>Comment contacter le support ?</b>
          <p>
            Pour toute question, écrivez-nous à <a href="mailto:contact@greencart.fr">contact@greencart.fr</a>.
          </p>
        </div>
      </section>
    </main>
  );
}

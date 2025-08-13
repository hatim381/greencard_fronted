import React from "react";
import Meta from '../components/Meta';

export default function Producers() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2em 1em" }}>
      <Meta title="GreenCart – Producteurs" />
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Nos producteurs partenaires</h1>
        <p>
          GreenCart travaille main dans la main avec des producteurs locaux engagés pour une agriculture durable et une alimentation de qualité. Découvrez quelques-uns de nos partenaires :
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
          margin: "2em 0"
        }}>
          <div style={{ textAlign: "center" }}>
            <img src="/Images/prod1.png" alt="Producteur 1" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 16, marginBottom: 10 }} />
            <div style={{ fontWeight: 600 }}>Ferme du Val Fleuri</div>
            <div style={{ color: "#888" }}>Fruits & légumes</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src="/Images/prod2.png" alt="Producteur 2" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 16, marginBottom: 10 }} />
            <div style={{ fontWeight: 600 }}>Laiterie des Prés</div>
            <div style={{ color: "#888" }}>Produits laitiers</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src="/Images/prod3.png" alt="Producteur 3" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 16, marginBottom: 10 }} />
            <div style={{ fontWeight: 600 }}>Boucherie Martin</div>
            <div style={{ color: "#888" }}>Viandes & Volaille</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src="/Images/prod4.png" alt="Producteur 4" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 16, marginBottom: 10 }} />
            <div style={{ fontWeight: 600 }}>Boulangerie du Moulin</div>
            <div style={{ color: "#888" }}>Boulangerie</div>
          </div>
        </div>
        <p>
          Vous êtes producteur et souhaitez rejoindre GreenCart ? <b>Contactez-nous</b> pour valoriser vos invendus et toucher de nouveaux clients !
        </p>
      </section>
    </main>
  );
}

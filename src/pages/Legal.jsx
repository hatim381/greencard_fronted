import React from "react";

export default function Legal() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: window.innerWidth < 600 ? "1em 0.5em" : "2em 1em" }}>
      <section>
        <h1 style={{ color: "#22C55E", fontWeight: 800, marginBottom: 18 }}>Mentions légales</h1>
        <p>
          Éditeur du site : GreenCart<br />
          Adresse : Paris, France<br />
          Email : contact@greencart.fr
        </p>
        <p>
          Directeur de la publication : GreenCart SAS<br />
          Hébergement : OVH, 2 rue Kellermann, 59100 Roubaix, France
        </p>
        <p>
          Le site GreenCart est soumis à la législation française. Toute reproduction, même partielle, est interdite sans autorisation.
        </p>
      </section>
    </main>
  );
}

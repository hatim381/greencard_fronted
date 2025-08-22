import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ...existing code...
    try {
      // ...existing code...
      await axios.post(/* ...params... */);
      // ...existing code...
      setError(null);
    } catch (err) {
      let msg = err.message || "Erreur lors de la commande.";
      if (err.message === "Network Error" || (err.request && !err.response)) {
        msg =
          "Erreur lors de la commande. Impossible de contacter le serveur. Veuillez vérifier votre connexion.";
      }
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ...existing code... */}
      {error && (
        <div style={{ color: 'red' }}>
          Erreur lors de la commande: {error}
        </div>
      )}
      {/* ...existing code... */}
    </form>
  );
};

export default OrderForm;

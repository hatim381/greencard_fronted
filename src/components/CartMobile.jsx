import React, { useState, useEffect } from "react";
import { orders } from "../services/api";
import StripePaymentForm from "./StripePaymentForm";
import PayPalPaymentWrapper from "./PayPalPaymentWrapper";

const CartMobile = ({ cart, onRemove, onClear, onUpdateQuantity, user }) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [address, setAddress] = useState(user?.default_address || "");
  const [payment, setPayment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderMsg, setOrderMsg] = useState("");
  const [error, setError] = useState("");
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const updateCartItem = (index, newQuantity) => {
    if (newQuantity <= 0) {
      const item = cart[index];
      onRemove(item.id ?? item.product_id);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(index, newQuantity);
    }
  };

  useEffect(() => {
    setAddress(user?.default_address || "");
  }, [user]);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrderMsg("");

    if (!user || !user.id) {
      setError("Vous devez être connecté pour commander.");
      setLoading(false);
      return;
    }
    if (!cart || cart.length === 0) {
      setError("Votre panier est vide.");
      setLoading(false);
      return;
    }
    if (!address || !payment || !email || !phone) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      setError("Veuillez saisir un email valide.");
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      setError("Veuillez saisir un numéro de téléphone valide (10 chiffres).");
      setLoading(false);
      return;
    }

    try {
      await orders.create({
        consumer_id: user.id,
        address,
        payment,
        email,
        phone,
        instructions,
        items: cart.map((item) => ({
          product_id: item.product_id ?? item.id,
          quantity: item.quantity,
        })),
      });

      setOrderMsg("Commande passée avec succès !");
      onClear();
      setShowOrderForm(false);
      setAddress("");
      setPayment("");
      setEmail("");
      setPhone("");
      setInstructions("");
    } catch (err) {
      let msg = "Erreur lors de la commande.";
      const data = err.response?.data;

      if (typeof data === "string") {
        msg += ` ${data}`;
      } else if (data?.error || data?.message) {
        msg += ` ${data.error || data.message}`;
      } else if (err.message === "Network Error" || (err.request && !err.response)) {
        msg +=
          " Impossible de contacter le serveur. Veuillez vérifier votre connexion.";
      } else if (err.message) {
        msg += ` ${err.message}`;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentMethodChange = (selectedPayment) => {
    setPayment(selectedPayment);
    setShowStripeForm(selectedPayment === "cb");
    setShowPaymentForm(selectedPayment === "paypal");
  };

  const handleStripeSuccess = async (paymentData) => {
    console.log('🟢 handleStripeSuccess appelé avec:', paymentData);
    try {
      const orderData = {
        consumer_id: user.id,
        address,
        payment: "cb",
        email,
        phone,
        instructions,
        payment_intent_id: paymentData.payment_intent_id,
        items: cart.map((item) => ({
          product_id: item.product_id ?? item.id,
          quantity: item.quantity,
        })),
      };
      
      console.log('🟢 Envoi de la commande avec:', orderData);
      
      await orders.create(orderData);

      setOrderMsg("Commande passée avec succès !");
      onClear();
      setShowOrderForm(false);
      setShowStripeForm(false);
      setAddress("");
      setPayment("");
      setEmail("");
      setPhone("");
      setInstructions("");
      
      console.log('✅ Commande créée avec succès !');
    } catch (err) {
      console.log('❌ Erreur lors de la finalisation de la commande:', err);
      setError("Erreur lors de la finalisation de la commande : " + (err.response?.data?.error || err.message));
    }
  };

  const handlePayPalSuccess = async (paymentData) => {
    console.log('🟡 handlePayPalSuccess appelé avec:', paymentData);
    try {
      const orderData = {
        consumer_id: user.id,
        address,
        payment: "paypal",
        email,
        phone,
        instructions,
        payment_intent_id: paymentData.payment_intent_id,
        items: cart.map((item) => ({
          product_id: item.product_id ?? item.id,
          quantity: item.quantity,
        })),
      };
      
      console.log('🟡 Envoi de la commande PayPal avec:', orderData);
      
      await orders.create(orderData);

      setOrderMsg("Commande PayPal passée avec succès !");
      onClear();
      setShowOrderForm(false);
      setShowStripeForm(false);
      setShowPaymentForm(false);
      setAddress("");
      setPayment("");
      setEmail("");
      setPhone("");
      setInstructions("");
      
      console.log('✅ Commande PayPal créée avec succès !');
    } catch (err) {
      console.log('❌ Erreur lors de la finalisation de la commande PayPal:', err);
      setError("Erreur lors de la finalisation de la commande PayPal : " + (err.response?.data?.error || err.message));
    }
  };

  const handlePaymentError = (error) => {
    setError("Erreur de paiement : " + error.message);
  };

  return (
    <main
      style={{
        margin: "1rem",
        background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        borderRadius: 20,
        padding: "0",
        boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(229, 231, 235, 0.5)",
        overflow: "hidden",
        position: "relative",
        minHeight: "calc(100vh - 2rem)"
      }}
    >
      {/* Header mobile avec dégradé */}
      <div style={{
        background: "linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)",
        padding: "1.5rem 1rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.05\"><circle cx=\"20\" cy=\"20\" r=\"2\"/></g></g></svg>') repeat",
          opacity: 0.3
        }}></div>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: 0,
          color: "white",
          fontSize: "1.8rem",
          fontWeight: "700",
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 1
        }}>
          🛒 Mon Panier
        </h2>
        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.9)",
          fontSize: "0.95rem",
          margin: "0.5rem 0 0 0",
          position: "relative",
          zIndex: 1
        }}>
          {cart.length} article{cart.length > 1 ? 's' : ''} sélectionné{cart.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Contenu principal mobile */}
      <div style={{ padding: "1rem" }}>
        {orderMsg && (
          <div style={{ 
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            color: "white",
            textAlign: "center", 
            marginBottom: 16,
            padding: "0.8rem 1.5rem",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "0.95rem",
            boxShadow: "0 8px 20px -4px rgba(34, 197, 94, 0.3)"
          }}>
            ✅ {orderMsg}
          </div>
        )}

      {cart.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "2rem 1rem",
          background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
          borderRadius: "12px",
          border: "2px dashed #cbd5e1",
          position: "relative"
        }}>
          <div style={{
            fontSize: "3rem",
            marginBottom: "0.8rem",
            opacity: 0.7
          }}>🛍️</div>
          <h3 style={{
            color: "#64748b",
            fontSize: "1.2rem",
            marginBottom: "0.4rem",
            fontWeight: "600"
          }}>Votre panier est vide</h3>
          <p style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            margin: 0
          }}>Découvrez nos produits bio et locaux !</p>
        </div>
      ) : (
        <div>
          {/* Liste des produits mobile avec style premium */}
          <div style={{ marginBottom: "1.5rem" }}>
            {cart.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  marginBottom: "0.8rem",
                  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  borderRadius: "12px",
                  border: "1px solid rgba(229, 231, 235, 0.6)",
                  boxShadow: "0 3px 12px -1px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Badge de quantité mobile */}
                <div style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  color: "white",
                  borderRadius: "15px",
                  padding: "3px 8px",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  minWidth: "20px",
                  textAlign: "center"
                }}>
                  {item.quantity}
                </div>

                {/* Layout mobile : image et infos côte à côte */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.8rem",
                  marginBottom: "0.8rem"
                }}>
                  {/* Image du produit mobile */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "1.5rem", opacity: 0.5 }}>📦</span>
                    )}
                  </div>

                  {/* Informations du produit mobile */}
                  <div style={{ flex: 1, paddingRight: "1.5rem" }}>
                    <h4 style={{
                      margin: "0 0 0.3rem 0",
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      lineHeight: "1.2"
                    }}>
                      {item.name}
                    </h4>
                    <div style={{
                      background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                      color: "#166534",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      border: "1px solid #bbf7d0",
                      display: "inline-block",
                      marginBottom: "0.3rem"
                    }}>
                      {typeof item.price === "string" && item.price.includes("€")
                        ? item.price
                        : `${item.price}€`} / {item.unit || 'unité'}
                    </div>
                    {item.producer && (
                      <div style={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                        marginBottom: "0.3rem"
                      }}>
                        Producteur: {item.producer}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section total et contrôles mobile */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid rgba(229, 231, 235, 0.3)"
                }}>
                  {/* Total mobile */}
                  <div style={{
                    background: "linear-gradient(135deg, #fef3c7, #fde047)",
                    color: "#92400e",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    border: "1px solid #fbbf24"
                  }}>
                    {(
                      (typeof item.price === "string" ? parseFloat(item.price.replace("€", "")) : item.price) * 
                      item.quantity
                    ).toFixed(2)}€
                  </div>

                  {/* Contrôles de quantité mobile */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(248, 250, 252, 0.8)",
                    padding: "4px",
                    borderRadius: "8px",
                    border: "1px solid rgba(229, 231, 235, 0.6)"
                  }}>
                    <button
                      onClick={() => updateCartItem(index, item.quantity - 1)}
                      style={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 6px -1px rgba(239, 68, 68, 0.3)"
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      minWidth: "32px",
                      textAlign: "center",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#1e293b"
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItem(index, item.quantity + 1)}
                      style={{
                        background: "linear-gradient(135deg, #22C55E, #16A34A)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 6px -1px rgba(34, 197, 94, 0.3)"
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Total mobile avec style premium */}
          <div style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(229, 231, 235, 0.6)",
            boxShadow: "0 3px 12px -1px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              textAlign: "center",
              marginBottom: "1.2rem"
            }}>
              <div style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "0.5rem"
              }}>
                Total de la commande
              </div>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 2px 4px rgba(34, 197, 94, 0.2)"
              }}>
                {cart
                  .reduce((sum, item) => {
                    const price =
                      typeof item.price === "string"
                        ? parseFloat(
                            item.price.replace(/[^\d.,]/g, "").replace(",", ".")
                          ) || 0
                        : item.price;
                    return sum + price * item.quantity;
                  }, 0)
                  .toFixed(2)}{" "}
                €
              </div>
            </div>

            {/* Boutons d'action mobile */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              gap: "0.8rem"
            }}>
              <button
                onClick={() => setShowOrderForm(true)}
                style={{
                  background: "linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.9rem 2rem",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 6px 20px -3px rgba(34, 197, 94, 0.3)",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                ✨ Finaliser ma commande
              </button>
              
              <button 
                onClick={onClear}
                style={{
                  background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                  color: "#64748b",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "0.7rem 2rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
                  width: "100%"
                }}
              >
                🗑️ Vider le panier
              </button>
            </div>
          </div>

          {showOrderForm && (
            <div style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: "16px",
              padding: "1.5rem",
              marginTop: "1rem",
              border: "1px solid rgba(229, 231, 235, 0.6)",
              boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.1)",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Header du formulaire mobile */}
              <div style={{
                textAlign: "center",
                marginBottom: "2rem",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-0.8rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  boxShadow: "0 6px 20px -3px rgba(34, 197, 94, 0.3)"
                }}>
                  📄
                </div>
                <h3 style={{
                  color: "#1e293b",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginTop: "1.2rem",
                  marginBottom: "0.4rem"
                }}>
                  Informations de livraison
                </h3>
                <p style={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                  margin: 0
                }}>
                  Complétez vos informations pour finaliser votre commande
                </p>
              </div>

              <form onSubmit={handleOrder}>
                {/* Formulaire mobile */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                  marginBottom: "1.5rem"
                }}>
                  {/* Adresse mobile */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.4rem"
                    }}>
                      🏠 Adresse de livraison *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Rue de la Paix, 75001 Paris"
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.05)"
                      }}
                    />
                  </div>

                  {/* Email mobile */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.4rem"
                    }}>
                      📧 Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.05)"
                      }}
                    />
                  </div>

                  {/* Téléphone mobile */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.4rem"
                    }}>
                      📱 Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.05)"
                      }}
                    />
                  </div>

                  {/* Instructions mobile */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.4rem"
                    }}>
                      💬 Instructions spéciales (optionnel)
                    </label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Codes d'accès, étage, instructions particulières..."
                      rows="3"
                      style={{
                        width: "100%",
                        padding: "0.8rem 1rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.05)",
                        resize: "vertical",
                        fontFamily: "inherit"
                      }}
                    />
                  </div>
                </div>

                {/* Section Méthode de paiement mobile */}
                <div style={{
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "2px solid #bbf7d0",
                  marginBottom: "1.5rem"
                }}>
                  <h4 style={{
                    color: "#166534",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}>
                    💳 Méthode de paiement
                  </h4>

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                    marginBottom: "1rem"
                  }}>
                    {/* Option Carte Bancaire mobile */}
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.8rem",
                      background: payment === "cb" ? "linear-gradient(135deg, #22C55E, #16A34A)" : "white",
                      color: payment === "cb" ? "white" : "#374151",
                      borderRadius: "8px",
                      border: `2px solid ${payment === "cb" ? "#22C55E" : "#e5e7eb"}`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: payment === "cb" ? "0 6px 20px -3px rgba(34, 197, 94, 0.3)" : "0 2px 6px -1px rgba(0, 0, 0, 0.05)"
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        value="cb"
                        checked={payment === "cb"}
                        onChange={() => handlePaymentMethodChange("cb")}
                        style={{ marginRight: "0.6rem", transform: "scale(1.1)" }}
                      />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>💳 Carte Bancaire</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Visa, MasterCard, American Express</div>
                      </div>
                    </label>

                    {/* Option PayPal mobile */}
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.8rem",
                      background: payment === "paypal" ? "linear-gradient(135deg, #0070f3, #0051cc)" : "white",
                      color: payment === "paypal" ? "white" : "#374151",
                      borderRadius: "8px",
                      border: `2px solid ${payment === "paypal" ? "#0070f3" : "#e5e7eb"}`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: payment === "paypal" ? "0 6px 20px -3px rgba(0, 112, 243, 0.3)" : "0 2px 6px -1px rgba(0, 0, 0, 0.05)"
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={payment === "paypal"}
                        onChange={() => handlePaymentMethodChange("paypal")}
                        style={{ marginRight: "0.6rem", transform: "scale(1.1)" }}
                      />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>🟦 PayPal</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Paiement sécurisé avec PayPal</div>
                      </div>
                    </label>

                    {/* Option Espèces mobile */}
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.8rem",
                      background: payment === "especes" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "white",
                      color: payment === "especes" ? "white" : "#374151",
                      borderRadius: "8px",
                      border: `2px solid ${payment === "especes" ? "#f59e0b" : "#e5e7eb"}`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: payment === "especes" ? "0 6px 20px -3px rgba(245, 158, 11, 0.3)" : "0 2px 6px -1px rgba(0, 0, 0, 0.05)"
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        value="especes"
                        checked={payment === "especes"}
                        onChange={() => handlePaymentMethodChange("especes")}
                        style={{ marginRight: "0.6rem", transform: "scale(1.1)" }}
                      />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>💰 Espèces</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Paiement à la livraison</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Messages d'erreur mobile */}
                {error && (
                  <div style={{
                    background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                    color: "#dc2626",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "2px solid #fecaca",
                    marginBottom: "1rem",
                    fontSize: "0.85rem",
                    fontWeight: "500"
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Boutons du formulaire mobile */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                  marginTop: "1.5rem"
                }}>
                  {(!showStripeForm && !showPaymentForm) && (
                    <button
                      type="submit"
                      disabled={loading || !payment}
                      style={{
                        background: loading || !payment 
                          ? "linear-gradient(135deg, #9ca3af, #6b7280)" 
                          : "linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        padding: "0.9rem 2rem",
                        fontSize: "1rem",
                        fontWeight: "700",
                        cursor: loading || !payment ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        width: "100%",
                        opacity: loading || !payment ? 0.6 : 1,
                        boxShadow: "0 6px 20px -3px rgba(34, 197, 94, 0.3)"
                      }}
                    >
                      {loading ? "⏳ Traitement..." : "🚀 Confirmer la commande"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    style={{
                      background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                      color: "#64748b",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "0.7rem 2rem",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      width: "100%"
                    }}
                  >
                    ← Retour au panier
                  </button>
                </div>
              </form>

              {/* Formulaire Stripe mobile */}
              {showStripeForm && (
                <div style={{ 
                  marginTop: "1.5rem",
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "2px solid #22C55E",
                  boxShadow: "0 6px 20px -3px rgba(34, 197, 94, 0.2)"
                }}>
                  <h3 style={{ 
                    color: "#166534",
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem"
                  }}>
                    💳 Paiement par Carte Bancaire
                  </h3>
                  <StripePaymentForm
                    totalAmount={cart.reduce((sum, item) => {
                      const price = typeof item.price === "string"
                        ? parseFloat(item.price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
                        : item.price;
                      return sum + price * item.quantity;
                    }, 0)}
                    onPaymentSuccess={handleStripeSuccess}
                    onPaymentError={handlePaymentError}
                    loading={loading}
                  />
                </div>
              )}

              {/* Formulaire PayPal mobile */}
              {showPaymentForm && (
                <div style={{ 
                  marginTop: "1.5rem",
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "2px solid #0070f3",
                  boxShadow: "0 6px 20px -3px rgba(0, 112, 243, 0.2)"
                }}>
                  <h3 style={{ 
                    color: "#1e40af",
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem"
                  }}>
                    🟦 Paiement PayPal
                  </h3>
                  <PayPalPaymentWrapper
                    totalAmount={cart.reduce((sum, item) => {
                      const price = typeof item.price === "string"
                        ? parseFloat(item.price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
                        : item.price;
                      return sum + price * item.quantity;
                    }, 0)}
                    onPaymentSuccess={handlePayPalSuccess}
                    onPaymentError={handlePaymentError}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Footer mobile avec informations de sécurité */}
      <div style={{
        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        padding: "1rem",
        textAlign: "center",
        borderTop: "1px solid rgba(229, 231, 235, 0.6)"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.8rem",
          fontSize: "0.8rem",
          color: "#64748b"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            🔒 Paiement sécurisé
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            🚚 Livraison rapide
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            🌱 Produits bio
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartMobile;

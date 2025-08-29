import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js';

const UniversalPaymentForm = ({ 
  totalAmount, 
  onPaymentSuccess, 
  onPaymentError, 
  loading = false 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🔵 handleSubmit appelé (Universal Payment) !');
    
    if (!stripe || !elements) {
      console.log('❌ Stripe ou Elements non disponible');
      setError('Stripe n\'est pas encore chargé. Veuillez patienter.');
      return false;
    }

    setIsProcessing(true);
    setError('');

    try {
      // 1. Créer un PaymentIntent côté backend
      const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';
      console.log('🔵 API_URL:', API_URL);
      console.log('🔵 Montant à payer:', totalAmount, '€ (soit', Math.round(totalAmount * 100), 'centimes)');
      
      const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // Convertir en centimes
          currency: 'eur'
        }),
      });

      const responseData = await response.json();
      console.log('🔵 Réponse create-payment-intent:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Erreur lors de la création du paiement');
      }

      const { client_secret } = responseData;

      if (!client_secret) {
        throw new Error('Erreur lors de la création du paiement');
      }

      // 2. Confirmer le paiement avec Stripe (CB, PayPal, Apple Pay, etc.)
      console.log('🔵 Confirmation du paiement avec client_secret:', client_secret);
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // Retour après PayPal
        },
        redirect: 'if_required' // Évite la redirection si ce n'est pas nécessaire
      });

      if (stripeError) {
        console.log('❌ Erreur Stripe:', stripeError);
        setError(stripeError.message);
        onPaymentError?.(stripeError);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 3. Succès !
        console.log('✅ Paiement réussi:', paymentIntent);
        onPaymentSuccess?.({
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        });
      } else {
        console.log('⚠️ Statut de paiement inattendu:', paymentIntent?.status);
        setError(`Statut de paiement inattendu: ${paymentIntent?.status || 'unknown'}`);
      }
    } catch (err) {
      console.log('❌ Erreur générale:', err);
      setError(err.message);
      onPaymentError?.(err);
    } finally {
      setIsProcessing(false);
    }
    
    return false;
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <PaymentElement 
          options={{
            fields: {
              billingDetails: 'never'
            },
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            }
          }}
        />
      </div>

      {error && (
        <div style={{ 
          color: '#ef4444', 
          marginBottom: 16, 
          padding: 12,
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || isProcessing || loading}
        style={{
          width: '100%',
          padding: 16,
          backgroundColor: isProcessing || loading ? '#d1d5db' : '#22C55E',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: isProcessing || loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {isProcessing ? 'Traitement...' : `Payer ${totalAmount.toFixed(2)}€`}
      </button>
    </div>
  );
};

export default UniversalPaymentForm;

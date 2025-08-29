import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';

const StripePaymentForm = ({ 
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
    
    console.log('🔵 handleSubmit appelé !'); // Debug
    
    if (!stripe || !elements) {
      console.log('❌ Stripe ou Elements non disponible');
      setError('Stripe n\'est pas encore chargé. Veuillez patienter.');
      return;
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

      const { client_secret, payment_intent_id } = responseData;

      if (!client_secret) {
        throw new Error('Erreur lors de la création du paiement');
      }

      // 2. Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardNumberElement);
      
      console.log('🔵 Confirmation du paiement avec client_secret:', client_secret);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: cardElement,
          }
        }
      );

      if (stripeError) {
        console.log('❌ Erreur Stripe:', stripeError);
        setError(stripeError.message);
        onPaymentError?.(stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        // 3. Succès !
        console.log('✅ Paiement réussi:', paymentIntent);
        onPaymentSuccess?.({
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        });
      } else {
        console.log('⚠️ Statut de paiement inattendu:', paymentIntent.status);
        setError(`Statut de paiement inattendu: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.log('❌ Erreur générale:', err);
      setError(err.message);
      onPaymentError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          Numéro de carte
        </label>
        <div style={{ 
          padding: 12, 
          border: '1px solid #E5E7EB', 
          borderRadius: 8,
          backgroundColor: '#fff'
        }}>
          <CardNumberElement options={cardElementOptions} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Expiration
          </label>
          <div style={{ 
            padding: 12, 
            border: '1px solid #E5E7EB', 
            borderRadius: 8,
            backgroundColor: '#fff'
          }}>
            <CardExpiryElement options={cardElementOptions} />
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            CVC
          </label>
          <div style={{ 
            padding: 12, 
            border: '1px solid #E5E7EB', 
            borderRadius: 8,
            backgroundColor: '#fff'
          }}>
            <CardCvcElement options={cardElementOptions} />
          </div>
        </div>
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

export default StripePaymentForm;

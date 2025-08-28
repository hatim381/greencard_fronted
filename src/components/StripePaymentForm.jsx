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
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // 1. Créer un PaymentIntent côté backend
      const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';
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

      const { client_secret, payment_intent_id } = await response.json();

      if (!client_secret) {
        throw new Error('Erreur lors de la création du paiement');
      }

      // 2. Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardNumberElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: cardElement,
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onPaymentError?.(stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        // 3. Succès !
        onPaymentSuccess?.({
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        });
      }
    } catch (err) {
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
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
        type="submit"
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
    </form>
  );
};

export default StripePaymentForm;

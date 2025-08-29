import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import UniversalPaymentForm from './UniversalPaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QVLuKHdVA8ztx68x0bnFOh8NQ3NZNqcEUgmjwX1j8zH7X8LgwCQr6ZABs0kM6nJlttxSvM5LYzjLZk8n90QLlT600ZIbJJZaY');

const PayPalPaymentWrapper = ({ 
  totalAmount, 
  onPaymentSuccess, 
  onPaymentError, 
  loading = false 
}) => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  // Créer le PaymentIntent dès le chargement du composant
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'https://greencard-backend.onrender.com/api';
        console.log('🟡 Création PaymentIntent pour PayPal - Montant:', totalAmount, '€');
        
        const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100), // Convertir en centimes
            currency: 'eur',
            payment_method_types: ['paypal'], // Spécifier PayPal explicitement
            preferred_payment_method: 'paypal'
          }),
        });

        const responseData = await response.json();
        console.log('🟡 PaymentIntent créé:', responseData);

        if (!response.ok) {
          throw new Error(responseData.error || 'Erreur lors de la création du paiement');
        }

        if (responseData.client_secret) {
          setClientSecret(responseData.client_secret);
        } else {
          throw new Error('Pas de client_secret reçu');
        }
      } catch (err) {
        console.log('❌ Erreur création PaymentIntent:', err);
        setError('Erreur lors de l\'initialisation du paiement: ' + err.message);
        onPaymentError?.(err);
      }
    };

    if (totalAmount > 0) {
      createPaymentIntent();
    }
  }, [totalAmount, onPaymentError]);

  if (error) {
    return (
      <div style={{ 
        color: '#ef4444', 
        padding: 16, 
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        textAlign: 'center'
      }}>
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div>Initialisation du paiement PayPal...</div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
    paymentMethodTypes: ['paypal', 'card'], // Prioriser PayPal
    defaultValues: {
      paymentMethod: {
        type: 'paypal'
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <UniversalPaymentForm
        totalAmount={totalAmount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        loading={loading}
        clientSecret={clientSecret}
      />
    </Elements>
  );
};

export default PayPalPaymentWrapper;

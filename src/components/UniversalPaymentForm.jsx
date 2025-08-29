import React, { useState, useEffect } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js';

const UniversalPaymentForm = ({ 
  totalAmount, 
  onPaymentSuccess, 
  onPaymentError, 
  loading = false,
  clientSecret
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Vérifier le retour PayPal au chargement du composant
  useEffect(() => {
    if (!stripe) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');

    if (paymentIntentClientSecret) {
      console.log('🟡 Retour PayPal détecté avec clientSecret:', paymentIntentClientSecret);
      
      // Récupérer le PaymentIntent pour vérifier son statut
      stripe.retrievePaymentIntent(paymentIntentClientSecret).then(({ paymentIntent }) => {
        console.log('🟡 PaymentIntent récupéré au retour:', paymentIntent);
        
        if (paymentIntent.status === 'succeeded') {
          console.log('✅ Paiement PayPal confirmé au retour !');
          onPaymentSuccess?.({
            payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            status: paymentIntent.status
          });
          
          // Nettoyer l'URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.log('⚠️ Statut PaymentIntent au retour:', paymentIntent.status);
          setError(`Paiement PayPal ${paymentIntent.status}`);
        }
      }).catch((err) => {
        console.log('❌ Erreur récupération PaymentIntent:', err);
        setError('Erreur lors de la vérification du paiement PayPal');
        onPaymentError?.(err);
      });
    }
  }, [stripe, onPaymentSuccess, onPaymentError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🟡 handleSubmit PayPal appelé !');
    
    if (!stripe || !elements) {
      console.log('❌ Stripe ou Elements non disponible');
      setError('Stripe n\'est pas encore chargé. Veuillez patienter.');
      return false;
    }

    if (!clientSecret) {
      console.log('❌ Pas de clientSecret disponible');
      setError('Paiement non initialisé. Veuillez patienter ou recharger la page.');
      return false;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Confirmer le paiement avec Stripe (CB, PayPal, Apple Pay, etc.)
      console.log('🟡 Confirmation du paiement PayPal avec client_secret:', clientSecret);
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // Retour après PayPal
        },
        redirect: 'if_required' // Évite la redirection si ce n'est pas nécessaire
      });

      if (stripeError) {
        console.log('❌ Erreur Stripe PayPal:', stripeError);
        setError(stripeError.message);
        onPaymentError?.(stripeError);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Succès !
        console.log('✅ Paiement PayPal réussi:', paymentIntent);
        onPaymentSuccess?.({
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        });
      } else {
        console.log('⚠️ Statut de paiement PayPal inattendu:', paymentIntent?.status);
        setError(`Statut de paiement inattendu: ${paymentIntent?.status || 'unknown'}`);
      }
    } catch (err) {
      console.log('❌ Erreur générale PayPal:', err);
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
            wallets: {
              applePay: 'auto',
              googlePay: 'auto'
            },
            layout: {
              type: 'tabs',
              defaultCollapsed: false
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
        disabled={!stripe || isProcessing || loading || !clientSecret}
        style={{
          width: '100%',
          padding: 16,
          backgroundColor: isProcessing || loading ? '#d1d5db' : '#0070BA',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: isProcessing || loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {isProcessing ? 'Traitement...' : `Payer ${totalAmount.toFixed(2)}€ avec PayPal`}
      </button>
    </div>
  );
};

export default UniversalPaymentForm;

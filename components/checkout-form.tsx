'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  createCheckoutSession,
  checkPaymentStatus,
} from '@/app/[locale]/actions/stripe';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function CheckoutForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchClientSecret = useCallback(async () => {
    try {
      const secret = await createCheckoutSession();
      setClientSecret(secret);
      return secret;
    } catch (err) {
      console.error('[v0] Error creating checkout session:', err);
      setError('Failed to initialize checkout. Please try again.');
      throw err;
    }
  }, []);

  // Poll for payment completion
  useEffect(() => {
    if (!clientSecret) return;

    const sessionId = clientSecret.split('_secret_')[0];

    const checkStatus = async () => {
      try {
        const result = await checkPaymentStatus(sessionId);
        if (result.status === 'complete') {
          router.push(`/order-confirmation?session_id=${sessionId}`);
        }
      } catch (err) {
        console.error('[v0] Error checking payment status:', err);
      }
    };

    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [clientSecret, router]);

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <p className="text-destructive font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

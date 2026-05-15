import { stripe } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/products';

export const metadata = {
  title: 'Order Confirmed - Drunken Arsenal',
  description: 'Your order has been confirmed',
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-destructive">Invalid order confirmation link</p>
          </div>
        </div>
      </div>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('[v0] Error retrieving session:', error);
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-destructive">Failed to load order details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Mission Accomplished!</h1>
            <p className="text-lg text-muted-foreground">
              Your order has been confirmed and is being prepared for
              deployment.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div className="flex items-start gap-4">
              <Package className="h-6 w-6 text-primary mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Order Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono">
                      {sessionId.slice(-12).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{session.customer_details?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold">
                      {formatPrice(session.amount_total || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    You'll receive an order confirmation email at{' '}
                    {session.customer_details?.email}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Your tactical gear will be prepared and packaged</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>We'll send you tracking information once shipped</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Estimated delivery: 3-5 business days</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="flex-1">
              <Link href="/how-to-play">Learn How to Play</Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about your order? Contact us at
              support@drunkenarsenal.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

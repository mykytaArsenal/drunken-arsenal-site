import { getCart } from '@/lib/cart';
import { redirect } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout-form';

export const metadata = {
  title: 'Checkout - Drunken Arsenal',
  description: 'Complete your order',
};

export default async function CheckoutPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
            <p className="text-sm font-bold text-destructive text-center">
              By proceeding, you confirm you are 18+ and will drink responsibly
            </p>
          </div>

          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}

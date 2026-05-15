import { getCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';
import { CartItemComponent } from '@/components/cart-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon, ShoppingBagIcon } from '@/components/icons';
import { getCurrency } from '@/lib/currency/get-currency';

export const metadata = {
  title: 'Shopping Cart - Drunken Arsenal',
  description: 'Review your tactical gear before deployment',
};

export default async function CartPage() {
  const cart = await getCart();
  const currency = await getCurrency();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <ShoppingBagIcon className="h-24 w-24 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Your Arsenal is Empty</h1>
            <p className="text-lg text-muted-foreground">
              Time to stock up on tactical drinking gear for your next mission.
            </p>
            <Button size="lg" asChild>
              <Link href="/">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const shipping = subtotal >= 5000 ? 0 : 500; // Free shipping over $50
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  currency={currency}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted rounded-lg p-6 space-y-4 sticky top-20">
                <h2 className="text-2xl font-bold">Order Summary</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shipping, currency)
                      )}
                    </span>
                  </div>
                  {subtotal < 5000 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(5000 - subtotal, currency)} more for free
                      shipping
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

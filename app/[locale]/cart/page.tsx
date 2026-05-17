import { getCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';
import { CartItemComponent } from '@/components/cart-item';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ArrowLeftIcon, ShoppingBagIcon } from '@/components/icons';
import { getCurrency } from '@/lib/currency/get-currency';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Shopping Cart',
  description: 'Review your tactical kit before deployment',
};

export default async function CartPage() {
  const cart = await getCart();
  const currency = await getCurrency();
  const t = await getTranslations('cart');

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16 md:py-24 bg-paper">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto pop-card p-10 text-center space-y-6">
            <ShoppingBagIcon className="h-20 w-20 mx-auto text-olive" />
            <div className="space-y-3">
              <span className="tag-line">// status: empty crate</span>
              <h1 className="font-display text-3xl md:text-4xl text-ink leading-none">
                {t('empty')}
              </h1>
              <p className="font-stamp text-base text-ink/70 max-w-lg mx-auto">
                {t('emptyDesc')}
              </p>
            </div>
            <Button size="lg" variant="primary" asChild>
              <Link href="/">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                {t('continueShopping')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const shipping = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-10 md:py-12 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end gap-6 mb-10">
            <div className="phase-number">CART</div>
            <div>
              <div className="tag-line">// supply manifest</div>
              <h1 className="font-display text-3xl md:text-4xl text-ink leading-none">
                {t('title')}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {cart.items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  currency={currency}
                />
              ))}
            </div>

            <aside className="lg:col-span-1">
              <div className="pop-card-dark p-6 space-y-5 sticky top-24">
                <div>
                  <div className="tag-line text-amber mb-1">// summary</div>
                  <h2 className="font-display text-2xl text-cream">
                    {t('orderSummary')}
                  </h2>
                </div>

                <div className="space-y-2 font-stamp text-sm">
                  <div className="flex justify-between">
                    <span className="text-cream-warm">{t('subtotal')}</span>
                    <span className="text-cream font-mono-c">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-warm">{t('shipping')}</span>
                    <span className="font-mono-c">
                      {shipping === 0 ? (
                        <span className="text-allowed font-display">
                          {t('free')}
                        </span>
                      ) : (
                        <span className="text-cream">
                          {formatPrice(shipping, currency)}
                        </span>
                      )}
                    </span>
                  </div>
                  {subtotal < 5000 && (
                    <p className="text-xs text-amber pt-1">
                      {t('addForFreeShipping', {
                        amount: formatPrice(5000 - subtotal, currency),
                      })}
                    </p>
                  )}
                </div>

                <div className="border-t-2 border-amber/30 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-lg text-cream">
                      {t('total')}
                    </span>
                    <span className="font-display text-2xl text-amber">
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                </div>

                <Button size="lg" variant="amber" className="w-full" asChild>
                  <Link href="/checkout">{t('proceedToCheckout')}</Link>
                </Button>

                <Button
                  size="md"
                  variant="ghost"
                  className="w-full text-cream media-hover:hover:bg-olive media-hover:hover:text-amber"
                  asChild
                >
                  <Link href="/">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    {t('continueShopping')}
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

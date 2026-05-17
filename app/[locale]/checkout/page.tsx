import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowLeftIcon } from '@/components/icons';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your tactical mission',
};

export default async function CheckoutPage() {
  const t = await getTranslations('checkout');

  return (
    <div className="min-h-screen py-16 md:py-24 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="stripes-warning p-1 mb-8">
            <div className="bg-ink px-5 py-3 text-center">
              <span className="font-display text-amber tracking-wider text-sm">
                // status: standby
              </span>
            </div>
          </div>

          <div className="pop-card p-8 md:p-10 text-center space-y-6">
            <span className="stamp text-sm">Classified</span>
            <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight">
              {t('comingSoonTitle')}
            </h1>
            <p className="font-stamp text-base text-ink/70 max-w-lg mx-auto">
              {t('comingSoonDesc')}
            </p>
            <Button size="lg" variant="primary" asChild>
              <Link href="/cart">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                {t('backToCart')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

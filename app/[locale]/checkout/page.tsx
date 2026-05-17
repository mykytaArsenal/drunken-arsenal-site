import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowLeftIcon } from '@/components/icons';

export const metadata = {
  title: 'Checkout - Drunken Arsenal',
  description: 'Complete your order',
};

export default async function CheckoutPage() {
  const t = await getTranslations('checkout');

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">{t('comingSoonTitle')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('comingSoonDesc')}
          </p>
          <Button size="lg" asChild>
            <Link href="/cart">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {t('backToCart')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
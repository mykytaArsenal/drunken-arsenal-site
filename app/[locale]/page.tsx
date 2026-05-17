import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from '@/components/icons';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '@/app/[locale]/main/HeroSection';
import { Products } from '@/app/[locale]/main/Products';
import { AboutUs } from '@/app/[locale]/main/AboutUs';
import { getAllProducts } from '@/lib/products';
import { getCurrency } from '@/lib/currency/get-currency';
import { FREE_SHIPPING_THRESHOLD, PRODUCT_NAME } from '@/lib/i18n/brand';

export default async function HomePage() {
  const products = await getAllProducts();
  const currency = await getCurrency();
  const t = await getTranslations('home');

  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      <AboutUs />
      <Products products={products} currency={currency} />

      <section className="relative">
        <div className="panel-divider" />
        <div className="bg-olive-deep text-cream py-16 md:py-24 relative overflow-hidden">
          <div className="halftone-bg absolute inset-0 opacity-25 pointer-events-none" />
          <div className="relative container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 flex flex-col items-center">
              <span className="tag-line text-amber">// final briefing</span>
              <h2 className="font-display-shade text-4xl md:text-6xl leading-none">
                {t('ctaTitle')}
              </h2>
              <p className="font-stamp text-lg text-cream-warm max-w-2xl">
                {t('ctaSubtitle', {
                  productName: PRODUCT_NAME,
                  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
                })}
              </p>
              <Button size="xl" variant="amber" asChild>
                <Link href="#products">
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  {t('startShopping')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

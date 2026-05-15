import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon } from '@/components/icons';
import { HeroSection } from '@/app/[locale]/main/HeroSection';
import { Products } from '@/app/[locale]/main/Products';
import { getAllProducts } from '@/lib/products';
import { getCurrency } from '@/lib/currency/get-currency';
import { AboutUs } from '@/app/[locale]/main/AboutUs';

export default async function HomePage() {
  const products = await getAllProducts();
  const currency = await getCurrency();
  return (
    <div className="min-h-screen w-full">
      <div>
        <HeroSection />
        <div>
          <AboutUs />
        </div>
        {/* Featured Products */}
        <div className="mx-auto">
          <Products products={products} currency={currency} />
        </div>
        {/* CTA Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready for Battle?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of party commanders who have deployed Shot Wave
                at their gatherings. Free shipping on orders over $50.
              </p>
              <Button size="lg" asChild>
                <Link href="#products">
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

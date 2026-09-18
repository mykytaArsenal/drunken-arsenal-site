import { HeroSection } from '@/app/[locale]/main/HeroSection';
import { Products } from '@/app/[locale]/main/Products';
import { LaunchSignup } from '@/app/[locale]/main/LaunchSignup';
import { getAllProducts } from '@/lib/products';
import { getCurrency } from '@/lib/currency/getCurrency';

export default async function HomePage() {
  const products = await getAllProducts();
  const currency = await getCurrency();

  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      <Products products={products} currency={currency} />
      <LaunchSignup />
    </main>
  );
}

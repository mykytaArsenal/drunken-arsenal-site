import { notFound } from 'next/navigation';
import { formatPrice, getAllProducts, getProductBySlug } from '@/lib/products';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  PackageIcon,
  ShieldIcon,
  TruckIcon,
} from '@/components/icons';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getCurrency } from '@/lib/currency/get-currency';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/i18n/brand';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Item Not Found',
    };
  }

  return {
    title: `${product.name} | Drunken Arsenal`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const currency = await getCurrency();
  const t = await getTranslations();

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getAllProducts())
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-8 md:py-12 bg-paper">
      <div className="container mx-auto px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {t('product.backToShop')}
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="space-y-4">
            <div className="pop-card aspect-square overflow-hidden">
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="pop-card aspect-square overflow-hidden"
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${product.name} ${index + 2}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="ribbon text-xs">{product.category}</span>
              {product.category === 'bundle' && (
                <span className="stamp text-xs">{t('product.saveUpTo')}</span>
              )}
            </div>

            <div>
              <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink mb-4 text-balance">
                {product.name}
              </h1>
              <p className="font-display text-3xl text-rust-bright">
                {formatPrice(product.price, currency)}
              </p>
            </div>

            <p className="font-stamp text-base text-ink/80 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 font-mono-c text-sm uppercase tracking-wider">
              <PackageIcon className="h-4 w-4" />
              <span
                className={
                  product.stock > 0
                    ? 'text-allowed font-medium'
                    : 'text-rust-bright font-medium'
                }
              >
                {product.stock > 0
                  ? `${product.stock} ${t('product.readyToShip')}`
                  : t('home.outOfStock')}
              </span>
            </div>

            <div className="pt-2">
              <AddToCartButton product={product} />
            </div>

            <div className="pop-card-dark p-5 space-y-4">
              <div className="font-stamp text-xs uppercase tracking-[0.15em] text-amber">
                // standard issue
              </div>
              <div className="flex items-start gap-3">
                <TruckIcon className="h-5 w-5 text-amber mt-0.5" />
                <div>
                  <p className="font-display text-sm text-cream">
                    {t('product.freeShipping')}
                  </p>
                  <p className="font-stamp text-xs text-cream-warm">
                    {t('product.freeShippingDesc', {
                      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldIcon className="h-5 w-5 text-amber mt-0.5" />
                <div>
                  <p className="font-display text-sm text-cream">
                    {t('product.quality')}
                  </p>
                  <p className="font-stamp text-xs text-cream-warm">
                    {t('product.qualityDesc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PackageIcon className="h-5 w-5 text-amber mt-0.5" />
                <div>
                  <p className="font-display text-sm text-cream">
                    {t('product.returns')}
                  </p>
                  <p className="font-stamp text-xs text-cream-warm">
                    {t('product.returnsDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="stripes-warning p-1">
              <div className="bg-ink p-4 text-center">
                <p className="font-display text-sm text-amber tracking-wider">
                  {t('product.ageWarningFull')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="pt-12">
            <div className="flex items-end gap-6 mb-8">
              <div className="phase-number">04</div>
              <div>
                <div className="tag-line">// also recon</div>
                <h2 className="font-display text-3xl text-ink leading-none">
                  {t('product.youMayLike')}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group block"
                >
                  <article className="pop-card overflow-hidden transition-transform duration-150 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[8px_8px_0_var(--color-ink)]">
                    <div className="aspect-square bg-cream-warm relative overflow-hidden border-b-[3px] border-ink">
                      <img
                        src={relatedProduct.images[0] || '/placeholder.svg'}
                        alt={relatedProduct.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base text-ink uppercase line-clamp-1">
                          {relatedProduct.name}
                        </h3>
                        <p className="font-display text-base text-rust-bright whitespace-nowrap">
                          {formatPrice(relatedProduct.price, currency)}
                        </p>
                      </div>
                      <p className="font-stamp text-xs text-ink/70 line-clamp-2">
                        {relatedProduct.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

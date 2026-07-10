import { notFound } from 'next/navigation';
import {
  formatPrice,
  getAllProducts,
  getProductBySlug,
  PLACEHOLDER_IMAGE,
} from '@/lib/products';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductGallery } from '@/components/ProductGallery';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  PackageIcon,
  ShieldIcon,
  TruckIcon,
} from '@/components/Icons';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getCurrency } from '@/lib/currency/getCurrency';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/i18n/brand';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/SectionHeader';
import Image from 'next/image';

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
  const [product, currency, t, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getCurrency(),
    getTranslations(),
    getAllProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const standardIssue = [
    {
      icon: TruckIcon,
      title: t('product.freeShipping'),
      description: t('product.freeShippingDesc', {
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      }),
    },
    {
      icon: ShieldIcon,
      title: t('product.quality'),
      description: t('product.qualityDesc'),
    },
    {
      icon: PackageIcon,
      title: t('product.returns'),
      description: t('product.returnsDesc'),
    },
  ];

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
          <ProductGallery images={product.images} name={product.name} />

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
                className={cn(
                  'font-medium',
                  product.stock > 0 ? 'text-allowed' : 'text-rust-bright'
                )}
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
              {standardIssue.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-amber mt-0.5" />
                  <div>
                    <p className="font-display text-sm text-cream">{title}</p>
                    <p className="font-stamp text-xs text-cream-warm">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
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
            <SectionHeader
              phase="04"
              tag="// also recon"
              title={t('product.youMayLike')}
              className="mb-8"
              titleClassName="font-display text-3xl leading-none text-ink"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group block"
                >
                  <article className="pop-card overflow-hidden transition-transform duration-150 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[8px_8px_0_var(--color-ink)]">
                    <div className="aspect-square bg-cream-warm relative overflow-hidden border-b-[3px] border-ink">
                      <Image
                        src={relatedProduct.images[0] || PLACEHOLDER_IMAGE}
                        alt={relatedProduct.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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

'use client';

import { formatPrice, type IProduct } from '@/lib/products';
import type { ICurrency } from '@/lib/currency/config';
import { useTranslations } from 'next-intl';
import { NotifyMeDialog } from '@/components/NotifyMeDialog';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

type IProductsProps = {
  products: IProduct[];
  currency: ICurrency;
};

const CARD_CLASS =
  'group text-left pop-card overflow-hidden transition-transform duration-150 media-hover:hover:-translate-x-[2px] media-hover:hover:-translate-y-[2px] media-hover:hover:shadow-[8px_8px_0_var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-bright focus-visible:ring-offset-2';

function ProductCard({
  product,
  currency,
  featured = false,
}: {
  product: IProduct;
  currency: ICurrency;
  featured?: boolean;
}) {
  const t = useTranslations();

  const priceLabel = product.available
    ? formatPrice(product.price, currency)
    : t('home.comingSoon');

  const inner = featured ? (
    <>
      <div className="aspect-square bg-cream-warm relative overflow-hidden border-b-[3px] border-ink">
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.category === 'bundle' && (
          <span className="absolute top-3 right-3 ribbon text-xs">
            {t('home.bundle')}
          </span>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-ink uppercase leading-tight">
            {product.name}
          </h3>
          <p className="font-display text-base text-rust-bright whitespace-nowrap uppercase tracking-wider">
            {priceLabel}
          </p>
        </div>
        <p className="font-stamp text-sm text-ink/70 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2 font-mono-c text-xs uppercase tracking-wider">
          <span className="inline-block w-2 h-2 bg-amber" aria-hidden />
          <span className="text-amber-deep">
            {product.available
              ? t('product.addToCart')
              : t('home.earlyBirdOffer')}
          </span>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="aspect-square bg-cream-warm relative overflow-hidden border-b-[3px] border-ink">
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base text-ink uppercase line-clamp-1">
            {product.name}
          </h3>
          <p className="font-display text-xs text-rust-bright whitespace-nowrap uppercase tracking-wider">
            {priceLabel}
          </p>
        </div>
        <p className="font-stamp text-xs text-ink/70 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2 font-mono-c text-[0.65rem] uppercase tracking-wider text-amber-deep">
          <span className="inline-block w-1.5 h-1.5 bg-amber" aria-hidden />
          <span>
            {product.available
              ? t('product.addToCart')
              : t('home.earlyBirdOffer')}
          </span>
        </div>
      </div>
    </>
  );

  if (product.available) {
    return (
      <Link href={`/product/${product.slug}`} className={`block ${CARD_CLASS}`}>
        {inner}
      </Link>
    );
  }

  return (
    <NotifyMeDialog
      source={`product:${product.slug}`}
      productName={product.name}
    >
      <button type="button" className={CARD_CLASS}>
        {inner}
      </button>
    </NotifyMeDialog>
  );
}

export function Products({ products, currency }: IProductsProps) {
  const t = useTranslations();

  const featured = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured);

  return (
    <section id="products" className="relative bg-cream-warm/40">
      <div className="panel-divider" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16 md:py-20 flex flex-col gap-12">
        <div className="flex items-end gap-6">
          <div className="phase-number">02</div>
          <div>
            <div className="tag-line">// inventory</div>
            <h2 className="font-display text-3xl md:text-4xl leading-none text-ink">
              {t('home.featuredTitle')}
            </h2>
            <p className="mt-2 font-stamp text-sm text-ink/70 max-w-xl">
              {t('home.featuredSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              featured
            />
          ))}
        </div>

        {rest.length > 0 && (
          <>
            <div className="flex items-end gap-6 pt-6">
              <div className="phase-number">03</div>
              <div>
                <div className="tag-line">// full kit</div>
                <h2 className="font-display text-3xl md:text-4xl leading-none text-ink">
                  {t('home.completeArsenal')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rest.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

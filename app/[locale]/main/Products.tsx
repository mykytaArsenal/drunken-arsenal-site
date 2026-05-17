'use client';

import Link from 'next/link';
import { formatPrice, type IProduct } from '@/lib/products';
import { useTranslations } from 'next-intl';
import type { ICurrency } from '@/lib/currency/config';

type IProductsProps = {
  products: IProduct[];
  currency: ICurrency;
};

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
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group block"
            >
              <article className="pop-card overflow-hidden transition-transform duration-150 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[8px_8px_0_var(--color-ink)]">
                <div className="aspect-square bg-cream-warm relative overflow-hidden border-b-[3px] border-ink">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
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
                    <p className="font-display text-xl text-rust-bright whitespace-nowrap">
                      {formatPrice(product.price, currency)}
                    </p>
                  </div>
                  <p className="font-stamp text-sm text-ink/70 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 font-mono-c text-xs uppercase tracking-wider">
                    <span
                      className="inline-block w-2 h-2 bg-allowed"
                      aria-hidden
                    />
                    <span
                      className={
                        product.stock > 0 ? 'text-allowed' : 'text-rust-bright'
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} ${t('home.inStock')}`
                        : t('home.outOfStock')}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
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
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block"
                >
                  <article className="pop-card overflow-hidden transition-transform duration-150 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[8px_8px_0_var(--color-ink)]">
                    <div className="aspect-square bg-cream-warm relative overflow-hidden border-b-[3px] border-ink">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base text-ink uppercase line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="font-display text-base text-rust-bright whitespace-nowrap">
                          {formatPrice(product.price, currency)}
                        </p>
                      </div>
                      <p className="font-stamp text-xs text-ink/70 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

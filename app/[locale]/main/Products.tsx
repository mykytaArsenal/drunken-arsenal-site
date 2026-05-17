'use client';

import Link from 'next/link';
import { formatPrice, Product } from '@/lib/products';
import { useTranslations } from 'next-intl';
import type { Currency } from '@/lib/currency/config';

type IProductsProps = {
  products: Product[];
  currency: Currency;
};

export function Products({ products, currency }: IProductsProps) {
  const t = useTranslations();

  const featured = products.filter((p) => p.featured);

  return (
    <div id="products" className="bg-primary-foreground min-h-screen">
      <div className="p-16 flex flex-col items-center gap-10">
        <div className="text-center flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('home.featuredTitle')}
          </h2>
          <p className="text-lg max-w-2xl">{t('home.featuredSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group block"
            >
              <div className="bg-card border rounded-lg overflow-hidden hover:border-primary transition-colors">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.category === 'bundle' && (
                    <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm font-bold">
                      BUNDLE
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold whitespace-nowrap">
                      {formatPrice(product.price, currency)}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        product.stock > 0
                          ? 'text-green-600'
                          : 'text-destructive'
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Products */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Arsenal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products
            .filter((p) => !p.featured)
            .map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group block"
              >
                <div className="bg-card border rounded-lg overflow-hidden hover:border-primary transition-colors">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="font-bold whitespace-nowrap">
                        {formatPrice(product.price, currency)}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import type { IProduct } from '@/lib/products';
import type { ICurrency } from '@/lib/currency/config';
import { useTranslations } from 'next-intl';
import { NotifyMeDialog } from '@/components/NotifyMeDialog';
import Image from 'next/image';
import { PRODUCT_NAME } from '@/lib/i18n/brand';
import { ShotwaveShowcase } from '@/app/[locale]/main/ShotwaveShowcase';
import { SectionHeader } from '@/components/SectionHeader';
import { cn } from '@/lib/utils';
import {
  revealClass,
  STAMP_IN,
  useRevealOnScroll,
} from '@/hooks/useRevealOnScroll';

type IProductsProps = {
  products: IProduct[];
  currency: ICurrency;
};

const CARD_CLASS =
  'group flex flex-col text-left pop-card overflow-hidden transition-transform duration-150 media-hover:hover:-translate-x-[2px] media-hover:hover:-translate-y-[2px] media-hover:hover:shadow-[8px_8px_0_var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-bright focus-visible:ring-offset-2';

function ClassifiedPlaceholder() {
  const t = useTranslations('arsenal');
  const { ref, state } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-olive-dark flex flex-col items-center justify-center gap-4"
    >
      <div className="halftone-bg absolute inset-0 opacity-60" />
      <span
        className={cn(
          'stamp relative border-amber text-amber text-sm',
          revealClass(state, STAMP_IN)
        )}
      >
        {t('classified')}
      </span>
      <span className="relative font-stamp text-xs uppercase tracking-wider text-cream/70">
        {t('comingSoon')}
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: IProduct }) {
  const t = useTranslations();

  const name = t(`arsenal.items.${product.slug}.name`);
  const hasPhoto = Boolean(product.images[0]);

  return (
    <NotifyMeDialog source={`product:${product.slug}`} productName={name}>
      <button type="button" className={CARD_CLASS}>
        <div
          className={cn(
            'bg-cream-warm relative overflow-hidden border-b-[3px] border-ink',
            hasPhoto ? 'aspect-square' : 'aspect-video sm:aspect-square'
          )}
        >
          {hasPhoto ? (
            <Image
              src={product.images[0]}
              alt={name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ClassifiedPlaceholder />
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base text-ink uppercase">
              {name}
            </h3>
            <p className="font-display text-xs text-rust whitespace-nowrap uppercase tracking-wider">
              {t('home.comingSoon')}
            </p>
          </div>
          <p className="font-stamp text-xs text-ink/70">
            {t(`arsenal.items.${product.slug}.description`)}
          </p>
        </div>
      </button>
    </NotifyMeDialog>
  );
}

export function Products({ products, currency }: IProductsProps) {
  const t = useTranslations();

  const shotwave = products.find((p) => p.name === PRODUCT_NAME);
  const rest = products.filter((p) => p !== shotwave);

  return (
    <section id="products" className="relative bg-cream-warm/40">
      <div className="panel-divider" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16 md:py-20 flex flex-col gap-12">
        {shotwave && (
          <>
            <SectionHeader
              phase="01"
              tag="// flagship"
              title={shotwave.name}
              subtitle={t('shotwave.tagline')}
            />

            <ShotwaveShowcase product={shotwave} currency={currency} />
          </>
        )}

        {rest.length > 0 && (
          <>
            <SectionHeader
              id="coming-soon"
              phase="02"
              tag="// coming soon"
              title={t('arsenal.title')}
              className="pt-6 scroll-mt-24"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { ProductGallery } from '@/components/ProductGallery';
import {
  BlockTitle,
  EARLY_BIRD_OFFER,
  EarlyBirdButton,
  GameStats,
  QuickRules,
} from '@/components/ShotwaveParts';
import { formatPrice, type IProduct } from '@/lib/products';
import type { ICurrency } from '@/lib/currency/config';
import { EARLY_BIRD_DISCOUNT_PERCENT } from '@/lib/i18n/brand';
import { cn } from '@/lib/utils';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

type IRoadmapStatus = 'done' | 'current' | 'planned';

type IShotwaveShowcaseProps = {
  product: IProduct;
  currency: ICurrency;
};

const ROADMAP: { key: string; status: IRoadmapStatus }[] = [
  { key: 'development', status: 'done' },
  { key: 'now', status: 'current' },
  { key: 'printRun', status: 'planned' },
  { key: 'accessories', status: 'planned' },
  { key: 'expansion', status: 'planned' },
];

const TITLE_CLASS: Record<IRoadmapStatus, string> = {
  done: 'text-ink',
  current: 'text-rust',
  planned: 'text-ink/70',
};

const MARKER_CLASS: Record<IRoadmapStatus, string> = {
  done: 'bg-allowed',
  current: 'bg-rust-bright',
  planned: 'bg-cream',
};

function getEarlyBirdPrice(price: number) {
  return Math.round(price * (1 - EARLY_BIRD_DISCOUNT_PERCENT / 100));
}

function Roadmap() {
  const t = useTranslations('shotwave');
  const { ref, state } = useRevealOnScroll<HTMLOListElement>();

  return (
    <div className="space-y-4">
      <BlockTitle tag="operation log" title={t('roadmapTitle')} />

      <ol ref={ref} className="ml-2 border-l-4 border-ink/20 space-y-6">
        {ROADMAP.map(({ key, status }, index) => (
          <li key={key} className="relative pl-6">
            {status !== 'planned' && (
              <span
                aria-hidden
                className={cn(
                  'absolute -left-1 top-0 w-1 bg-allowed origin-top transition-transform duration-700 ease-out',
                  status === 'done' ? '-bottom-6' : 'h-3',
                  state === 'hidden' ? 'scale-y-0' : 'scale-y-100'
                )}
                style={{ transitionDelay: `${index * 700}ms` }}
              />
            )}
            {status === 'current' && (
              <span
                aria-hidden
                className="absolute -left-2.5 top-1 size-4 bg-rust-bright animate-ping"
              />
            )}
            <span
              aria-hidden
              className={cn(
                'absolute -left-2.5 top-1 size-4 border-2 border-ink',
                MARKER_CLASS[status]
              )}
            />
            <p className="font-stamp text-xs uppercase tracking-wider text-ink/70">
              {t(`roadmap.${key}.date`)}
            </p>
            <p className={cn('font-display text-lg', TITLE_CLASS[status])}>
              {t(`roadmap.${key}.title`)}
            </p>
            <p className="font-stamp text-sm text-ink/70">
              {t(`roadmap.${key}.text`)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function EarlyBirdOffer({ product, currency }: IShotwaveShowcaseProps) {
  const t = useTranslations('shotwave');

  return (
    <div className="space-y-4">
      <div>
        <p className="font-stamp text-xs uppercase tracking-wider text-ink/70">
          {t('earlyBirdPrice')}
        </p>
        <p className="font-display text-5xl text-rust-bright">
          {formatPrice(getEarlyBirdPrice(product.price), currency)}
        </p>
      </div>

      <div className="stripes-warning animate-hazard p-1">
        <p className="bg-ink p-4 text-center font-display text-lg text-amber">
          {t('earlyBirdOffer', EARLY_BIRD_OFFER)}
        </p>
      </div>

      <p className="font-stamp text-sm text-ink/70">
        {t('regularPrice', { price: formatPrice(product.price, currency) })}
      </p>

      <EarlyBirdButton
        source={`early-bird:${product.slug}`}
        className="w-full"
      />
    </div>
  );
}

export function ShotwaveShowcase({
  product,
  currency,
}: IShotwaveShowcaseProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div className="lg:sticky lg:top-24">
        <ProductGallery images={product.images} name={product.name} />
      </div>

      <div className="flex flex-col gap-10">
        <GameStats />
        <div className="lg:order-last">
          <EarlyBirdOffer product={product} currency={currency} />
        </div>
        <QuickRules />
        <Roadmap />
      </div>
    </div>
  );
}

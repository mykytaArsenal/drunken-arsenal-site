'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { NotifyMeDialog } from '@/components/NotifyMeDialog';
import { Button } from '@/components/ui/button';
import {
  EARLY_BIRD_DISCOUNT_PERCENT,
  EARLY_BIRD_LIMIT,
  PRODUCT_NAME,
} from '@/lib/i18n/brand';
import { cn } from '@/lib/utils';
import {
  revealClass,
  STAMP_IN,
  SLIDE_UP,
  useRevealOnScroll,
} from '@/hooks/useRevealOnScroll';

type IHeadingLevel = 'h2' | 'h3';

const RULE_STEPS = ['deploy', 'tactics', 'roll', 'drink', 'win'] as const;

const DICE_FACES = 12;
const DICE_RESULT = 7;
const DICE_ROLL_MS = 1200;
const DICE_TICK_MS = 90;

const DISCARD_CARD_CLASS =
  'w-8 h-11 border-2 border-ink bg-cream flex items-center justify-center text-lg';

export const EARLY_BIRD_OFFER = {
  limit: EARLY_BIRD_LIMIT,
  discount: EARLY_BIRD_DISCOUNT_PERCENT,
};

function rollDiceFace() {
  return Math.floor(Math.random() * DICE_FACES) + 1;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function BlockTitle({
  tag,
  title,
  as: Heading = 'h3',
}: {
  tag: string;
  title: string;
  as?: IHeadingLevel;
}) {
  return (
    <div>
      <div className="tag-line">// {tag}</div>
      <Heading className="font-display text-2xl text-ink">{title}</Heading>
    </div>
  );
}

export function GameStats() {
  const t = useTranslations('shotwave');
  const { ref, state } = useRevealOnScroll<HTMLUListElement>();

  return (
    <ul ref={ref} className="flex flex-wrap gap-2 sm:gap-3">
      {[t('players'), t('duration'), t('age')].map((stat, index) => (
        <li
          key={stat}
          className={cn(
            'stamp text-xs px-2 sm:px-6',
            revealClass(state, STAMP_IN)
          )}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {stat}
        </li>
      ))}
    </ul>
  );
}

function DiceDemo() {
  const { ref, state } = useRevealOnScroll<HTMLDivElement>();
  const [face, setFace] = useState(DICE_RESULT);
  const [isRolled, setIsRolled] = useState(false);

  useEffect(() => {
    if (state !== 'revealed') return;

    const rollMs = prefersReducedMotion() ? 0 : DICE_ROLL_MS;
    const tick = setInterval(() => setFace(rollDiceFace()), DICE_TICK_MS);
    const stop = setTimeout(() => {
      clearInterval(tick);
      setFace(DICE_RESULT);
      setIsRolled(true);
    }, rollMs);

    return () => {
      clearInterval(tick);
      clearTimeout(stop);
    };
  }, [state]);

  const cardsClass = () => {
    if (state === 'hidden') return 'opacity-0';
    if (state !== 'revealed') return undefined;
    return isRolled ? STAMP_IN : 'opacity-0';
  };

  return (
    <div
      ref={ref}
      aria-hidden
      className="px-4 pb-4 flex items-center gap-3 font-display"
    >
      <span className="pop-card-dark size-12 flex items-center justify-center text-xl text-amber">
        {face}
      </span>
      <span className="text-rust-bright">→</span>
      <span className={cn('flex items-center gap-2', cardsClass())}>
        <span className={DISCARD_CARD_CLASS}>3</span>+
        <span className={DISCARD_CARD_CLASS}>4</span>
      </span>
    </div>
  );
}

export function QuickRules({
  headingAs = 'h3',
}: {
  headingAs?: IHeadingLevel;
}) {
  const t = useTranslations('shotwave');
  const { ref, state } = useRevealOnScroll<HTMLOListElement>();

  return (
    <div className="space-y-4">
      <BlockTitle tag="field manual" title={t('rulesTitle')} as={headingAs} />

      <ol ref={ref} className="grid sm:grid-cols-2 gap-4">
        {RULE_STEPS.map((step, index) => (
          <li
            key={step}
            className={cn(
              'pop-card sm:last:col-span-2',
              revealClass(state, SLIDE_UP)
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-olive-deep text-amber px-4 py-2 flex items-center gap-3 font-display text-sm">
              <span className="text-cream/60">0{index + 1}</span>
              {t(`rules.${step}.title`)}
            </div>
            <p className="p-4 font-stamp text-sm leading-relaxed">
              {t(`rules.${step}.text`)}
            </p>
            {step === 'roll' && <DiceDemo />}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function EarlyBirdButton({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const t = useTranslations('shotwave');

  return (
    <NotifyMeDialog
      source={source}
      productName={PRODUCT_NAME}
      description={t('notifyDescription', EARLY_BIRD_OFFER)}
    >
      <Button size="xl" variant="primary" className={className}>
        {t('buyEarlyBird')}
      </Button>
    </NotifyMeDialog>
  );
}

import { getLocale, getTranslations } from 'next-intl/server';
import { PRODUCT_NAME } from '@/lib/i18n/brand';
import {
  BlockTitle,
  EarlyBirdButton,
  GameStats,
  QuickRules,
} from '@/components/ShotwaveParts';

export const metadata = {
  title: 'How to Play',
  description: 'Learn the rules of Shotwave — the tactical party game',
};

const manuals = [
  {
    locale: 'en',
    title: 'Field Manual',
    subtitle: 'SHOTWAVE Rules',
    href: '/rules/ShotWave_Rules_EN.html',
  },
  {
    locale: 'ru',
    title: 'Полевой устав',
    subtitle: 'Правила SHOTWAVE',
    href: '/rules/ShotWave_Rules_RU.html',
  },
] as const;

function currentLocaleFirst(locale: string) {
  return [
    ...manuals.filter((manual) => manual.locale === locale),
    ...manuals.filter((manual) => manual.locale !== locale),
  ];
}

export default async function HowToPlayPage() {
  const t = await getTranslations('howToPlay');
  const locale = await getLocale();

  return (
    <div className="min-h-screen py-12 md:py-16 bg-paper">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="tag-line">// operations manual</span>
            <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight">
              {t('title', { productName: PRODUCT_NAME })}
            </h1>
            <GameStats />
          </div>

          <QuickRules headingAs="h2" />

          <div className="space-y-4">
            <BlockTitle as="h2" tag="full manual" title={t('fullRules')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentLocaleFirst(locale).map((manual) => (
                <a
                  key={manual.locale}
                  href={manual.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop-card p-5 flex items-center gap-5 transition-transform media-hover:hover:-translate-y-1 media-hover:hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-rust-bright focus-visible:outline-offset-2"
                >
                  <span className="w-16 shrink-0 font-display text-4xl text-ink uppercase">
                    {manual.locale}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-ink uppercase leading-tight">
                      {manual.title}
                    </h3>
                    <p className="font-stamp text-sm text-ink/70">
                      {manual.subtitle}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="font-display text-2xl text-rust-bright"
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <EarlyBirdButton
              source="early-bird:how-to-play"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

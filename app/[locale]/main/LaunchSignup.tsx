import { getTranslations } from 'next-intl/server';
import { NotifyMeForm } from '@/components/NotifyMeDialog';
import {
  EARLY_BIRD_DISCOUNT_PERCENT,
  EARLY_BIRD_LIMIT,
} from '@/lib/i18n/brand';

export const LaunchSignup = async () => {
  const t = await getTranslations('launchSignup');

  const perks = [
    t('perks.earlyBird', {
      discount: EARLY_BIRD_DISCOUNT_PERCENT,
      limit: EARLY_BIRD_LIMIT,
    }),
    t('perks.recipes'),
    t('perks.news'),
  ];

  return (
    <section className="relative">
      <div className="panel-divider" />
      <div className="bg-olive-deep text-cream py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="tag-line text-amber">// final briefing</span>
            <h2 className="font-display-shade text-4xl md:text-6xl leading-none">
              {t('title')}
            </h2>
            <p className="font-stamp text-lg text-cream-warm">
              {t('subtitle')}
            </p>
            <ul className="space-y-2 font-stamp text-cream-warm">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <span
                    className="mt-2 inline-block w-2 h-2 shrink-0 bg-amber"
                    aria-hidden
                  />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="pop-card p-6">
            <NotifyMeForm source="cta:final-briefing" />
          </div>
        </div>
      </div>
    </section>
  );
};

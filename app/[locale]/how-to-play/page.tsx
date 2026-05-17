import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { UsersIcon, TargetIcon, TrophyIcon } from '@/components/icons';
import { getTranslations } from 'next-intl/server';
import { PRODUCT_NAME } from '@/lib/i18n/brand';

export const metadata = {
  title: 'How to Play',
  description: 'Learn the rules of Shot Wave — the tactical party game',
};

export default async function HowToPlayPage() {
  const t = await getTranslations('howToPlay');

  const steps = [
    {
      Icon: UsersIcon,
      title: t('step1Title'),
      desc: t('step1Desc'),
      number: '01',
    },
    {
      Icon: TargetIcon,
      title: t('step2Title'),
      desc: t('step2Desc'),
      number: '02',
    },
    {
      Icon: TrophyIcon,
      title: t('step3Title'),
      desc: t('step3Desc'),
      number: '03',
    },
  ];

  return (
    <div className="min-h-screen py-12 md:py-16 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="tag-line">// operations manual</span>
            <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight">
              {t('title', { productName: PRODUCT_NAME })}
            </h1>
            <p className="font-stamp text-base md:text-lg text-ink/70 max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            {steps.map(({ Icon, title, desc, number }) => (
              <div
                key={number}
                className="pop-card p-6 md:p-8 flex gap-5 items-start"
              >
                <div className="phase-number flex-shrink-0">{number}</div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-rust-bright border-2 border-ink">
                      <Icon className="h-5 w-5 text-cream" />
                    </div>
                    <h2 className="font-display text-xl md:text-2xl text-ink uppercase leading-tight">
                      {title}
                    </h2>
                  </div>
                  <p className="font-stamp text-base text-ink/80 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pop-card-dark p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="ribbon text-sm">{t('importantRules')}</span>
            </div>
            <ul className="space-y-3 font-stamp text-base text-cream-warm">
              <li className="flex items-start gap-3">
                <span className="text-amber font-display">·</span>
                <span>{t('rule1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber font-display">·</span>
                <span>{t('rule2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber font-display">·</span>
                <span>{t('rule3')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber font-display">·</span>
                <span>{t('rule4')}</span>
              </li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Button size="xl" variant="primary" asChild>
              <Link href="/#products">{t('getArsenal')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

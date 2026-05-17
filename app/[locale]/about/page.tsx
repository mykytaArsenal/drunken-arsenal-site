import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { HeartIcon, TargetIcon, UsersIcon } from '@/components/icons';
import { getTranslations } from 'next-intl/server';
import { BRAND } from '@/lib/i18n/brand';

export const metadata = {
  title: 'About',
  description: 'Learn about the Drunken Arsenal brand and mission',
};

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="min-h-screen py-12 md:py-16 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="tag-line">// brand dossier</span>
            <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight">
              {t('title', { brand: BRAND })}
            </h1>
            <p className="font-stamp text-base md:text-lg text-ink/70 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            <div className="pop-card p-6 md:p-8 flex gap-5 items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-rust-bright border-2 border-ink flex-shrink-0">
                <TargetIcon className="h-6 w-6 text-cream" />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="font-display text-xl md:text-2xl text-ink uppercase leading-tight">
                  {t('missionTitle')}
                </h2>
                <p className="font-stamp text-base text-ink/80 leading-relaxed">
                  {t('missionText')}
                </p>
              </div>
            </div>

            <div className="pop-card p-6 md:p-8 flex gap-5 items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-amber border-2 border-ink flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-ink" />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="font-display text-xl md:text-2xl text-ink uppercase leading-tight">
                  {t('teamTitle')}
                </h2>
                <p className="font-stamp text-base text-ink/80 leading-relaxed">
                  {t('teamText')}
                </p>
              </div>
            </div>

            <div className="pop-card p-6 md:p-8 flex gap-5 items-start">
              <div className="flex items-center justify-center w-12 h-12 bg-olive border-2 border-ink flex-shrink-0">
                <HeartIcon className="h-6 w-6 text-cream" />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="font-display text-xl md:text-2xl text-ink uppercase leading-tight">
                  {t('valuesTitle')}
                </h2>
                <div className="space-y-3 font-stamp text-base text-ink/80">
                  <p className="leading-relaxed">
                    <span className="font-display text-rust-bright">
                      {t('valueResponsibleFun')}:
                    </span>{' '}
                    {t('valueResponsibleFunText')}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-display text-rust-bright">
                      {t('valueQualityFirst')}:
                    </span>{' '}
                    {t('valueQualityFirstText')}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-display text-rust-bright">
                      {t('valueCommunity')}:
                    </span>{' '}
                    {t('valueCommunityText')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pop-card-dark p-8 text-center space-y-5">
            <span className="ribbon text-sm">{t('ctaRibbon')}</span>
            <h2 className="font-display text-2xl md:text-3xl text-cream uppercase">
              {t('ctaTitle')}
            </h2>
            <p className="font-stamp text-base text-cream-warm max-w-xl mx-auto">
              {t('ctaSubtitle')}
            </p>
            <Button size="lg" variant="amber" asChild>
              <Link href="/#products">{t('ctaButton')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-paper">
      <div className="max-w-md w-full">
        <div className="pop-card p-8 md:p-10 text-center space-y-6">
          <span className="stamp text-base mx-auto">Target Lost</span>

          <h1 className="font-display text-7xl md:text-8xl text-rust-bright leading-none">
            {t('title')}
          </h1>

          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight">
              {t('missionFailed')}
            </h2>
            <p className="font-stamp text-base text-ink/70">
              {t('description')}
            </p>
          </div>

          <Button size="lg" variant="primary" asChild>
            <Link href="/">{t('returnToBase')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

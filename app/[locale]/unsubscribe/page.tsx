import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribeToken';
import { BRAND } from '@/lib/i18n/brand';
import { confirmUnsubscribeAction } from './actions';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: `Unsubscribe from ${BRAND} emails.`,
  robots: { index: false, follow: false },
};

type IUnsubscribePageProps = {
  searchParams: Promise<{
    token?: string;
    status?: string;
    e?: string;
  }>;
};

const highlight = (chunks: React.ReactNode) => (
  <span className="font-display text-rust-bright break-all">{chunks}</span>
);

export default async function UnsubscribePage({
  searchParams,
}: IUnsubscribePageProps) {
  const { token, status, e } = await searchParams;
  const t = await getTranslations('unsubscribe');

  if (status === 'done') {
    return (
      <Shell tag={t('tagDone')}>
        <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
          {t('doneTitle')}
        </h1>
        <p className="font-stamp text-base text-ink/80 leading-relaxed">
          {e
            ? t.rich('doneWithEmail', { email: e, brand: BRAND, hl: highlight })
            : t('doneNoEmail', { brand: BRAND })}
        </p>
        <p className="font-stamp text-sm text-ink/60 leading-relaxed">
          {t('doneChangedMind')}
        </p>
        <HomeLink />
      </Shell>
    );
  }

  if (status === 'invalid' || !token) {
    return <InvalidLink showStuckNote />;
  }

  if (status === 'error') {
    return (
      <Shell tag={t('tagError')}>
        <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
          {t('errorTitle')}
        </h1>
        <p className="font-stamp text-base text-ink/80 leading-relaxed">
          {t('errorDesc')}
        </p>
        <ConfirmForm token={token} ctaLabel={t('tryAgain')} />
      </Shell>
    );
  }

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return <InvalidLink />;
  }

  return (
    <Shell tag={t('tagConfirm')}>
      <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
        {t('confirmTitle')}
      </h1>
      <p className="font-stamp text-base text-ink/80 leading-relaxed">
        {t.rich('confirmDesc', { email, brand: BRAND, hl: highlight })}
      </p>
      <p className="font-stamp text-sm text-ink/60 leading-relaxed">
        {t('confirmWarning')}
      </p>
      <ConfirmForm token={token} ctaLabel={t('confirmCta')} />
    </Shell>
  );
}

function Shell({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen py-12 md:py-20 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="pop-card p-8 md:p-12 space-y-5">
            <span className="tag-line">{tag}</span>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmForm({ token, ctaLabel }: { token: string; ctaLabel: string }) {
  return (
    <form action={confirmUnsubscribeAction} className="pt-2">
      <input type="hidden" name="token" value={token} />
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {ctaLabel}
      </Button>
    </form>
  );
}

async function HomeLink() {
  const t = await getTranslations('unsubscribe');
  return (
    <div className="pt-2">
      <Button asChild variant="outline" size="lg">
        <Link href="/">{t('backToHome')}</Link>
      </Button>
    </div>
  );
}

async function InvalidLink({
  showStuckNote = false,
}: {
  showStuckNote?: boolean;
}) {
  const t = await getTranslations('unsubscribe');
  return (
    <Shell tag={t('tagInvalid')}>
      <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
        {t('invalidTitle')}
      </h1>
      <p className="font-stamp text-base text-ink/80 leading-relaxed">
        {t('invalidDesc', { brand: BRAND })}
      </p>
      {showStuckNote && (
        <p className="font-stamp text-sm text-ink/60 leading-relaxed">
          {t.rich('invalidStuck', {
            cmd: (chunks) => <span className="font-display">{chunks}</span>,
          })}
        </p>
      )}
      <HomeLink />
    </Shell>
  );
}

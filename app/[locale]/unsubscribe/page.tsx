import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe-token';
import { BRAND } from '@/lib/i18n/brand';
import { confirmUnsubscribeAction } from './actions';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: `Unsubscribe from ${BRAND} emails.`,
  robots: { index: false, follow: false },
};

interface IUnsubscribePageProps {
  searchParams: Promise<{
    token?: string;
    status?: string;
    e?: string;
  }>;
}

export default async function UnsubscribePage({
  searchParams,
}: IUnsubscribePageProps) {
  const { token, status, e } = await searchParams;

  if (status === 'done') {
    return (
      <Shell tag="// stand-down confirmed">
        <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
          You're stood&nbsp;down.
        </h1>
        <p className="font-stamp text-base text-ink/80 leading-relaxed">
          {e ? (
            <>
              <span className="font-display text-rust-bright break-all">
                {e}
              </span>{' '}
              has been removed from the {BRAND} roster. You won't receive
              further emails from us.
            </>
          ) : (
            <>
              You've been removed from the {BRAND} roster. You won't receive
              further emails from us.
            </>
          )}
        </p>
        <p className="font-stamp text-sm text-ink/60 leading-relaxed">
          Changed your mind? You can sign up again on the homepage anytime.
        </p>
        <HomeLink />
      </Shell>
    );
  }

  if (status === 'invalid' || !token) {
    return (
      <Shell tag="// invalid link">
        <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
          Link looks off.
        </h1>
        <p className="font-stamp text-base text-ink/80 leading-relaxed">
          This unsubscribe link is missing, malformed, or expired. Open the most
          recent email from {BRAND} and click the link in the footer.
        </p>
        <p className="font-stamp text-sm text-ink/60 leading-relaxed">
          Still stuck? Reply to any email from us with the word{' '}
          <span className="font-display">UNSUBSCRIBE</span> and we'll handle it
          manually.
        </p>
        <HomeLink />
      </Shell>
    );
  }

  if (status === 'error') {
    return (
      <Shell tag="// transmission failed">
        <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
          Couldn't process that.
        </h1>
        <p className="font-stamp text-base text-ink/80 leading-relaxed">
          Something went sideways on our end. Try again in a moment — your link
          is still valid.
        </p>
        <ConfirmForm token={token} ctaLabel="Try again" />
      </Shell>
    );
  }

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return (
      <Shell tag="// invalid link">
        <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
          Link looks off.
        </h1>
        <p className="font-stamp text-base text-ink/80 leading-relaxed">
          This unsubscribe link is missing, malformed, or expired. Open the most
          recent email from {BRAND} and click the link in the footer.
        </p>
        <HomeLink />
      </Shell>
    );
  }

  return (
    <Shell tag="// stand down confirmation">
      <h1 className="font-display text-3xl md:text-5xl text-ink uppercase leading-tight">
        Stand down?
      </h1>
      <p className="font-stamp text-base text-ink/80 leading-relaxed">
        You're about to unsubscribe{' '}
        <span className="font-display text-rust-bright break-all">{email}</span>{' '}
        from all {BRAND} emails.
      </p>
      <p className="font-stamp text-sm text-ink/60 leading-relaxed">
        Heads up: you'll lose access to your early-bird discount and pre-launch
        perks. You can re-enlist anytime on the homepage.
      </p>
      <ConfirmForm token={token} ctaLabel="Confirm unsubscribe" />
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

function HomeLink() {
  return (
    <div className="pt-2">
      <Button asChild variant="outline" size="lg">
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}

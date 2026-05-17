import { stripe } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, PackageIcon } from '@/components/icons';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/products';
import { getTranslations } from 'next-intl/server';
import { SUPPORT_EMAIL } from '@/lib/i18n/brand';

export const metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been confirmed',
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const t = await getTranslations('order');

  if (!sessionId) {
    return (
      <div className="min-h-screen py-16 bg-paper">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto pop-card p-8 text-center">
            <p className="font-display text-rust-bright">
              Invalid order confirmation link
            </p>
          </div>
        </div>
      </div>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('[v0] Error retrieving session:', error);
    return (
      <div className="min-h-screen py-16 bg-paper">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto pop-card p-8 text-center">
            <p className="font-display text-rust-bright">
              Failed to load order details
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-allowed border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)]">
              <CheckCircleIcon className="h-10 w-10 text-cream" />
            </div>
            <span className="block stamp text-sm mx-auto">Status: Cleared</span>
            <h1 className="font-display text-3xl md:text-5xl text-ink leading-tight">
              {t('missionAccomplished')}
            </h1>
            <p className="font-stamp text-base text-ink/70 max-w-lg mx-auto">
              {t('confirmed')}
            </p>
          </div>

          <div className="pop-card p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <PackageIcon className="h-6 w-6 text-rust-bright mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="font-display text-xl text-ink uppercase mb-3">
                  {t('orderDetails')}
                </h2>
                <div className="space-y-2 font-mono-c text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-ink/60">{t('orderId')}</span>
                    <span className="text-ink font-bold">
                      {sessionId.slice(-12).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-ink/60">{t('email')}</span>
                    <span className="text-ink break-all">
                      {session.customer_details?.email}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-ink/60">{t('total')}</span>
                    <span className="font-display text-rust-bright">
                      {formatPrice(session.amount_total || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-ink/10 pt-6">
              <h3 className="font-display text-base text-ink uppercase mb-3">
                {t('whatNext')}
              </h3>
              <ul className="space-y-2 font-stamp text-sm text-ink/80">
                <li className="flex items-start gap-3">
                  <span className="font-display text-rust-bright">01</span>
                  <span>
                    {t('step1', {
                      email: session.customer_details?.email ?? '',
                    })}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-display text-rust-bright">02</span>
                  <span>{t('step2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-display text-rust-bright">03</span>
                  <span>{t('step3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-display text-rust-bright">04</span>
                  <span>{t('step4')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="primary" asChild className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="flex-1">
              <Link href="/how-to-play">Learn How to Play</Link>
            </Button>
          </div>

          <p className="mt-8 text-center font-stamp text-sm text-ink/60">
            {t('questions', { supportEmail: SUPPORT_EMAIL })}
          </p>
        </div>
      </div>
    </div>
  );
}

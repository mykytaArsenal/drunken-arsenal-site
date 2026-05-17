import { SignInForm } from '@/components/sign-in-form';
import { getCurrentUser } from '@/app/[locale]/actions/auth';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/account');
  }

  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen py-16 md:py-20 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="tag-line">// access point</span>
            <h1 className="font-display text-3xl md:text-4xl text-ink leading-none">
              {t('welcomeBack')}
            </h1>
            <p className="font-stamp text-sm text-ink/70">{t('signInDesc')}</p>
          </div>

          <div className="pop-card p-6 md:p-8">
            <SignInForm />

            <div className="mt-6 text-center font-stamp text-sm">
              <span className="text-ink/70">{t('noAccount')} </span>
              <Link
                href="/sign-up"
                className="text-rust-bright font-display tracking-wider uppercase hover:underline"
              >
                {t('signUp')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

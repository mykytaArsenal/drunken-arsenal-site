import { SignUpForm } from '@/components/sign-up-form';
import { getCurrentUser } from '@/app/[locale]/actions/auth';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Sign Up',
  description: 'Create your account',
};

export default async function SignUpPage() {
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
            <span className="tag-line">// new recruit</span>
            <h1 className="font-display text-3xl md:text-4xl text-ink leading-none">
              {t('joinArsenal')}
            </h1>
            <p className="font-stamp text-sm text-ink/70">{t('signUpDesc')}</p>
          </div>

          <div className="stripes-warning p-1 mb-6">
            <div className="bg-ink p-3 text-center">
              <p className="font-display text-sm text-amber tracking-wider">
                {t('mustBe18')}
              </p>
            </div>
          </div>

          <div className="pop-card p-6 md:p-8">
            <SignUpForm />

            <div className="mt-6 text-center font-stamp text-sm">
              <span className="text-ink/70">{t('haveAccount')} </span>
              <Link
                href="/sign-in"
                className="text-rust-bright font-display tracking-wider uppercase hover:underline"
              >
                {t('signIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

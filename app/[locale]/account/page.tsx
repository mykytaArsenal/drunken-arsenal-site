import { getCurrentUser, signOutAction } from '@/app/[locale]/actions/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserIcon, PackageIcon, LogOutIcon } from '@/components/icons';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'My Account',
  description: 'Manage your account',
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const t = await getTranslations('account');
  const tAuth = await getTranslations('auth');

  return (
    <div className="min-h-screen py-12 md:py-16 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-6 mb-10">
            <div className="phase-number">HQ</div>
            <div>
              <div className="tag-line">// commander profile</div>
              <h1 className="font-display text-3xl md:text-4xl text-ink leading-none">
                {t('title')}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="pop-card p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-amber border-2 border-ink">
                  <UserIcon className="h-6 w-6 text-ink" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl text-ink uppercase leading-tight">
                    {t('profile')}
                  </h2>
                  <p className="font-stamp text-xs text-ink/60 tracking-wider uppercase mt-1">
                    {t('profileDesc')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-mono-c text-sm">
                <div>
                  <p className="font-stamp text-xs text-ink/60 uppercase tracking-[0.15em]">
                    Name
                  </p>
                  <p className="font-display text-base text-ink">
                    {user.name || t('notSet')}
                  </p>
                </div>
                <div>
                  <p className="font-stamp text-xs text-ink/60 uppercase tracking-[0.15em]">
                    Email
                  </p>
                  <p className="font-display text-base text-ink break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="pop-card p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-rust-bright border-2 border-ink">
                  <PackageIcon className="h-6 w-6 text-cream" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl text-ink uppercase leading-tight">
                    {t('orders')}
                  </h2>
                  <p className="font-stamp text-xs text-ink/60 tracking-wider uppercase mt-1">
                    {t('ordersDesc')}
                  </p>
                </div>
              </div>

              <p className="font-stamp text-sm text-ink/70">
                {t('ordersInfo')}
              </p>

              <Button variant="outline" className="w-full" disabled>
                {t('viewOrders')}
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <form action={signOutAction}>
              <Button type="submit" variant="destructive" size="lg">
                <LogOutIcon className="mr-2 h-5 w-5" />
                {tAuth('signOut')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

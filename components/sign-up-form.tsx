'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { signUpAction } from '@/app/[locale]/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    undefined
  );
  const t = useTranslations('auth');

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="border-[3px] border-rust-bright bg-rust-bright/10 p-3 font-stamp text-sm text-rust">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Commander Name"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="commander@example.com"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isPending}
        />
        <p className="font-stamp text-xs text-ink/60">
          {t('passwordRequirement')}
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        variant="primary"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? t('creatingAccount') : t('createAccount')}
      </Button>
    </form>
  );
}

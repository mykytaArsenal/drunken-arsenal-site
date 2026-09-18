'use client';

import { useId, useState, useTransition, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InstagramIcon } from '@/components/Icons';
import { subscribe } from '@/app/[locale]/actions/subscribe';
import { useDisclosure } from '@/hooks/useDisclosure';
import { STAMP_IN } from '@/hooks/useRevealOnScroll';
import { INSTAGRAM_URL } from '@/lib/i18n/brand';
import { cn } from '@/lib/utils';

type INotifyMeFormProps = {
  source: string;
};

type INotifyMeDialogProps = {
  children: ReactNode;
  source: string;
  productName?: string;
  description?: string;
};

function EnlistedStamp() {
  const t = useTranslations('notify');

  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 py-6 text-center"
    >
      <span className={cn('stamp text-2xl', STAMP_IN)}>{t('enlisted')}</span>
      <p className="font-stamp text-sm text-ink/80">{t('success')}</p>
    </div>
  );
}

export function NotifyMeForm({ source }: INotifyMeFormProps) {
  const t = useTranslations('notify');
  const locale = useLocale();
  const emailId = useId();
  const errorId = `${emailId}-error`;
  const [pending, startTransition] = useTransition();
  const [isEnlisted, setIsEnlisted] = useState(false);

  const schema = z.object({
    email: z.string().trim().email(t('invalidEmail')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await subscribe({ email: data.email, locale, source });
      if (result.ok) {
        reset();
        setIsEnlisted(true);
      } else {
        toast.error(t('error'));
      }
    });
  });

  if (isEnlisted) return <EnlistedStamp />;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="space-y-2">
        <label
          htmlFor={emailId}
          className="font-stamp text-xs uppercase tracking-[0.15em] text-ink/80"
        >
          {t('emailLabel')}
        </label>
        <Input
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          disabled={pending}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? errorId : undefined}
          className="h-11 border-[3px] border-ink rounded-none bg-paper font-stamp text-ink shadow-[3px_3px_0_var(--color-ink)] focus-visible:ring-0 focus-visible:border-rust-bright"
          {...register('email')}
        />
        {errors.email && (
          <p id={errorId} role="alert" className="font-stamp text-xs text-rust">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        variant="primary"
        disabled={pending}
        className="w-full"
      >
        {pending ? t('submitting') : t('submit')}
      </Button>

      <p className="font-stamp text-[0.7rem] text-ink/60 tracking-wide">
        {t('privacyNote')}
      </p>
    </form>
  );
}

function InstagramAlternative() {
  const t = useTranslations('notify');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 font-stamp text-xs uppercase tracking-wider text-ink/70">
        <span className="h-0.5 flex-1 bg-ink/20" aria-hidden />
        {t('or')}
        <span className="h-0.5 flex-1 bg-ink/20" aria-hidden />
      </div>
      <p className="font-stamp text-sm text-ink/70 text-center">
        {t('instagramText')}
      </p>
      <Button asChild size="lg" variant="outline" className="w-full">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <InstagramIcon className="size-5" />
          {t('instagramButton')}
        </a>
      </Button>
    </div>
  );
}

export function NotifyMeDialog({
  children,
  source,
  productName,
  description,
}: INotifyMeDialogProps) {
  const t = useTranslations('notify');
  const { isOpen, open: openDialog, close: closeDialog } = useDisclosure();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => (next ? openDialog() : closeDialog())}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-cream border-[3px] border-ink rounded-none shadow-[6px_6px_0_var(--color-ink)] gap-5 text-ink">
        <DialogHeader className="gap-3">
          <span className="font-stamp text-[0.7rem] tracking-[0.2em] text-rust uppercase">
            // {t('tag')}
          </span>
          <DialogTitle className="font-display text-2xl uppercase leading-tight text-ink">
            {productName
              ? t('titleProduct', { product: productName })
              : t('title')}
          </DialogTitle>
          <DialogDescription className="font-stamp text-sm text-ink/70 leading-relaxed">
            {description ?? t('description')}
          </DialogDescription>
        </DialogHeader>

        <NotifyMeForm source={source} />
        <InstagramAlternative />
      </DialogContent>
    </Dialog>
  );
}

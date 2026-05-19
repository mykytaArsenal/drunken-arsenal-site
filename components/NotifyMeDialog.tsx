'use client';

import { useTransition, type ReactNode } from 'react';
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
import { subscribe } from '@/app/[locale]/actions/subscribe';
import { useDisclosure } from '@/hooks/useDisclosure';

interface INotifyMeDialogProps {
  children: ReactNode;
  source: string;
  productName?: string;
}

export function NotifyMeDialog({
  children,
  source,
  productName,
}: INotifyMeDialogProps) {
  const t = useTranslations('notify');
  const locale = useLocale();
  const { isOpen, open: openDialog, close: closeDialog } = useDisclosure();
  const [pending, startTransition] = useTransition();

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
        toast.success(t('success'));
        reset();
        closeDialog();
      } else {
        toast.error(t('error'));
      }
    });
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => (next ? openDialog() : closeDialog())}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-cream border-[3px] border-ink rounded-none shadow-[6px_6px_0_var(--color-ink)] gap-5 text-ink">
        <DialogHeader className="gap-3">
          <span className="font-stamp text-[0.7rem] tracking-[0.2em] text-rust-bright uppercase">
            // {t('tag')}
          </span>
          <DialogTitle className="font-display text-2xl uppercase leading-tight text-ink">
            {productName
              ? t('titleProduct', { product: productName })
              : t('title')}
          </DialogTitle>
          <DialogDescription className="font-stamp text-sm text-ink/70 leading-relaxed">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-3">
          <div className="space-y-2">
            <label
              htmlFor="notify-email"
              className="font-stamp text-xs uppercase tracking-[0.15em] text-ink/80"
            >
              {t('emailLabel')}
            </label>
            <Input
              id="notify-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              disabled={pending}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'notify-email-error' : undefined}
              className="h-11 border-[3px] border-ink rounded-none bg-paper font-stamp text-ink shadow-[3px_3px_0_var(--color-ink)] focus-visible:ring-0 focus-visible:border-rust-bright"
              {...register('email')}
            />
            {errors.email && (
              <p
                id="notify-email-error"
                role="alert"
                className="font-stamp text-xs text-rust-bright"
              >
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
      </DialogContent>
    </Dialog>
  );
}

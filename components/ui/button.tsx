import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-display uppercase tracking-wider',
    'border-[3px] border-ink',
    'shadow-[4px_4px_0_var(--color-ink)]',
    'transition-transform duration-100 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-ink)]',
    'media-hover:hover:-translate-x-[1px] media-hover:hover:-translate-y-[1px] media-hover:hover:shadow-[5px_5px_0_var(--color-ink)]',
    'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-[4px_4px_0_var(--color-ink)] disabled:translate-x-0 disabled:translate-y-0',
    'outline-none focus-visible:ring-[3px] focus-visible:ring-amber/70 focus-visible:ring-offset-2',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-rust-bright text-cream',
        primary: 'bg-rust-bright text-cream',
        accent: 'bg-amber text-ink',
        secondary: 'bg-olive text-cream',
        destructive: 'bg-rust text-cream',
        outline: 'bg-cream text-ink',
        ghost:
          'bg-transparent text-ink border-transparent shadow-none media-hover:hover:bg-cream-warm media-hover:hover:shadow-none active:translate-x-0 active:translate-y-0 active:shadow-none active:bg-cream-warm',
        link: 'bg-transparent text-rust-bright border-transparent shadow-none underline-offset-4 media-hover:hover:underline media-hover:hover:shadow-none active:translate-x-0 active:translate-y-0 active:shadow-none p-0 h-auto',
        shop: 'bg-cream text-ink',
        transparent:
          'bg-transparent border-transparent shadow-none rounded-none active:translate-x-0 active:translate-y-0 active:shadow-none p-0 h-auto',
        gradient: 'bg-amber text-ink',
        amber: 'bg-amber text-ink',
        olive: 'bg-olive text-cream',
        dark: 'bg-olive-deep text-cream',
      },
      size: {
        default: 'h-11 px-5 py-2 text-sm',
        md: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-9 text-lg',
        icon: 'h-10 w-10',
        shop: 'h-9 py-1.5 px-3 text-xs',
        inline: 'p-0 m-0',
        full: 'w-full h-11 px-5 py-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

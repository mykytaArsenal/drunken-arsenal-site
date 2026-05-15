import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
            'border border-transparent bg-primary text-primary-foreground shadow media-hover:hover:bg-primary/90 active:bg-primary/90',
        primary:
            'border border-transparent bg-indigo-600 text-primary-foreground shadow media-hover:hover:bg-indigo-600/90 active:bg-indigo-600/90',
        accent: 'bg-[image:var(--accent-gradient)] text-white',
        destructive:
            'bg-destructive text-destructive-foreground shadow-sm media-hover:hover:bg-destructive/90 active:bg-destructive/90',
        outline:
            'border border-input bg-background shadow-sm media-hover:hover:bg-accent active:bg-accent media-hover:hover:text-accent-foreground active:text-accent-foreground active:border-accent',
        secondary:
            'bg-secondary text-secondary-foreground shadow-sm media-hover:hover:bg-secondary/80 active:bg-secondary/80',
        ghost:
            'media-hover:hover:bg-accent media-hover:hover:text-accent-foreground active:bg-accent active:text-accent-foreground',
        link: 'text-primary underline-offset-4 media-hover:hover:underline active:underline',
        shop:
            'text-black bg-white border border-zinc-200 rounded-md media-hover:hover:bg-gray-200 active:bg-gray-200',
        transparent:
            'bg-transparent w-fit rounded-none shadow-none media-hover:hover:bg-none focus-visible:ring-0 active:bg-none',
        gradient:
            'bg-green-900 text-white media-hover:hover:opacity-90 active:opacity-90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        md: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-md px-4',
        icon: 'h-9 w-9',
        shop: 'h-8 py-1.5 px-3',
        inline: 'p-0 m-0',
        full: 'w-full h-10 px-4 py-2',
      },
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

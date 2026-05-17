import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full min-w-0 border-[3px] border-ink bg-cream px-3 py-2 text-base text-ink',
        'font-stamp placeholder:text-ink/40',
        'shadow-[3px_3px_0_var(--color-ink)]',
        'transition-[box-shadow,transform] outline-none',
        'focus-visible:shadow-[5px_5px_0_var(--color-rust-bright)] focus-visible:-translate-y-[1px] focus-visible:-translate-x-[1px]',
        'aria-invalid:border-rust-bright aria-invalid:shadow-[3px_3px_0_var(--color-rust-bright)]',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'md:text-sm',
        className
      )}
      {...props}
    />
  );
}

export { Input };

'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type IAnimatedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function AnimatedLink({
  href,
  children,
  className,
}: IAnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={`
        relative text-sm font-medium
        after:absolute after:left-0 after:-bottom-0.5
        after:h-[2px] after:w-0 after:bg-current
        after:transition-all after:duration-300
        hover:after:w-full
        ${className ?? ''}
      `}
    >
      {children}
    </Link>
  );
}

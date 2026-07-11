import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ISectionHeaderProps = {
  /** Large phase marker rendered on the left (e.g. "01", "CART", "HQ"). */
  phase: ReactNode;
  /** Tag line above the title (include its own "// " prefix). */
  tag: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Heading level for the title. Defaults to h2. */
  as?: 'h1' | 'h2';
  /** Extra classes on the outer wrapper (spacing such as mb-10 / pt-6). */
  className?: string;
  /** Override the title classes (e.g. to drop the responsive size bump). */
  titleClassName?: string;
};

/**
 * The recurring left-aligned section header: a phase number, a tag line, and a
 * display title with an optional subtitle. Works in server and client trees.
 */
export function SectionHeader({
  phase,
  tag,
  title,
  subtitle,
  as: Heading = 'h2',
  className,
  titleClassName = 'font-display text-3xl md:text-4xl leading-none text-ink',
}: ISectionHeaderProps) {
  return (
    <div className={cn('flex items-end gap-6', className)}>
      <div className="phase-number">{phase}</div>
      <div>
        <div className="tag-line">{tag}</div>
        <Heading className={titleClassName}>{title}</Heading>
        {subtitle && (
          <p className="mt-2 font-stamp text-sm text-ink/70 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

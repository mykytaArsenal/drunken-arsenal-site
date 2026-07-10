'use client';

type IIubendaPolicyLinkProps = {
  href: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

// Renders an iubenda-managed legal link. The `iubenda-embed` class is required
// so the iubenda.js loader (mounted once in the locale layout) wires up the
// in-page modal. `iubenda-nostyle` opts out of iubenda's own CSS so the link
// inherits our tailwind styling instead.
export function IubendaPolicyLink({
  href,
  title,
  children,
  className,
}: IIubendaPolicyLinkProps) {
  return (
    <a
      href={href}
      title={title}
      className={`iubenda-nostyle iubenda-noiframe iubenda-embed ${className ?? ''}`}
    >
      {children}
    </a>
  );
}

import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'text';

/** Locale-aware link styled as a button (§20.6). One primary per view. */
export function LinkButton({
  variant = 'primary',
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={cn(variant === 'text' ? 'link-text' : `btn btn--${variant}`, className)} {...rest}>
      {children}
    </Link>
  );
}

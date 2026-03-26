import React from 'react';
import { cn } from '../lib/utils';

type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  light?: boolean;
  className?: string;
  size?: 'default' | 'compact';
  topIcon?: React.ReactNode;
};

export default function SectionHeading({
  kicker,
  title,
  description,
  align = 'center',
  light,
  className,
  size = 'default',
  topIcon,
}: SectionHeadingProps) {
  const compact = size === 'compact';

  return (
    <div
      className={cn(
        'mb-14 md:mb-20',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {topIcon ? (
        <div
          className={cn(
            'mb-5 flex',
            align === 'center' ? 'justify-center' : 'justify-start'
          )}
        >
          {topIcon}
        </div>
      ) : null}

      {align === 'center' ? (
        <div className="mb-5 flex flex-wrap items-center justify-center gap-3 md:gap-5">
          <span
            className={cn(
              'hidden h-px w-10 rounded-full sm:block md:w-20',
              light
                ? 'bg-gradient-to-r from-transparent to-white/45'
                : 'bg-gradient-to-r from-transparent to-var(--color-machine-orange)/55'
            )}
            aria-hidden
          />
          <span
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] shadow-sm md:px-5 md:py-2.5 md:text-sm',
              light
                ? 'border-white/25 bg-white/10 text-machine-orange'
                : 'border-machine-orange/20 bg-orange-light/80 text-machine-orange'
            )}
          >
            {kicker}
          </span>
          <span
            className={cn(
              'hidden h-px w-10 rounded-full sm:block md:w-20',
              light
                ? 'bg-gradient-to-l from-transparent to-white/45'
                : 'bg-gradient-to-l from-transparent to-var(--color-machine-orange)/55'
            )}
            aria-hidden
          />
        </div>
      ) : (
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <span
            className="hidden h-1.5 w-14 shrink-0 rounded-full bg-gradient-to-r from-machine-orange to-amber sm:block"
            aria-hidden
          />
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-[0.22em] text-machine-orange md:text-sm',
              compact && 'md:text-xs'
            )}
          >
            {kicker}
          </span>
        </div>
      )}

      <h2
        className={cn(
          compact
            ? 'text-3xl font-extrabold sm:text-4xl md:text-[2.65rem]'
            : 'text-4xl font-extrabold sm:text-5xl md:text-[2.85rem] lg:text-[3.35rem] xl:text-[3.65rem]',
          'mt-1 leading-[1.06] tracking-tight',
          light
            ? 'text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.2)]'
            : 'text-navy'
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed md:mt-5 md:text-lg',
            align === 'center' && 'mx-auto max-w-2xl',
            align === 'left' && 'max-w-2xl',
            light ? 'text-white/90' : 'text-muted-grey'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

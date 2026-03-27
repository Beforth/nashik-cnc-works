import React from 'react';
import { cn } from '../lib/utils';

type SectionHeadingProps = {
  kicker?: string;
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
        'mb-16 md:mb-24 relative flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {topIcon ? (
        <div className="mb-6 flex">
          {topIcon}
        </div>
      ) : null}

      <h2
        className={cn(
          compact
            ? 'text-3xl font-extrabold sm:text-4xl md:text-5xl'
            : 'text-4xl font-black sm:text-5xl md:text-[3.5rem]',
          'leading-[1.1] tracking-tight',
          light
            ? 'text-white drop-shadow-md'
            : 'text-navy'
        )}
      >
        {title}
      </h2>

      <div 
        className={cn(
          'h-1.5 rounded-full mt-6 shadow-sm',
          light ? 'bg-white/80' : 'bg-gradient-to-r from-machine-orange to-amber',
          align === 'center' ? 'w-24' : 'w-20'
        )} 
      />

      {description ? (
        <p
          className={cn(
            'mt-6 text-base leading-relaxed md:text-lg opacity-90',
            align === 'center' ? 'max-w-2xl' : 'max-w-xl',
            light ? 'text-white/80' : 'text-muted-grey'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

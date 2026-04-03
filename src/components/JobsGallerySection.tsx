'use client';

import SectionHeading from './SectionHeading';
import WhatsAppIcon from './WhatsAppIcon';
import { COMPANY } from '../constants';
import { cn } from '../lib/utils';
import type { GalleryCardItem } from '@/src/lib/gallery-display';

type JobsGallerySectionProps = {
  items: GalleryCardItem[];
  settings?: { phone?: string } | null;
  /** Extra top padding when used below fixed navbar without hero */
  topPaddingClassName?: string;
};

export default function JobsGallerySection({
  items,
  settings,
  topPaddingClassName = '',
}: JobsGallerySectionProps) {
  const phone = settings?.phone || COMPANY.phone;

  return (
    <section
      id="gallery"
      className={cn(
        'bg-gradient-to-b from-bg-cloud/80 to-white px-4',
        topPaddingClassName ? cn(topPaddingClassName, 'pb-24') : 'py-24',
      )}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Jobs Gallery"
          kicker="Product Gallery"
          description="A glimpse of our precision-engineered components, custom fabricated parts, and high-quality machining work."
          align="center"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => {
            const waHref = `https://wa.me/91${phone}?text=${encodeURIComponent(`Hello, I would like to get a quote for ${item.title}.`)}`;
            const href =
              typeof item.linkUrl === 'string' && item.linkUrl.trim().length > 0
                ? item.linkUrl.trim()
                : waHref;
            const isExternal = /^https?:\/\//i.test(href);
            return (
              <a
                key={item.id ?? `${item.title}-${i}`}
                href={href}
                target="_blank"
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-machine-orange/20 bg-white shadow-sm transition-all hover:border-machine-orange hover:shadow-lg"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                    {item.category}
                  </div>
                  <div className="text-xs font-bold leading-snug break-words sm:text-sm">{item.title}</div>
                  <div className="mt-2 flex items-center gap-1.5 border-t border-white/20 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors">
                    Get best quote <WhatsAppIcon size={12} className="text-[#25D366]" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

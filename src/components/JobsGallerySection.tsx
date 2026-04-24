'use client';

import { useState } from 'react';
import SectionHeading from './SectionHeading';
import WhatsAppIcon from './WhatsAppIcon';
import { VideoLightbox } from './VideoLightbox';
import { COMPANY } from '../constants';
import { indianMobileDigitsForWaMe } from '../lib/indian-mobile-wa';
import { cn } from '../lib/utils';
import type { GalleryCardItem } from '@/src/lib/gallery-display';
import { isGalleryVideoUrl } from '@/src/lib/gallery-media';

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
  const phoneDigits = indianMobileDigitsForWaMe(settings?.phone ?? COMPANY.phone);
  const [videoLightbox, setVideoLightbox] = useState<{ src: string; title: string } | null>(null);
  const [imageLightbox, setImageLightbox] = useState<{ src: string; title: string } | null>(null);

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
        <div className="mt-12 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 sm:gap-5">
          {items.map((item, i) => {
            const waHref = `https://wa.me/91${phoneDigits}?text=${encodeURIComponent(`Hello, I would like to get a quote for ${item.title}.`)}`;
            const rawLink = typeof item.linkUrl === 'string' ? item.linkUrl.trim() : '';
            const isIndiaMart = /^https?:\/\/([^/?#]+\.)?indiamart\.com\b/i.test(rawLink);
            const href = rawLink && !isIndiaMart ? rawLink : waHref;
            const isExternal = /^https?:\/\//i.test(href);
            const isVideo = isGalleryVideoUrl(item.imageUrl);
            return (
              <div
                key={item.id ?? `${item.title}-${i}`}
                className="mb-4 break-inside-avoid-column overflow-hidden rounded-2xl border-2 border-machine-orange/20 bg-white shadow-sm transition-all hover:border-machine-orange hover:shadow-lg sm:mb-5"
              >
                <div className="relative">
                  {isVideo ? (
                    <button
                      type="button"
                      onClick={() => setVideoLightbox({ src: item.imageUrl, title: item.title })}
                      className="block w-full cursor-pointer border-0 p-0 text-left"
                      aria-label={`Play video: ${item.title}`}
                    >
                      <video
                        className="pointer-events-none block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={item.imageUrl}
                        title={item.title}
                        aria-hidden
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setImageLightbox({ src: item.imageUrl, title: item.title })}
                      className="group block w-full cursor-pointer border-0 p-0 text-left"
                      aria-label={`View image: ${item.title}`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                    </button>
                  )}
                  <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-navy/95 via-navy/60 to-transparent p-3 text-white">
                    <div className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      {item.category}
                    </div>
                    <div className="text-xs font-bold leading-snug break-words sm:text-sm">{item.title}</div>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1.5 border-t border-white/20 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:underline"
                    >
                      Get best quote <WhatsAppIcon size={12} className="shrink-0 text-[#25D366]" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <VideoLightbox value={videoLightbox ? { ...videoLightbox, type: 'video' } : null} onClose={() => setVideoLightbox(null)} />
      <VideoLightbox value={imageLightbox ? { ...imageLightbox, type: 'image' } : null} onClose={() => setImageLightbox(null)} />
    </section>
  );
}

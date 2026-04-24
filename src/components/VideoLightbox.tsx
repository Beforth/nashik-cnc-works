'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

type MediaType = 'video' | 'image';

export type VideoLightboxValue = { src: string; title: string; type?: MediaType } | null;

type VideoLightboxProps = {
  value: VideoLightboxValue;
  onClose: () => void;
};

/**
 * Full-screen media overlay: video (with controls) or image; escape / backdrop to close; locks body scroll.
 */
export function VideoLightbox({ value, onClose }: VideoLightboxProps) {
  useEffect(() => {
    if (!value) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [value, onClose]);

  if (!value) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/95 p-4 backdrop-blur-sm md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={value.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        aria-label="Close"
      >
        <X className="h-6 w-6" strokeWidth={2} />
      </button>
      <div
        className="box-border flex w-full max-w-[100vw] flex-col items-center justify-center px-3 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {value.type === 'image' ? (
          <img
            key={value.src}
            src={value.src}
            alt={value.title}
            className="block h-auto w-auto max-h-[min(88vh,85dvh)] max-w-[min(100%,calc(100vw-2rem))] rounded-xl object-contain shadow-2xl"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <video
            key={value.src}
            src={value.src}
            controls
            autoPlay
            playsInline
            className="block h-auto w-auto max-h-[min(88vh,85dvh)] max-w-[min(100%,calc(100vw-2rem))] rounded-xl object-contain shadow-2xl"
          />
        )}
        {value.title ? (
          <p className="mt-3 max-w-full px-1 text-center text-sm font-bold text-white/95">{value.title}</p>
        ) : null}
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, Phone, User } from 'lucide-react';
import { COMPANY, CityData } from '../constants';

const HERO_IMAGES: readonly { src: string; alt: string }[] = [
  {
    src: '/hero/machined-flange.png',
    alt: 'Precision machined metal component with coolant and swarf in the workshop',
  },
  {
    src: '/hero/lathe-chuck-workpiece.png',
    alt: 'Metal workpiece held in a lathe chuck after precision turning',
  },
  {
    src: '/hero/cnc-turning-coolant.png',
    alt: 'CNC lathe turning with coolant spray and metal shavings',
  },
];

const FALLBACK_HERO_SRC = HERO_IMAGES[0].src;
const FALLBACK_HERO_ALT = HERO_IMAGES[0].alt;

function normalizeHeroSlides(
  heroImages: { url?: string; alt?: string }[] | undefined,
): { src: string; alt: string }[] {
  if (!heroImages?.length) return [...HERO_IMAGES];
  const slides = heroImages
    .map((row) => ({
      src: typeof row.url === 'string' ? row.url.trim() : '',
      alt:
        typeof row.alt === 'string' && row.alt.trim()
          ? row.alt.trim()
          : 'Hero slide',
    }))
    .filter((s) => s.src.length > 0);
  return slides.length > 0 ? slides : [...HERO_IMAGES];
}

const HERO_DISPLAY_NAME = 'Karan Engineers & Fabrication';

/** Styling per character index — keeps gradient spans continuous as text grows */
function charStyleClass(index: number, name: string): string {
  const words = name.split(/\s+/);
  const firstWord = words[0];
  const firstWordEnd = firstWord.length;
  
  if (index < firstWordEnd) {
    return 'text-navy';
  }
  return 'bg-gradient-to-r from-machine-orange to-amber bg-clip-text text-transparent';
}

function typedTitleChunks(visibleLength: number, name: string): { key: number; className: string; text: string }[] {
  const slice = name.slice(0, visibleLength);
  const chunks: { key: number; className: string; text: string }[] = [];
  let i = 0;
  while (i < slice.length) {
    const start = i;
    const cls = charStyleClass(start, name);
    while (i < slice.length && charStyleClass(i, name) === cls) {
      i += 1;
    }
    chunks.push({ key: start, className: cls, text: slice.slice(start, i) });
  }
  return chunks;
}

export default function Hero({ city, settings, heroImages }: { city: CityData, settings?: any, heroImages?: any[] }) {
  const companyName = settings?.companyName || HERO_DISPLAY_NAME;
  const phone = settings?.phone || COMPANY.phone;
  const phoneDisplay = settings?.phoneFormatted || COMPANY.contactPhoneDisplay;
  const email = settings?.email || COMPANY.email;
  const address = settings?.address || COMPANY.tagline;
  const gstin = settings?.gstin || COMPANY.gstin;

  const displayImages = useMemo(() => normalizeHeroSlides(heroImages), [heroImages]);

  const servingLine =
    city.id === 'nashik'
      ? 'Nashik, Maharashtra'
      : `Serving ${city.name} · Based in Nashik, Maharashtra`;

  const headlineAccent =
    city.title.includes(' in ') && city.id !== 'nashik' ? (
      <>
        {city.title.split(' in ')[0]}{' '}
        <span className="text-machine-orange block sm:inline">
          in {city.title.split(' in ')[1]}
        </span>
      </>
    ) : null;

  const [typedLength, setTypedLength] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const titleChunks = useMemo(() => typedTitleChunks(typedLength, companyName), [typedLength, companyName]);

  useEffect(() => {
    const full = companyName.length;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setTypedLength(full);
      return;
    }

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      let n = 0;
      intervalId = window.setInterval(() => {
        n += 1;
        setTypedLength((prev) => Math.min(n, full));
        if (n >= full && intervalId) {
          window.clearInterval(intervalId);
          intervalId = undefined;
        }
      }, 48);
    }, 320);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [companyName]);

  useEffect(() => {
    setHeroImageIndex((i) => {
      if (displayImages.length === 0) return 0;
      return Math.min(i, displayImages.length - 1);
    });
  }, [displayImages]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (displayImages.length <= 1) return;
    const id = window.setInterval(() => {
      setHeroImageIndex((i) => (i + 1) % displayImages.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [displayImages.length]);

  return (
    <section
      id="home"
      className="relative pt-28 pb-12 sm:pt-32 sm:pb-20 px-4 overflow-hidden bg-white sm:bg-white bg-[radial-gradient(circle_at_top_right,#E8F1F8_0%,transparent_40%),radial-gradient(circle_at_bottom_left,#EEF1F6_0%,transparent_40%)] min-h-[90vh] flex items-center"
      aria-labelledby="hero-main-title"
    >
      {/* --- SVG Background Pattern --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.2] sm:opacity-[0.4]" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 560">
            <g mask="url(#SvgjsMask1002)" fill="none">
                <path d="M1559.34 378.41C1407.15 373.73 1302.06 152.66 997.55 143.21 693.05 133.76 588.09-88.65 435.77-93.41" stroke="rgba(0, 83, 145, 0.58)" strokeWidth="2"></path>
                <path d="M1561.59 367.31C1463.64 367.03 1368.83 297.31 1176.08 297.31 983.32 297.31 1003.89 376.55 790.56 367.31 577.23 358.07 544.84-28.84 405.05-70.18" stroke="rgba(0, 83, 145, 0.58)" strokeWidth="2"></path>
                <path d="M1478.41 460.15C1335.73 457.11 1173.73 280.32 942.27 264.15 710.81 247.98 766.36 18.37 674.2-3.08" stroke="rgba(0, 83, 145, 0.58)" strokeWidth="2"></path>
                <path d="M1691.59 371.9C1510.53 369.11 1278.77 154.3 1002.79 147.9 726.81 141.5 753.84-13.51 658.39-17.74" stroke="rgba(0, 83, 145, 0.58)" strokeWidth="2"></path>
                <path d="M1662.34 244.57C1530.84 247.05 1422.24 420.25 1165.73 418.17 909.22 416.09 831.02 15.66 669.12-12.98" stroke="rgba(0, 83, 145, 0.58)" strokeWidth="2"></path>
            </g>
            <defs>
                <mask id="SvgjsMask1002">
                    <rect width="1440" height="560" fill="#ffffff"></rect>
                </mask>
            </defs>
        </svg>
      </div>

      {/* Engineering Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.15] sm:opacity-[0.25]" 
        style={{ 
          backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
          backgroundSize: '30px 30px'
        }} 
        aria-hidden 
      />
      
      {/* Subtle Precision Lines */}
      <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-border-grey/40 to-transparent opacity-60" />
      <div className="absolute top-[80%] left-0 w-full h-px bg-gradient-to-r from-transparent via-border-grey/40 to-transparent opacity-60" />
      <div className="absolute left-[15%] top-0 w-px h-full bg-gradient-to-b from-transparent via-border-grey/40 to-transparent opacity-60" />

      {/* Pulsing Precision Markers */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 1.5 }}
          className="absolute w-2 h-2 rounded-full bg-machine-orange/30 hidden lg:block"
          style={{ 
            left: `${25 + i * 25}%`, 
            top: `${30 + (i % 2) * 40}%` 
          }}
        />
      ))}

      {/* Fade Overlays */}
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid items-center gap-16 lg:grid-cols-12 min-h-[500px]">
          <div className="lg:col-span-7 relative">
            <p className="mt-2 mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-grey">
              <MapPin size={18} className="text-machine-orange" />
              {servingLine}
              <span className="hidden sm:inline text-border-grey mx-1">|</span>
              <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded-md">GST {gstin}</span>
            </p>

            <div className="min-h-[320px] sm:min-h-[300px] md:min-h-[280px] lg:min-h-[360px]">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <h1
                  id="hero-main-title"
                  aria-label={companyName}
                  className="text-5xl font-extrabold leading-[1.2] tracking-tight sm:text-6xl sm:tracking-normal lg:text-[4rem] xl:text-[4.5rem]"
                >
                  <span className="inline-flex flex-wrap items-end gap-x-1 gap-y-1 sm:gap-x-1.5 sm:gap-y-1.5">
                    {titleChunks.map(({ key, className, text }) => (
                      <span key={key} className={className}>
                        {text}
                      </span>
                    ))}
                    {typedLength < companyName.length ? (
                      <span
                        className="hero-typing-caret ml-1 inline-block h-[0.75em] w-0.5 shrink-0 self-center rounded-sm bg-machine-orange"
                        aria-hidden
                      />
                    ) : null}
                  </span>
                </h1>

                {headlineAccent && (
                  <p className="mt-4 text-lg font-semibold text-muted-grey hidden sm:block">{headlineAccent}</p>
                )}

                <p className="mt-5 sm:mt-6 text-lg leading-relaxed text-muted-grey sm:text-xl max-w-2xl">
                  {address}
                </p>

                <address className="mt-4 max-w-2xl not-italic">
                  <ul className="space-y-2.5 text-base text-muted-grey sm:text-lg">
                    <li className="flex flex-wrap items-center gap-2.5">
                      <User className="h-4 w-4 shrink-0 text-machine-orange" aria-hidden />
                      <span className="font-semibold text-navy">{settings?.contactName || COMPANY.contactName}</span>
                    </li>
                    <li className="flex flex-wrap items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-machine-orange" aria-hidden />
                      <a
                        href={`tel:+91${phone}`}
                        className="text-navy underline-offset-2 transition-colors hover:text-machine-orange hover:underline"
                      >
                        {phoneDisplay}
                      </a>
                    </li>
                    <li className="flex flex-wrap items-center gap-2.5">
                      <Mail className="h-4 w-4 shrink-0 text-machine-orange" aria-hidden />
                      <a
                        href={`mailto:${email}`}
                        className="break-all text-navy underline-offset-2 transition-colors hover:text-machine-orange hover:underline"
                      >
                        {email}
                      </a>
                    </li>
                  </ul>
                </address>
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{ 
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="lg:col-span-5 relative h-[350px] sm:h-[450px] lg:h-full min-h-[350px] lg:min-h-[500px] mt-2 lg:mt-0 flex items-center justify-center [perspective:1000px]"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-machine-orange/30 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] border border-dashed border-navy/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

            {/* group + clip: 3D rotate on the same node as overflow-hidden breaks hover/clipping in several browsers */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="group relative z-20 w-full max-w-[280px] sm:max-w-sm origin-center transform-gpu rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] will-change-transform"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-navy/90 ring-1 ring-white/10">
                {/* sync: crossfade overlapping slides — "wait" leaves a visible gap with no image between exits and enters */}
                <AnimatePresence mode="sync" initial={false}>
                  <motion.img
                    key={`${heroImageIndex}-${displayImages[heroImageIndex].src}`}
                    src={displayImages[heroImageIndex].src}
                    alt={displayImages[heroImageIndex].alt}
                    draggable={false}
                    loading={heroImageIndex === 0 ? 'eager' : 'lazy'}
                    fetchPriority={heroImageIndex === 0 ? 'high' : 'low'}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.dataset.fallback === '1') return;
                      el.dataset.fallback = '1';
                      el.src = FALLBACK_HERO_SRC;
                      el.alt = FALLBACK_HERO_ALT;
                    }}
                    className="absolute inset-0 z-[1] h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </AnimatePresence>

                {/* Sweeping Shine Effect */}
                <motion.div
                  animate={{
                    left: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: 'easeInOut',
                  }}
                  className="pointer-events-none absolute top-0 z-10 h-full w-1/2 skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-navy/50 via-navy/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-navy/60" />
                <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-1.5 pb-3">
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setHeroImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        heroImageIndex === idx ? 'w-6 bg-machine-orange' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Show photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  MessageSquare, 
  ArrowRight,
  Settings,
  ShieldCheck,
  Zap,
  Clock,
  Upload,
  Send,
  ExternalLink,
  Briefcase,
  Landmark,
  Hash,
  PlayCircle
} from 'lucide-react';
import { cn } from './lib/utils';
import {
  CITIES,
  SERVICES,
  MACHINES,
  INDUSTRIES,
  STEPS,
  CityData,
  COMPANY,
  GALLERY_ITEMS,
  HSN_CODES,
  INDIA_MART_IMAGES,
} from './constants';

type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  light?: boolean;
  className?: string;
  /** Slightly smaller title for footer / dense areas */
  size?: 'default' | 'compact';
  topIcon?: React.ReactNode;
};

function SectionHeading({
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
                : 'bg-gradient-to-r from-transparent to-machine-orange/55'
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
                : 'bg-gradient-to-l from-transparent to-machine-orange/55'
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

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white border border-border-grey rounded-xl px-6 py-3">
        <Link to="/" className="text-base sm:text-lg md:text-xl font-extrabold text-navy leading-tight">
          Karan Engineers <span className="text-machine-orange">And Fabrication</span>, Nashik
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Services', 'Machines', 'Gallery', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-grey hover:text-machine-orange transition-colors">
              {item}
            </a>
          ))}
          <a href="#enquiry" className="bg-machine-orange text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-machine-orange/90 transition-all shadow-sm">
            Get Quote
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-navy" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-2 bg-white border border-border-grey rounded-xl shadow-xl p-6 md:hidden flex flex-col gap-4"
          >
            {['Services', 'Machines', 'Gallery', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-base font-semibold text-navy"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <a 
              href="#enquiry" 
              className="bg-machine-orange text-white text-center font-bold py-3 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Get Quote
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ city }: { city: CityData }) => {
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

  return (
    <section
      id="home"
      className="relative pt-28 pb-12 md:pb-20 px-4 overflow-hidden bg-gradient-to-b from-bg-cloud via-white to-orange-light/15"
      aria-labelledby="hero-main-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(232,96,10,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-96 w-96 rounded-full bg-machine-orange/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-steel/15 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
    

        <div className="mt-6 grid items-center gap-12 lg:grid-cols-2 lg:grid-rows-1 lg:gap-16">
          {/* LEFT: PathSoft-style copy + CTAs */}
          <div className="order-2 max-w-xl lg:order-1 lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                <ShieldCheck size={12} className="shrink-0" />
                IndiaMART supplier
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-machine-orange/25 bg-orange-light px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-machine-orange">
                {COMPANY.yearsOnIndiaMART} yrs trusted
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-muted-grey"
            >
              <MapPin size={17} className="shrink-0 text-machine-orange" />
              {servingLine}
              <span className="hidden sm:inline text-border-grey">·</span>
              <span className="font-mono text-xs font-bold text-navy">GST {COMPANY.gstin}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <h1
                id="hero-main-title"
                className="text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-[3.6rem]"
              >
                Precision job work &amp;{' '}
                <span className="bg-gradient-to-r from-machine-orange to-amber bg-clip-text text-transparent">
                  machined components
                </span>{' '}
                for industry.
              </h1>
              <p className="mt-4 text-xl font-bold text-navy sm:text-2xl md:text-[1.65rem]">
                Karan Engineers <span className="text-machine-orange">And Fabrication</span>
                <span className="font-semibold text-muted-grey"> · Nashik, Maharashtra</span>
              </p>
              {headlineAccent && (
                <p className="mt-2 text-base font-semibold text-muted-grey">{headlineAccent}</p>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-5 text-base leading-relaxed text-muted-grey sm:text-lg"
            >
              {COMPANY.tagline} Turning, milling, and CNC machine job work; power, automotive, and
              general engineering parts — from drawing to dispatch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-machine-orange to-amber px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-machine-orange/25 transition hover:shadow-xl hover:shadow-machine-orange/30"
              >
                Get a free quote <ArrowRight size={18} />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy/15 bg-white px-7 py-3.5 text-sm font-bold text-navy transition hover:border-machine-orange hover:text-machine-orange"
              >
                Explore services
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center gap-4 border-t border-border-grey pt-6"
            >
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-navy transition hover:text-machine-orange"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-light text-machine-orange">
                  <PlayCircle size={22} strokeWidth={2} />
                </span>
                View IndiaMART catalogue
              </a>
              <div className="hidden h-6 w-px bg-border-grey sm:block" aria-hidden />
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-grey">
                <a
                  href="https://wa.me/919876543210"
                  className="inline-flex items-center gap-1.5 rounded-full bg-machine-green px-4 py-2 text-white hover:opacity-95"
                >
                  <MessageSquare size={14} /> WhatsApp
                </a>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-1.5 rounded-full bg-steel px-4 py-2 text-white hover:opacity-95"
                >
                  <Phone size={14} /> Call
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Etech-style visual — image + dashed circle + floating cards */}
          <div className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none lg:justify-self-end">
            <div
              className="absolute left-1/2 top-1/2 z-0 h-[min(100%,420px)] w-[min(100%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-machine-orange/35 bg-gradient-to-br from-orange-light/90 via-white to-bg-steel/40 sm:h-[440px] sm:w-[440px]"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 120 }}
              className="relative z-[1] mx-auto aspect-[3/4] max-h-[min(520px,72vh)] w-[78%] sm:w-[70%]"
            >
              <img
                src={INDIA_MART_IMAGES.turningAlt}
                alt="CNC turning and precision job work — Karan Engineers And Fabrication, Nashik"
                className="h-full w-full rounded-[2rem] object-cover shadow-2xl shadow-navy/20 ring-4 ring-white"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="absolute left-0 top-[8%] z-[2] max-w-[200px] rounded-2xl border border-border-grey bg-white/95 p-3 shadow-xl backdrop-blur-sm sm:left-[-4%] sm:max-w-[220px]"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-light text-machine-orange">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-navy">{COMPANY.jobWorkProductCount}+</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-grey">
                    Job work lines
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="absolute right-0 top-[28%] z-[2] max-w-[210px] rounded-2xl border border-border-grey bg-white/95 p-3 shadow-xl backdrop-blur-sm sm:right-[-6%]"
            >
              <p className="text-lg font-extrabold text-navy">{COMPANY.machinedComponentCount}+</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-grey">
                Component types
              </p>
              <div className="mt-2 flex -space-x-2">
                {[INDIA_MART_IMAGES.bush, INDIA_MART_IMAGES.cncTurned, INDIA_MART_IMAGES.milling].map(
                  (src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-8 w-8 rounded-full border-2 border-white object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="absolute bottom-[6%] left-[6%] z-[2] flex items-center gap-3 rounded-2xl border border-border-grey bg-white/95 py-2.5 pl-2.5 pr-4 shadow-xl backdrop-blur-sm sm:left-[2%]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-sm font-extrabold text-machine-orange">
                {COMPANY.yearsOnIndiaMART}
              </div>
              <div>
                <p className="text-xs font-bold text-navy">Years on IndiaMART</p>
                <p className="text-[10px] text-muted-grey">GST since {COMPANY.gstRegistrationDate.slice(-4)}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Catalogue strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-14 rounded-3xl border border-border-grey bg-white/80 p-4 shadow-lg backdrop-blur-sm md:p-6"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-machine-orange md:text-sm">
                IndiaMART catalogue
              </h3>
              <p className="mt-1.5 text-lg font-extrabold leading-snug text-navy sm:text-xl md:text-2xl">
                Real product photos from our listing
              </p>
            </div>
            <a
              href={COMPANY.indiaMartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-machine-orange hover:underline"
            >
              View all on IndiaMART <ExternalLink size={14} />
            </a>
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {GALLERY_ITEMS.slice(0, 6).map((item, i) => (
              <a
                key={`${item.title}-${i}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-[124px] shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-border-grey bg-white shadow-sm transition hover:border-machine-orange hover:shadow-md sm:w-[140px]"
              >
                <div className="aspect-square overflow-hidden bg-bg-cloud">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="border-t border-border-grey p-2">
                  <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-wide text-machine-orange">
                    {item.category}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] font-bold leading-tight text-navy">
                    {item.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Factsheet + quick service cards */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="#services"
              className="group flex gap-3 rounded-2xl border-2 border-border-grey bg-white p-4 shadow-sm transition hover:border-machine-orange/40 hover:shadow-md"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border-grey">
                <img
                  src={INDIA_MART_IMAGES.turning}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-machine-orange">
                  Job work
                </p>
                <p className="text-base font-extrabold text-navy sm:text-lg">Turning · milling · CNC</p>
                <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-bold text-machine-orange">
                  Details <ChevronRight size={14} />
                </p>
              </div>
            </a>
            <a
              href="#services"
              className="group flex gap-3 rounded-2xl border-2 border-border-grey bg-white p-4 shadow-sm transition hover:border-machine-orange/40 hover:shadow-md"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border-grey">
                <img
                  src={INDIA_MART_IMAGES.powerSector}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-machine-orange">
                  Components
                </p>
                <p className="text-base font-extrabold text-navy sm:text-lg">Power · auto · bush · shaft</p>
                <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-bold text-machine-orange">
                  Details <ChevronRight size={14} />
                </p>
              </div>
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-3xl border-2 border-border-grey bg-white shadow-lg"
          >
            <div className="flex items-center gap-3 bg-navy px-5 py-5 text-white md:px-6 md:py-5">
              <Landmark size={26} className="shrink-0 text-machine-orange md:h-7 md:w-7" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75 md:text-xs">
                  Factsheet
                </p>
                <h3 className="mt-1 text-base font-extrabold leading-tight sm:text-lg md:text-xl">
                  Legal &amp; business profile
                </h3>
              </div>
            </div>
            <dl className="divide-y divide-border-grey text-sm">
              {[
                ['Nature of business', COMPANY.natureOfBusiness],
                ['Legal status of firm', COMPANY.legalStatus],
                ['CEO', COMPANY.ceo],
                ['Annual turnover', COMPANY.annualTurnover],
                ['GST registration date', COMPANY.gstRegistrationDate],
                ['GST number', COMPANY.gstin],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 bg-bg-cloud/30 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-4"
                >
                  <dt className="shrink-0 font-medium text-muted-grey">{label}</dt>
                  <dd className="text-right font-bold text-navy sm:max-w-[58%]">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-border-grey bg-white p-4">
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-navy py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
              >
                <Briefcase size={18} /> View full IndiaMART profile
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          kicker="Services"
          title="Our machining expertise"
          description={COMPANY.listingSummary}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((svc) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={svc.id} 
              className="bg-white border-2 border-border-grey rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-machine-orange/30 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-bg-cloud overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-md border border-white">
                  {svc.icon}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="mb-3 text-xl font-extrabold text-navy sm:text-2xl">{svc.name}</h3>
                <p className="text-sm text-muted-grey leading-relaxed flex-1">{svc.description}</p>
                <a
                  href={`${COMPANY.indiaMartUrl}enquiry.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-machine-orange hover:underline"
                >
                  Get best quote <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Infrastructure = () => {
  return (
    <section id="machines" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start md:items-center">
          <div>
            <SectionHeading
              align="left"
              className="md:mb-10"
              kicker="Infrastructure"
              title="Advanced machine shop"
              description={`${COMPANY.natureOfBusiness}; ${COMPANY.legalStatus.toLowerCase()} firm. Annual turnover ${COMPANY.annualTurnover}. We undertake turning, milling, and CNC machine job work and supply machined components to industrial buyers.`}
            />

            <div className="space-y-4">
              {MACHINES.map((m, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white border border-border-grey rounded-xl">
                  <div className="mt-1 text-machine-orange"><Settings size={20} /></div>
                  <div>
                    <h4 className="text-base font-extrabold text-navy sm:text-lg">{m.name}</h4>
                    <p className="text-xs text-muted-grey mt-1">{m.specs}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src={INDIA_MART_IMAGES.turningAlt} 
              alt="Turning machine job work" 
              className="rounded-2xl border-2 border-border-grey shadow-md aspect-[3/4] object-cover hover:shadow-lg transition-shadow"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col gap-4">
              <img 
                src={INDIA_MART_IMAGES.milling} 
                alt="Milling machine job" 
                className="rounded-2xl border-2 border-border-grey shadow-md aspect-square object-cover hover:shadow-lg transition-shadow"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <img 
                src={INDIA_MART_IMAGES.automobile} 
                alt="Components for automobile industry" 
                className="rounded-2xl border-2 border-border-grey shadow-md aspect-square object-cover hover:shadow-lg transition-shadow"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HsnCodes = () => (
  <section id="hsn" className="py-20 px-4 bg-white border-y border-border-grey">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        // topIcon={<Hash size={26} className="text-machine-orange md:w-7 md:h-7" strokeWidth={2} />}
        kicker="HSN & compliance"
        title="Deals in HSN code"
        description="HSN classifications as listed on our IndiaMART profile — helpful for buyers, GST, and industrial procurement."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HSN_CODES.map((row) => (
          <motion.div
            key={row.code}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-cloud border border-border-grey rounded-2xl p-5 hover:border-machine-orange/40 hover:shadow-sm transition-all"
          >
            <p className="font-mono font-bold text-machine-orange text-lg">{row.code}</p>
            <p className="text-xs text-muted-grey leading-relaxed mt-2">{row.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  return (
    <section id="process" className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading kicker="Process" title="How we work" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="relative bg-white border-2 border-border-grey rounded-2xl p-8">
              <div className="w-10 h-10 bg-machine-orange text-white rounded-full flex items-center justify-center font-bold text-lg mb-6">
                {step.num}
              </div>
              <h3 className="mb-3 text-lg font-extrabold text-navy sm:text-xl">{step.title}</h3>
              <p className="text-xs text-muted-grey leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EnquiryForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="enquiry" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          kicker="Enquiry"
          title="Get a free quote"
          description="Upload your drawing and get a response within 24 hours."
          className="mb-10"
        />
        <div className="bg-white border-2 border-border-grey rounded-3xl p-8 md:p-12 shadow-xl">
          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-light text-machine-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-extrabold text-navy sm:text-4xl">Enquiry Sent!</h3>
              <p className="text-muted-grey mt-2">We will get back to you shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-machine-orange font-bold underline"
              >
                Send another enquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Your Name *</label>
                  <input required type="text" placeholder="e.g. Raju Patil" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Phone Number *</label>
                  <input required type="tel" placeholder="e.g. 98765 43210" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Email (Optional)</label>
                <input type="email" placeholder="yourname@email.com" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Material</label>
                  <select className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all bg-white">
                    <option>Select material...</option>
                    <option>MS Steel</option>
                    <option>Stainless Steel</option>
                    <option>Aluminum</option>
                    <option>Brass</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Quantity</label>
                  <input type="number" placeholder="e.g. 100 pcs" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Message / Requirements</label>
                <textarea rows={4} placeholder="Describe your part requirement..." className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all resize-none"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Upload Drawing (PDF, DXF, JPG)</label>
                <div className="relative border-2 border-dashed border-border-grey rounded-xl p-8 text-center hover:border-machine-orange transition-all cursor-pointer">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload className="mx-auto text-muted-grey mb-2" size={24} />
                  <p className="text-sm text-muted-grey">Click to upload or drag and drop</p>
                </div>
              </div>

              <div className="bg-green-light border border-machine-green/20 rounded-xl p-4 flex flex-wrap gap-4 text-xs text-machine-green font-medium">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Response within 24 hours</span>
                <span className="flex items-center gap-1"><ShieldCheck size={14} /> Confidential drawings</span>
              </div>

              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full bg-machine-orange text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {status === 'sending' ? 'Sending...' : <><Send size={18} /> Send Enquiry</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-border-grey pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          size="compact"
          kicker="Contact"
          title="Get in touch"
          description="Reach us via IndiaMART, the form above, or the links below. Based in Nashik, Maharashtra."
          className="mb-14"
        />
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link
              to="/"
              className="text-2xl font-extrabold leading-tight text-navy sm:text-3xl md:text-[1.75rem]"
            >
              Karan Engineers <span className="text-machine-orange">And Fabrication</span>, Nashik
            </Link>
            <p className="text-muted-grey mt-4 max-w-sm leading-relaxed">
              {COMPANY.tagline} Nature of business: {COMPANY.natureOfBusiness.toLowerCase()}. CEO:{' '}
              {COMPANY.ceo}.
            </p>
            <p className="text-xs text-muted-grey mt-3 font-mono">
              GSTIN: {COMPANY.gstin} · Reg. {COMPANY.gstRegistrationDate}
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-bg-steel rounded-lg flex items-center justify-center text-navy hover:bg-machine-orange hover:text-white transition-all"
                title="IndiaMART — Karan Engineers And Fabrication"
              >
                <Phone size={18} />
              </a>
              <a
                href={`${COMPANY.indiaMartUrl}enquiry.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-bg-steel rounded-lg flex items-center justify-center text-navy hover:bg-machine-orange hover:text-white transition-all"
                title="Enquiry on IndiaMART"
              >
                <Mail size={18} />
              </a>
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-bg-steel rounded-lg flex items-center justify-center text-navy hover:bg-machine-orange hover:text-white transition-all"
                title="Nashik, Maharashtra"
              >
                <MapPin size={18} />
              </a>
            </div>
            <p className="text-xs text-muted-grey mt-4">
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-machine-orange font-semibold hover:underline"
              >
                View profile on IndiaMART
              </a>
            </p>
          </div>
          
          <div>
            <h4 className="mb-6 text-lg font-extrabold text-navy sm:text-xl">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-grey">
              <li><a href="#services" className="hover:text-machine-orange transition-colors">Services</a></li>
              <li><a href="#machines" className="hover:text-machine-orange transition-colors">Infrastructure</a></li>
              <li><a href="#enquiry" className="hover:text-machine-orange transition-colors">Get Quote</a></li>
              <li><a href="#contact" className="hover:text-machine-orange transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-extrabold text-navy sm:text-xl">Our Locations</h4>
            <ul className="space-y-3 text-sm text-muted-grey">
              {CITIES.map(city => (
                <li key={city.id}><Link to={`/${city.slug}`} className="hover:text-machine-orange transition-colors">{city.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-grey pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
          <div className="text-xs text-muted-grey">
            © 2025 Karan Engineers And Fabrication, Nashik. All rights reserved.
          </div>
          <div className="text-xs text-muted-grey">
            Made with ❤️ by <span className="text-machine-orange font-bold">Beforth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const StickyActions = () => {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 flex gap-3 md:hidden">
      <a href="tel:+919876543210" className="flex-1 bg-steel text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center gap-2">
        <Phone size={20} /> Call Now
      </a>
      <a href="https://wa.me/919876543210" className="flex-1 bg-machine-green text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center gap-2">
        <MessageSquare size={20} /> WhatsApp
      </a>
    </div>
  );
};

// --- Page Components ---

const HomePage = () => {
  const { slug } = useParams();
  const location = useLocation();
  
  // Find city based on slug or default to Nashik
  const city = CITIES.find(c => c.slug === slug) || CITIES[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero city={city} />
      
      {/* Highlights Strip (Mobile Only or additional) */}
      <section id="highlights" className="md:hidden px-4 mb-12" aria-labelledby="highlights-heading">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span
              className="hidden h-px w-8 bg-gradient-to-r from-transparent to-machine-orange/55 sm:block md:w-14"
              aria-hidden
            />
            <span className="rounded-full border border-machine-orange/20 bg-orange-light/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-machine-orange">
              At a glance
            </span>
            <span
              className="hidden h-px w-8 bg-gradient-to-l from-transparent to-machine-orange/55 sm:block md:w-14"
              aria-hidden
            />
          </div>
          <h2
            id="highlights-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-navy sm:text-3xl md:text-4xl"
          >
            Why work with us
          </h2>
        </div>
        <div className="bg-white border border-border-grey rounded-2xl p-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <Zap className="mx-auto text-machine-orange mb-2" size={20} />
            <div className="text-xs font-bold text-navy">Fast Turnaround</div>
          </div>
          <div className="text-center">
            <ShieldCheck className="mx-auto text-machine-orange mb-2" size={20} />
            <div className="text-xs font-bold text-navy">High Precision</div>
          </div>
          <div className="text-center">
            <Clock className="mx-auto text-machine-orange mb-2" size={20} />
            <div className="text-xs font-bold text-navy">24/7 Support</div>
          </div>
          <div className="text-center">
            <Settings className="mx-auto text-machine-orange mb-2" size={20} />
            <div className="text-xs font-bold text-navy">Advanced Tech</div>
          </div>
        </div>
      </section>

      <Services />
      <Infrastructure />
      
      {/* Industries Served */}
      <section id="industries" className="py-20 px-4 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-machine-orange/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            light
            kicker="Industries"
            title="Sectors we serve"
            description="Job work and machined components for power, automotive, engineering, and allied industries."
          />
          <div className="flex flex-wrap justify-center gap-4">
            {INDUSTRIES.map((ind, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-sm font-semibold"
              >
                {ind}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HsnCodes />

      <HowItWorks />
      
      {/* Work Showcase (Gallery) — IndiaMART product photos */}
      <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-bg-cloud/80 to-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            kicker="Gallery"
            title="Product gallery"
            description="Photos from our IndiaMART catalogue — job work and machined components. Click to open the listing."
            className="mb-12 md:mb-14"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <a
                key={`${item.title}-${i}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-border-grey bg-white shadow-sm hover:border-machine-orange hover:shadow-lg transition-all"
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-machine-orange mb-0.5">
                    {item.category}
                  </div>
                  <div className="text-xs font-bold leading-tight">{item.title}</div>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold opacity-90">
                    View on IndiaMART <ExternalLink size={10} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <EnquiryForm />
      <Footer />
      <StickyActions />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

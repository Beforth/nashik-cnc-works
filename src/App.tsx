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
  Hash
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
    <section className="pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-white border-2 border-border-grey rounded-3xl p-8 md:p-12 lg:p-14 overflow-hidden shadow-xl shadow-navy/5">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-light rounded-full opacity-50" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-bg-steel rounded-full opacity-50" />

          {/* IndiaMART product strip — catalogue preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-8 lg:mb-10 rounded-2xl overflow-hidden border border-border-grey bg-gradient-to-br from-bg-steel via-white to-orange-light/30 p-4 md:p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] font-bold text-machine-orange uppercase tracking-[0.2em]">
                  IndiaMART catalogue
                </p>
                <p className="text-sm font-bold text-navy mt-0.5">
                  Real product photos from our listing
                </p>
              </div>
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-machine-orange hover:underline shrink-0"
              >
                View all on IndiaMART <ExternalLink size={14} />
              </a>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
              {GALLERY_ITEMS.slice(0, 6).map((item, i) => (
                <a
                  key={`${item.title}-${i}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group shrink-0 w-[132px] sm:w-[148px] snap-start rounded-xl border-2 border-border-grey bg-white overflow-hidden shadow-sm hover:border-machine-orange hover:shadow-md transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-bg-cloud">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-2.5 border-t border-border-grey">
                    <p className="text-[10px] font-bold text-machine-orange uppercase tracking-wide line-clamp-1">
                      {item.category}
                    </p>
                    <p className="text-[11px] font-bold text-navy leading-tight line-clamp-2 mt-0.5">
                      {item.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 bg-navy text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                  <ShieldCheck size={12} className="shrink-0" />
                  IndiaMART supplier
                </span>
                <span className="inline-flex items-center gap-1.5 bg-orange-light border border-machine-orange/20 text-machine-orange text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {COMPANY.yearsOnIndiaMART} yrs · Trusted seller
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="space-y-1"
              >
                <p className="text-sm font-semibold text-muted-grey flex flex-wrap items-center gap-x-2 gap-y-1">
                  <MapPin size={16} className="text-machine-orange shrink-0" />
                  {servingLine}
                  <span className="hidden sm:inline text-border-grey">|</span>
                  <span className="text-navy font-bold">GST — {COMPANY.gstin}</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-navy leading-[1.15] tracking-tight">
                  Karan Engineers <span className="text-machine-orange">And Fabrication</span>
                </h1>
                <p className="mt-3 text-lg font-bold text-navy/90">
                  Service provider of job work &amp; machined components
                </p>
                {headlineAccent && (
                  <p className="mt-2 text-base font-semibold text-muted-grey">{headlineAccent}</p>
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-base text-muted-grey leading-relaxed max-w-xl"
              >
                <span className="font-semibold text-navy">About us — </span>
                {COMPANY.tagline} Turning, milling, and CNC machine job work; machined components for
                power sector, automobile industry, CNC turned parts, bush, and clamp shaft.
              </motion.p>

              {/* IndiaMART-style product buckets */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid sm:grid-cols-2 gap-4"
              >
                <a
                  href="#services"
                  className="group rounded-2xl border-2 border-border-grey bg-bg-cloud/80 hover:border-machine-orange/50 hover:bg-white p-5 transition-all overflow-hidden"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-border-grey shrink-0 shadow-sm">
                      <img
                        src={INDIA_MART_IMAGES.turning}
                        alt="Job work"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-xs font-extrabold text-machine-orange uppercase tracking-wider">
                        Products &amp; services
                      </span>
                      <p className="font-bold text-navy mt-1">Job work</p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-muted-grey group-hover:text-machine-orange transition-colors shrink-0 mt-1"
                    />
                  </div>
                  <ul className="text-xs text-muted-grey space-y-1.5">
                    <li className="flex gap-2">
                      <span className="text-machine-orange font-bold">·</span> Turning machine job
                    </li>
                    <li className="flex gap-2">
                      <span className="text-machine-orange font-bold">·</span> Milling machine job
                    </li>
                    <li className="flex gap-2">
                      <span className="text-machine-orange font-bold">·</span> CNC machine job
                    </li>
                  </ul>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-machine-orange">
                    View details <ArrowRight size={14} />
                  </span>
                </a>
                <a
                  href="#services"
                  className="group rounded-2xl border-2 border-border-grey bg-bg-cloud/80 hover:border-machine-orange/50 hover:bg-white p-5 transition-all overflow-hidden"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-border-grey shrink-0 shadow-sm">
                      <img
                        src={INDIA_MART_IMAGES.powerSector}
                        alt="Machined components"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-xs font-extrabold text-machine-orange uppercase tracking-wider">
                        Products &amp; services
                      </span>
                      <p className="font-bold text-navy mt-1">Machined components</p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-muted-grey group-hover:text-machine-orange transition-colors shrink-0 mt-1"
                    />
                  </div>
                  <ul className="text-xs text-muted-grey space-y-1.5">
                    <li className="flex gap-2">
                      <span className="text-machine-orange font-bold">·</span> Power sector
                    </li>
                    <li className="flex gap-2">
                      <span className="text-machine-orange font-bold">·</span> Automobile industry
                    </li>
                    <li className="flex gap-2">
                      <span className="text-machine-orange font-bold">·</span> CNC turned · bush · clamp shaft
                    </li>
                  </ul>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-machine-orange">
                    View details <ArrowRight size={14} />
                  </span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap gap-3"
              >
                <a
                  href="#enquiry"
                  className="inline-flex items-center gap-2 bg-machine-orange text-white font-bold px-6 py-3.5 rounded-xl hover:shadow-lg transition-all"
                >
                  <Send size={18} /> Contact supplier · Get quote
                </a>
                <a
                  href={`${COMPANY.indiaMartUrl}enquiry.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border-2 border-machine-green text-machine-green font-bold px-6 py-3.5 rounded-xl hover:bg-green-light transition-all"
                >
                  <ExternalLink size={18} /> IndiaMART enquiry
                </a>
                <a
                  href="https://wa.me/919876543210"
                  className="inline-flex items-center gap-2 bg-machine-green text-white font-bold px-6 py-3.5 rounded-xl hover:shadow-lg transition-all"
                >
                  <MessageSquare size={18} /> WhatsApp
                </a>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 bg-steel text-white font-bold px-6 py-3.5 rounded-xl hover:shadow-lg transition-all"
                >
                  <Phone size={18} /> Call now
                </a>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { n: `${COMPANY.yearsOnIndiaMART}`, l: 'Yrs on IndiaMART' },
                  { n: `${COMPANY.jobWorkProductCount}`, l: 'Job work lines' },
                  { n: `${COMPANY.machinedComponentCount}`, l: 'Component types' },
                  { n: '2017', l: 'GST registered' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-bg-cloud border border-border-grey rounded-xl p-3 sm:p-4 text-center"
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-machine-orange">{stat.n}</div>
                    <div className="text-[9px] sm:text-[10px] font-semibold text-muted-grey uppercase tracking-wider mt-1 leading-tight">
                      {stat.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Factsheet column — IndiaMART “Nature of business / GST” style */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 lg:sticky lg:top-28 space-y-4"
            >
              <div className="rounded-2xl border-2 border-border-grey overflow-hidden shadow-md">
                <div className="relative aspect-[16/10] max-h-48">
                  <img
                    src={INDIA_MART_IMAGES.cncTurned}
                    alt="CNC turned components — Karan Engineers And Fabrication"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  <p className="absolute bottom-3 left-4 right-4 text-white text-sm font-bold drop-shadow-sm">
                    Precision job work &amp; machined components — Nashik
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-border-grey bg-bg-cloud/60 overflow-hidden">
                <div className="bg-navy text-white px-5 py-4 flex items-center gap-2">
                  <Landmark size={20} className="text-machine-orange shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                      Factsheet
                    </p>
                    <p className="font-bold text-sm sm:text-base">Legal &amp; business profile</p>
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
                    <div key={label} className="px-5 py-3.5 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 bg-white">
                      <dt className="text-muted-grey font-medium shrink-0">{label}</dt>
                      <dd className="font-bold text-navy text-right sm:max-w-[60%]">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="p-5 bg-white border-t border-border-grey">
                  <a
                    href={COMPANY.indiaMartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-navy text-navy font-bold text-sm hover:bg-navy hover:text-white transition-all"
                  >
                    <Briefcase size={18} /> View full IndiaMART profile
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">02 — Services</span>
          <h2 className="text-3xl font-extrabold text-navy mt-2">Our Machining Expertise</h2>
          <p className="text-muted-grey mt-4 max-w-xl mx-auto">
            {COMPANY.listingSummary}
          </p>
        </div>

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
                <h3 className="text-lg font-bold text-navy mb-3">{svc.name}</h3>
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">03 — Infrastructure</span>
            <h2 className="text-3xl font-extrabold text-navy mt-2">Advanced Machine Shop</h2>
            <p className="text-muted-grey mt-4 mb-8 leading-relaxed">
              {COMPANY.natureOfBusiness}; {COMPANY.legalStatus.toLowerCase()} firm. Annual turnover{' '}
              {COMPANY.annualTurnover}. We undertake turning, milling, and CNC machine job work and supply
              machined components to industrial buyers.
            </p>
            
            <div className="space-y-4">
              {MACHINES.map((m, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white border border-border-grey rounded-xl">
                  <div className="mt-1 text-machine-orange"><Settings size={20} /></div>
                  <div>
                    <h4 className="font-bold text-navy">{m.name}</h4>
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
  <section className="py-20 px-4 bg-white border-y border-border-grey">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-machine-orange uppercase tracking-widest">
          <Hash size={14} className="shrink-0" />
          Compliance &amp; sourcing
        </span>
        <h2 className="text-3xl font-extrabold text-navy mt-2">Deals in HSN Code</h2>
        <p className="text-muted-grey mt-3 max-w-2xl mx-auto text-sm">
          HSN classifications as listed on our IndiaMART profile — helpful for buyers, GST, and industrial
          procurement.
        </p>
      </div>
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
    <section className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">04 — Process</span>
          <h2 className="text-3xl font-extrabold text-navy mt-2">How We Work</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="relative bg-white border-2 border-border-grey rounded-2xl p-8">
              <div className="w-10 h-10 bg-machine-orange text-white rounded-full flex items-center justify-center font-bold text-lg mb-6">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-navy mb-3">{step.title}</h3>
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
        <div className="bg-white border-2 border-border-grey rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">05 — Enquiry</span>
            <h2 className="text-3xl font-extrabold text-navy mt-2">Get a Free Quote</h2>
            <p className="text-muted-grey mt-2">Upload your drawing and get a response within 24 hours.</p>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-light text-machine-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-navy">Enquiry Sent!</h3>
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
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="text-xl sm:text-2xl font-extrabold text-navy leading-tight">
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
            <h4 className="font-bold text-navy mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-grey">
              <li><a href="#services" className="hover:text-machine-orange transition-colors">Services</a></li>
              <li><a href="#machines" className="hover:text-machine-orange transition-colors">Infrastructure</a></li>
              <li><a href="#enquiry" className="hover:text-machine-orange transition-colors">Get Quote</a></li>
              <li><a href="#contact" className="hover:text-machine-orange transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-navy mb-6">Our Locations</h4>
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
      <div className="md:hidden px-4 mb-12">
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
      </div>

      <Services />
      <Infrastructure />
      
      {/* Industries Served */}
      <section className="py-20 px-4 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-machine-orange/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">Industries</span>
            <h2 className="text-3xl font-extrabold mt-2">Sectors We Serve</h2>
          </div>
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
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">06 — Gallery</span>
            <h2 className="text-3xl font-extrabold text-navy mt-2">Product gallery</h2>
            <p className="text-muted-grey mt-3 max-w-xl mx-auto text-sm">
              Photos from our IndiaMART catalogue — job work and machined components. Click to open the
              listing.
            </p>
          </div>
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

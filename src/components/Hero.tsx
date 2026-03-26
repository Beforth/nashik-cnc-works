import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, MapPin, ArrowRight, PlayCircle, Phone, MessageSquare } from 'lucide-react';
import { COMPANY, INDIA_MART_IMAGES, CityData, GALLERY_ITEMS } from '../constants';

export default function Hero({ city }: { city: CityData }) {
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

  // Select a few items for the hero cards
  const heroCards = GALLERY_ITEMS.slice(0, 3);

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-b from-bg-cloud via-white to-orange-light/20 min-h-[90vh] flex items-center"
      aria-labelledby="hero-main-title"
    >
      {/* Background Gradients & Meshes */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,96,10,0.08),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-[500px] w-[500px] rounded-full bg-machine-orange/15 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-steel/10 blur-[80px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 backdrop-blur-md border border-navy/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-navy shadow-sm">
                <ShieldCheck size={14} className="text-machine-orange" />
                Verified IndiaMART supplier
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-machine-orange/30 bg-orange-light/80 backdrop-blur-md px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-machine-orange shadow-sm">
                {COMPANY.yearsOnIndiaMART} yrs trusted
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
              <p className="mt-2 mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-grey">
                <MapPin size={18} className="text-machine-orange" />
                {servingLine}
                <span className="hidden sm:inline text-border-grey mx-1">|</span>
                <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded-md">GST {COMPANY.gstin}</span>
              </p>

              <h1
                id="hero-main-title"
                className="text-5xl font-extrabold leading-[1.1] tracking-tight text-navy sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
              >
                Precision CNC{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-machine-orange to-amber bg-clip-text text-transparent">
                    Job Work
                  </span>
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-machine-orange/40 to-amber/40 rounded-full" 
                  />
                </span>{' '}
                <br className="hidden sm:block" />
                & Machined Parts.
              </h1>
              
              <p className="mt-6 text-xl font-bold text-navy sm:text-2xl opacity-90">
                Karan Engineers <span className="text-machine-orange">And Fabrication</span>
              </p>
              
              {headlineAccent && (
                <p className="mt-2 text-lg font-semibold text-muted-grey">{headlineAccent}</p>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="mt-6 text-lg leading-relaxed text-muted-grey sm:text-xl max-w-2xl"
            >
              Expertise in turning, milling, and CNC machining. Supplying top-tier components for power, automotive, and general engineering sectors since {COMPANY.gstRegistrationDate.slice(-4)}.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#enquiry"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-machine-orange to-[#d05608] px-8 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgba(232,96,10,0.3)] transition-all hover:shadow-[0_8px_40px_rgba(232,96,10,0.4)] hover:-translate-y-1"
              >
                Get a Free Quote 
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-navy/10 bg-white/50 backdrop-blur-sm px-8 py-4 text-base font-bold text-navy transition-all hover:border-machine-orange hover:bg-white hover:text-machine-orange shadow-sm hover:shadow-md"
              >
                Explore Services
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              className="mt-10 flex flex-wrap items-center gap-6 border-t border-border-grey/70 pt-8"
            >
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm font-bold text-navy transition hover:text-machine-orange"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-light text-machine-orange transition-transform group-hover:scale-110 shadow-sm">
                  <PlayCircle size={24} strokeWidth={2} />
                </span>
                View IndiaMART Catalogue
              </a>
              <div className="hidden h-10 w-px bg-border-grey/70 sm:block" aria-hidden />
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                <a
                  href="https://wa.me/919876543210"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#128C7E]/10 px-5 py-2.5 text-[#128C7E] hover:bg-[#128C7E]/20 transition-colors"
                >
                  <MessageSquare size={16} /> WhatsApp
                </a>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 rounded-xl bg-steel/10 px-5 py-2.5 text-steel hover:bg-steel/20 transition-colors"
                >
                  <Phone size={16} /> Call Us
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT CONTENT - PHOTO CARDS */}
          <div className="lg:col-span-5 relative h-full min-h-[500px] hidden lg:block perspective-1000">
            {/* Main Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-machine-orange/30 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-dashed border-navy/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
            
            {/* Card 1 - Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: -50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              whileHover={{ scale: 1.05, zIndex: 30 }}
              className="absolute top-[10%] right-[5%] z-20 w-56 rounded-3xl bg-white/90 p-3 shadow-2xl backdrop-blur-xl border border-white/50"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-bg-cloud">
                <img
                  src={heroCards[0].src}
                  alt={heroCards[0].title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 pt-12 text-white">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-machine-orange">Featured</p>
                  <p className="text-sm font-extrabold truncate">{heroCards[0].title}</p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Center Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
              whileHover={{ scale: 1.05, zIndex: 30 }}
              className="absolute top-[40%] left-0 z-20 w-64 rounded-3xl bg-white/90 p-3 shadow-2xl backdrop-blur-xl border border-white/50"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-cloud">
                <img
                  src={heroCards[1].src}
                  alt={heroCards[1].title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 pt-12 text-white">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-amber">High Precision</p>
                  <p className="text-sm font-extrabold truncate">{heroCards[1].title}</p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
              whileHover={{ scale: 1.05, zIndex: 30 }}
              className="absolute bottom-[5%] right-[10%] z-20 w-52 rounded-3xl bg-white/90 p-3 shadow-2xl backdrop-blur-xl border border-white/50"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-bg-cloud">
                <img
                  src={heroCards[2].src}
                  alt={heroCards[2].title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 pt-12 text-white">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-machine-orange">Quality Assured</p>
                  <p className="text-sm font-extrabold truncate">{heroCards[2].title}</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Mobile Display of Hero Cards (stack instead of absolute positioning) */}
          <div className="lg:hidden mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {heroCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl bg-white p-2 shadow-lg border border-border-grey"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-bg-cloud relative">
                  <img
                    src={card.src}
                    alt={card.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-2 pt-6 text-white">
                    <p className="text-xs font-bold leading-tight line-clamp-2">{card.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

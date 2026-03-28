'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, MapPin, PlayCircle } from 'lucide-react';
import { COMPANY, CityData, GALLERY_ITEMS } from '../constants';
import { cn } from '../lib/utils';
import WhatsAppIcon from './WhatsAppIcon';

const SLIDES = [
  {
    id: 0,
    title1: 'Precision CNC',
    highlight: 'Job Work',
    title2: '& Machined Parts.',
    desc: `Expertise in turning, milling, and CNC machining. Supplying top-tier components for power, automotive, and general engineering sectors since ${COMPANY.gstRegistrationDate.slice(-4)}.`,
    image: GALLERY_ITEMS[0].src,
    imageAlt: GALLERY_ITEMS[0].title,
  },
  {
    id: 1,
    title1: 'Advanced',
    highlight: 'Milling',
    title2: '& Operations.',
    desc: 'High-precision milling job work for flats, pockets, slots, and complex prismatic features with repeatable accuracy tailored for industrial buyers.',
    image: GALLERY_ITEMS[1].src,
    imageAlt: GALLERY_ITEMS[1].title,
  },
  {
    id: 2,
    title1: 'High-Quality',
    highlight: 'Components',
    title2: 'For Industries.',
    desc: 'Supplying top-tier machined components for the power sector and automobile industry, including CNC turned parts, bushes, and clamp shafts.',
    image: GALLERY_ITEMS[4].src,
    imageAlt: GALLERY_ITEMS[4].title,
  }
];

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

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 px-4 overflow-hidden bg-white min-h-[90vh] flex items-center"
      aria-labelledby="hero-main-title"
    >
      {/* --- SVG Background Pattern --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 560">
            <g mask="url(#SvgjsMask1002)" fill="none">
                <path d="M1559.34 378.41C1407.15 373.73 1302.06 152.66 997.55 143.21 693.05 133.76 588.09-88.65 435.77-93.41" stroke="rgba(255, 163, 15, 0.58)" strokeWidth="2"></path>
                <path d="M1561.59 367.31C1463.64 367.03 1368.83 297.31 1176.08 297.31 983.32 297.31 1003.89 376.55 790.56 367.31 577.23 358.07 544.84-28.84 405.05-70.18" stroke="rgba(255, 163, 15, 0.58)" strokeWidth="2"></path>
                <path d="M1478.41 460.15C1335.73 457.11 1173.73 280.32 942.27 264.15 710.81 247.98 766.36 18.37 674.2-3.08" stroke="rgba(255, 163, 15, 0.58)" strokeWidth="2"></path>
                <path d="M1691.59 371.9C1510.53 369.11 1278.77 154.3 1002.79 147.9 726.81 141.5 753.84-13.51 658.39-17.74" stroke="rgba(255, 163, 15, 0.58)" strokeWidth="2"></path>
                <path d="M1662.34 244.57C1530.84 247.05 1422.24 420.25 1165.73 418.17 909.22 416.09 831.02 15.66 669.12-12.98" stroke="rgba(255, 163, 15, 0.58)" strokeWidth="2"></path>
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
        className="absolute inset-0 opacity-[0.25]" 
        style={{ 
          backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
          backgroundSize: '40px 40px'
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
          {/* LEFT CONTENT (Text Carousel) */}
          <div className="lg:col-span-7 relative">
            <p className="mt-2 mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-grey">
              <MapPin size={18} className="text-machine-orange" />
              {servingLine}
              <span className="hidden sm:inline text-border-grey mx-1">|</span>
              <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded-md">GST {COMPANY.gstin}</span>
            </p>

            <div className="min-h-[380px] sm:min-h-[320px] md:min-h-[280px] lg:min-h-[340px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <h1
                    id="hero-main-title"
                    className="text-5xl font-extrabold leading-[1.1] tracking-tight text-navy sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
                  >
                    {slide.title1}{' '}
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-machine-orange to-amber bg-clip-text text-transparent">
                        {slide.highlight}
                      </span>
                    </span>{' '}
                    <br className="hidden sm:block" />
                    {slide.title2}
                  </h1>

                  <p className="mt-6 text-xl font-bold text-navy sm:text-2xl opacity-90 hidden sm:block">
                    Karan Engineers <span className="text-machine-orange">& Fabrication</span>
                  </p>

                  {headlineAccent && (
                    <p className="mt-2 text-lg font-semibold text-muted-grey hidden sm:block">{headlineAccent}</p>
                  )}

                  <p className="mt-4 sm:mt-6 text-lg leading-relaxed text-muted-grey sm:text-xl max-w-2xl">
                    {slide.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>


          </div>

          {/* RIGHT CONTENT (Image Carousel) */}
          <div className="lg:col-span-5 relative h-[350px] sm:h-[450px] lg:h-full min-h-[350px] lg:min-h-[500px] mt-2 lg:mt-0 flex items-center justify-center perspective-1000">
            {/* Main Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-machine-orange/30 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] border border-dashed border-navy/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

            <div className="relative w-full max-w-[280px] sm:max-w-sm aspect-[4/5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-20">
              <div className="relative w-full h-full overflow-hidden rounded-2xl bg-bg-cloud group overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={slide.image}
                    alt={slide.imageAlt}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-machine-orange mb-1">Featured Work</p>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={currentSlide}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-lg font-extrabold truncate"
                    >
                      {slide.imageAlt}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-8 bg-machine-orange' : 'w-2 bg-border-grey hover:bg-machine-orange/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

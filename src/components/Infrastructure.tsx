'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, ShieldCheck, Zap, X } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { MACHINES, INDIA_MART_IMAGES } from '../constants';
import { getServiceIcon } from '@/src/lib/service-icons';

const FALLBACK_MACHINES = MACHINES.map((m, i) => ({
  id: `fallback-${i}`,
  name: m.name,
  specs: m.specs,
  iconKey: i === 0 ? 'Wrench' : i === 1 ? 'Settings' : i === 2 ? 'Cpu' : 'Factory',
  imageUrl: i === 0 ? INDIA_MART_IMAGES.turningAlt : i === 1 ? INDIA_MART_IMAGES.milling : i === 2 ? INDIA_MART_IMAGES.cncJob : INDIA_MART_IMAGES.powerSector
}));

export default function Infrastructure({ items }: { items?: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, closeLightbox]);

  const displayItems = items?.length ? items : FALLBACK_MACHINES;

  useEffect(() => {
    setLightbox(null);
  }, [activeIndex]);

  return (
    <section id="machines" className="py-24 px-4 bg-bg-cloud/50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-navy/[0.02] -skew-x-12 transform translate-x-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="Infrastructure"
          kicker="Advanced Machine Shop"
          description="Equipped with heavy-duty machinery to handle complex geometries and large-scale production runs with absolute consistency."
          align="center"
          className="mb-16"
        />

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: Machine Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {displayItems.map((m, i) => {
              const Icon = getServiceIcon(m.iconKey);
              const isActive = activeIndex === i;
              
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex items-start gap-5 group
                    ${isActive 
                      ? 'bg-navy border-navy text-white shadow-xl translate-x-2' 
                      : 'bg-white border-border-grey text-navy hover:border-machine-orange hover:shadow-md'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300
                    ${isActive ? 'bg-machine-orange text-white' : 'bg-bg-steel text-machine-orange group-hover:bg-machine-orange/10'}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-lg font-black tracking-tight ${isActive ? 'text-white' : 'text-navy'}`}>
                        {m.name.replace(' job work', '').replace(' supply', '')}
                      </h4>
                      {isActive && (
                        <motion.div
                          layoutId="active-dot"
                          className="w-2 h-2 rounded-full bg-machine-orange shadow-[0_0_10px_var(--color-machine-orange)]"
                        />
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${isActive ? 'text-white/70' : 'text-muted-grey'}`}>
                      {m.specs}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Quick Stats Banner */}
            <div className="mt-8 p-6 bg-white border border-border-grey rounded-[1.5rem] flex items-center justify-around shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-black text-machine-orange leading-none">100%</div>
                <div className="text-[10px] font-bold text-navy uppercase tracking-widest mt-1">Accuracy</div>
              </div>
              <div className="w-px h-10 bg-border-grey" />
              <div className="text-center">
                <div className="text-2xl font-black text-machine-orange leading-none">24/7</div>
                <div className="text-[10px] font-bold text-navy uppercase tracking-widest mt-1">Operations</div>
              </div>
              <div className="w-px h-10 bg-border-grey" />
              <div className="text-center">
                <div className="text-2xl font-black text-machine-orange leading-none">ISO</div>
                <div className="text-[10px] font-bold text-navy uppercase tracking-widest mt-1">Standards</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Dynamic Blueprint Display */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="relative h-full min-h-[450px] bg-navy rounded-[2.5rem] overflow-hidden shadow-2xl">
              {/* Technical Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
                   style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '30px 30px' }} />
              
              <AnimatePresence mode="wait">
                {displayItems[activeIndex] && (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {displayItems[activeIndex].imageUrl && (
                      <>
                        <img
                          src={displayItems[activeIndex].imageUrl}
                          alt=""
                          className="pointer-events-none h-full w-full object-cover"
                          draggable={false}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setLightbox({
                              src: displayItems[activeIndex].imageUrl,
                              alt: displayItems[activeIndex].name,
                            })
                          }
                          className="absolute inset-0 z-[5] cursor-zoom-in bg-transparent transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-machine-orange"
                          aria-label={`View full image: ${displayItems[activeIndex].name}`}
                        />
                      </>
                    )}

                    {/* Technical Overlay Labels */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-8">
                      <div className="max-w-sm rounded-2xl border border-machine-orange/30 bg-machine-orange/10 p-6 backdrop-blur-md">
                        <div className="mb-3 flex items-center gap-3">
                          <Zap size={20} className="text-machine-orange" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                            Technical Specification
                          </span>
                        </div>
                        <h3 className="mb-2 text-2xl font-black uppercase tracking-tighter text-white">
                          {displayItems[activeIndex].name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/60">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-machine-orange" /> HIGH PRECISION
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Settings size={14} className="text-machine-orange" /> INDUSTRIAL GRADE
                          </span>
                        </div>
                        {displayItems[activeIndex].imageUrl ? (
                          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                            Click photo to view full image
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative Corner Elements */}
              <div className="pointer-events-none absolute top-8 right-8 text-right font-mono text-[10px] text-white/20">
                STATION ID: KE-INFRA-0{activeIndex + 1}<br />
                COORD: 19.9585° N, 73.7463° E
              </div>
              <div className="pointer-events-none absolute bottom-8 right-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/10 animate-[spin_10s_linear_infinite]">
                  <Settings className="text-white/20" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/95 p-4 backdrop-blur-sm md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Full image"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[min(90vh,100%)] max-w-full object-contain shadow-2xl"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

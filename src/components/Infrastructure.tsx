'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Cpu, Factory, Wrench, ShieldCheck, Zap } from 'lucide-react';
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

  const displayItems = items?.length ? items : FALLBACK_MACHINES;

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
                      {isActive && <motion.div layoutId="active-dot" className="w-2 h-2 rounded-full bg-machine-orange shadow-[0_0_10px_#E8600A]" />}
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
                      <img
                        src={displayItems[activeIndex].imageUrl}
                        alt={displayItems[activeIndex].name}
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale contrast-125"
                      />
                    )}
                    
                    {/* Technical Overlay Labels */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="bg-machine-orange/10 backdrop-blur-md border border-machine-orange/30 p-6 rounded-2xl max-w-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap size={20} className="text-machine-orange" />
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Technical Specification</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                          {displayItems[activeIndex].name}
                        </h3>
                        <div className="flex items-center gap-4 text-white/60 text-xs font-bold">
                          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-machine-orange" /> HIGH PRECISION</span>
                          <span className="flex items-center gap-1.5"><Settings size={14} className="text-machine-orange" /> INDUSTRIAL GRADE</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative Corner Elements */}
              <div className="absolute top-8 right-8 text-white/20 font-mono text-[10px] text-right">
                STATION ID: KE-INFRA-0{activeIndex + 1}<br />
                COORD: 19.9585° N, 73.7463° E
              </div>
              <div className="absolute bottom-8 right-8">
                <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                  <Settings className="text-white/20" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

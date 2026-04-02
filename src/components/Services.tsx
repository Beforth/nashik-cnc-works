'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SERVICES, COMPANY } from '../constants';
import SectionHeading from './SectionHeading';
import WhatsAppIcon from './WhatsAppIcon';
import { getServiceIcon } from '@/src/lib/service-icons';
import type { PublicService } from '@/src/types/service';

function staticFallback(): PublicService[] {
  return SERVICES.map((s, i) => ({
    id: s.id,
    iconKey: s.iconKey,
    name: s.name,
    imageUrl: s.image,
    description: s.description,
    sortOrder: i,
  }));
}

export default function Services({ initialServices }: { initialServices?: PublicService[] }) {
  const [items, setItems] = useState<PublicService[] | null>(initialServices || null);

  useEffect(() => {
    if (initialServices) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('bad');
        const data: PublicService[] = await res.json();
        if (!cancelled) setItems(data.sort((a, b) => a.sortOrder - b.sortOrder));
      } catch {
        if (!cancelled) setItems(staticFallback());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = items ?? staticFallback();

  return (
    <section id="services" className="py-24 px-4 bg-bg-steel/30 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-machine-orange/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="Expertise"
          kicker="Our Machining Expertise"
          description="High-precision job work and component manufacturing with industry-leading CNC, VMC, and turning technology."
          align="center"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((svc, i) => {
            const Icon = getServiceIcon(svc.iconKey);
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                key={svc.id}
                className="group relative rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 flex flex-col overflow-hidden hover:border-machine-orange/30 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-bg-cloud">
                  <img
                    src={svc.imageUrl}
                    alt={svc.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col bg-white p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-navy transition-colors group-hover:text-machine-orange sm:text-2xl">
                    <Icon className="h-6 w-6 shrink-0 text-machine-orange opacity-90" aria-hidden />
                    {svc.name}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-grey">{svc.description}</p>
                  <a
                    href={`https://wa.me/91${COMPANY.phone}?text=${encodeURIComponent(`Hello, I would like to get a quote for ${svc.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-black hover:underline"
                  >
                    Get best quote{' '}
                    <WhatsAppIcon size={14} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

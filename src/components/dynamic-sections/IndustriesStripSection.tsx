'use client';

import { motion } from 'motion/react';
import SectionHeading from '@/src/components/SectionHeading';
import { INDUSTRIES } from '@/src/constants';
import { getServiceIcon } from '@/src/lib/service-icons';

export type IndustryItem = { name: string; iconKey?: string };

export type IndustriesStripSectionProps = {
  industryItems?: IndustryItem[];
};

export default function IndustriesStripSection({ industryItems }: IndustriesStripSectionProps) {
  const display = industryItems?.length
    ? industryItems.map((ind) => ({
        name: ind.name,
        Icon: getServiceIcon(ind.iconKey ?? 'Zap'),
      }))
    : INDUSTRIES.map((ind) => ({
        name: ind.name,
        Icon: ind.icon,
      }));

  return (
    <section id="industries" className="relative overflow-hidden bg-navy py-24 px-4 text-white">
      <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-machine-orange/10 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          title="Industries"
          kicker="Sectors We Serve"
          description="Our precision components are trusted by leading companies across various high-growth industrial sectors."
          align="center"
          light
        />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {display.map((ind, i) => {
            const Icon = ind.Icon;
            return (
              <motion.div
                key={`${ind.name}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex cursor-default items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Icon size={18} className="text-machine-orange" aria-hidden />
                {ind.name}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { SERVICES, COMPANY } from '../constants';
import SectionHeading from './SectionHeading';
import WhatsAppIcon from './WhatsAppIcon';

export default function Services() {
  return (
    <section id="services" className="py-24 px-4 bg-bg-steel/30 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-machine-orange/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon as React.ElementType;
            return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              key={svc.id} 
              className="group bg-white/80 backdrop-blur-md border border-white relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-machine-orange/30 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-bg-cloud overflow-hidden rounded-t-3xl">
                <img
                  src={svc.image}
                  alt={svc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/50 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-navy group-hover:text-machine-orange transition-colors" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white">
                <h3 className="mb-3 text-xl font-extrabold text-navy sm:text-2xl group-hover:text-machine-orange transition-colors">{svc.name}</h3>
                <p className="text-sm text-muted-grey leading-relaxed flex-1">{svc.description}</p>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello, I would like to get a quote for ${svc.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-machine-orange hover:underline uppercase tracking-wide cursor-pointer"
                >
                  Get best quote <WhatsAppIcon size={14} />
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

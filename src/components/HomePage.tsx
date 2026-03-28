'use client';
import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  Clock,
  Settings,
} from 'lucide-react';
import {
  CITIES,
  INDUSTRIES,
  GALLERY_ITEMS,
} from '../constants';

import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Infrastructure from './Infrastructure';
import HsnCodes from './HsnCodes';
import HowItWorks from './HowItWorks';
import EnquiryForm from './EnquiryForm';
import Footer from './Footer';
import StickyActions from './StickyActions';
import WhatsAppIcon from './WhatsAppIcon';
import SectionHeading from './SectionHeading';

interface HomePageProps {
  slug?: string;
}

const HomePage = ({ slug }: HomePageProps) => {
  // Find city based on slug or default to Nashik
  const city = CITIES.find(c => c.slug === slug) || CITIES[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
      <section id="industries" className="py-24 px-4 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-machine-orange/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            title="Industries"
            kicker="Sectors We Serve"
            description="Our precision components are trusted by leading companies across various high-growth industrial sectors."
            align="center"
            light
          />
          <div className="flex flex-wrap justify-center gap-4">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 group hover:bg-white/20 transition-colors cursor-default"
                >
                  <Icon size={18} className="text-machine-orange group-hover:scale-110 transition-transform" />
                  {ind.name}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* <HsnCodes /> */}

      <HowItWorks />

      {/* Jobs Gallery (Gallery) — IndiaMART product photos */}
      <section id="gallery" className="py-24 px-4 bg-gradient-to-b from-bg-cloud/80 to-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Jobs Gallery"
            kicker="Product Gallery"
            description="A glimpse of our precision-engineered components, custom fabricated parts, and high-quality machining work."
            align="center"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <a
                key={`${item.title}-${i}`}
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello, I would like to get a quote for ${item.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-machine-orange/20 bg-white shadow-sm hover:border-machine-orange hover:shadow-lg transition-all"
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
                  <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/20 text-[10px] font-bold uppercase tracking-widest text-white transition-colors">
                    Get best quote <WhatsAppIcon size={12} className="text-[#25D366]" />
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

export default HomePage;

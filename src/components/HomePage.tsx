'use client';
import React, { useEffect } from 'react';
import { motion } from 'motion/react';

import {
  CITIES,
  INDUSTRIES,
  GALLERY_ITEMS,
  COMPANY,
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

import { getServiceIcon } from '@/src/lib/service-icons';

interface HomePageProps {
  slug?: string;
  settings?: any;
  heroImages?: any[];
  services?: any[];
  galleryItems?: any[];
  infrastructureItems?: any[];
  industryItems?: any[];
}

const HomePage = ({ slug, settings, heroImages, services, galleryItems, infrastructureItems, industryItems }: HomePageProps) => {
  // Find city based on slug or default to Nashik
  const city = CITIES.find(c => c.slug === slug) || CITIES[0];

  const displayGalleryItems = galleryItems?.length ? galleryItems : GALLERY_ITEMS.map(item => ({ ...item, imageUrl: item.src }));
  const displayIndustries = industryItems?.length ? industryItems : INDUSTRIES;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen">
      <Navbar settings={settings} />
      <Hero city={city} settings={settings} heroImages={heroImages} />



      <Services initialServices={services} />
      <Infrastructure items={infrastructureItems} />

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
            {displayIndustries.map((ind, i) => {
              const Icon = ind.icon || getServiceIcon(ind.iconKey);
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
            {displayGalleryItems.map((item, i) => (
              <a
                key={`${item.title}-${i}`}
                href={`https://wa.me/91${settings?.phone || COMPANY.phone}?text=${encodeURIComponent(`Hello, I would like to get a quote for ${item.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-machine-orange/20 bg-white shadow-sm hover:border-machine-orange hover:shadow-lg transition-all"
              >
                <img
                  src={item.imageUrl}
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

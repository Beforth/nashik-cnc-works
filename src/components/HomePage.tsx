'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

import {
  CITIES,
  INDUSTRIES,
} from '../constants';

import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Infrastructure from './Infrastructure';
import HsnCodes from './HsnCodes';
import HowItWorks from './HowItWorks';
import FeedbackSection from './FeedbackSection';
import EnquiryForm from './EnquiryForm';
import Footer from './Footer';
import StickyActions from './StickyActions';
import SectionHeading from './SectionHeading';
import JobsGallerySection from './JobsGallerySection';

import { getServiceIcon } from '@/src/lib/service-icons';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';

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
  const prevSlugRef = useRef<string | undefined>(undefined);

  const displayGalleryItems = getMergedGalleryItems(galleryItems);
  const displayIndustries = industryItems?.length ? industryItems : INDUSTRIES;

  /** Scroll to top only when switching city (client nav), not on full refresh — keeps hash/scroll position. */
  useEffect(() => {
    if (prevSlugRef.current === undefined) {
      prevSlugRef.current = slug;
      return;
    }
    if (prevSlugRef.current !== slug) {
      window.scrollTo(0, 0);
      prevSlugRef.current = slug;
    }
  }, [slug]);

  return (
    <div className="min-h-screen">
      <Navbar settings={settings} homeHref={slug ? `/${slug}` : '/'} />
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

      <JobsGallerySection items={displayGalleryItems} settings={settings} />

      <FeedbackSection />

      <EnquiryForm />
      <Footer />
      <StickyActions />
    </div>
  );
};

export default HomePage;

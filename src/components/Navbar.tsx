'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { COMPANY } from '../constants';

export default function Navbar({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const companyName = settings?.companyName || COMPANY.siteFullName;
  const address = settings?.address || COMPANY.tagline;
  const phone = settings?.phone || COMPANY.phone;
  const phoneDisplay = settings?.phoneFormatted || COMPANY.contactPhoneDisplay;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Machines', href: '/#machines' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/#contact' },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Rail */}
      <div className="bg-navy text-white/90 py-2 border-b border-white/10 hidden md:block overflow-hidden whitespace-nowrap">
        <div className="flex">
          <motion.div 
            initial={{ x: "0%" }}
            animate={{ x: "-100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 30, 
              ease: "linear" 
            }}
            className="flex items-center gap-4 text-sm font-normal pr-10 shrink-0"
          >
            <span>{companyName} , {address}. Mr. Dinesh Khairnar Mo. {phoneDisplay}</span>
          </motion.div>
          <motion.div 
            initial={{ x: "0%" }}
            animate={{ x: "-100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 30, 
              ease: "linear" 
            }}
            className="flex items-center gap-4 text-sm font-normal pr-10 shrink-0"
          >
            <span>{companyName} , {address}. Mr. Dinesh Khairnar Mo. {phoneDisplay}</span>
          </motion.div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl px-6 py-3">
          <Link
            href="/"
            className="flex min-w-0 max-w-[min(100%,20rem)] items-center gap-2.5 text-lg font-extrabold leading-tight text-navy md:max-w-none md:gap-3 md:text-xl"
          >
            <Image
              src="/logo.png"
              alt={`${companyName} — company logo`}
              width={180}
              height={56}
              className="h-9 w-auto shrink-0 object-contain object-left md:h-11"
              priority
            />
            <span className="min-w-0 sm:whitespace-nowrap">
              {companyName}
            </span>
          </Link>

          {/* Desktop Links - Enhanced Menu Design */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-bg-steel/40 rounded-xl border border-white/50 relative">
            {menuLinks.map(({ label, href }) => (
              <a 
                key={label} 
                href={href} 
                onMouseEnter={() => setHoveredItem(label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "relative px-5 py-2 text-sm font-bold transition-all duration-300 rounded-lg",
                  hoveredItem === label ? "text-machine-orange" : "text-navy"
                )}
              >
                {hoveredItem === label && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white shadow-sm border border-border-grey/30 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a href="/#enquiry" className="bg-machine-orange text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-navy transition-colors shadow-sm">
              Get Quote
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-navy p-2 bg-white/50 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Enhanced Design */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-2xl border border-white rounded-2xl shadow-2xl p-6 md:hidden flex flex-col gap-3 z-50 origin-top"
            >
              <div className="md:hidden border-b border-border-grey/30 pb-4 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-grey mb-2">
                  <MapPin size={14} className="text-machine-orange" />
                  <span>{address}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm font-bold text-navy">
                    <Phone size={14} className="text-machine-orange" />
                    {phoneDisplay}
                  </a>
                </div>
              </div>
              {menuLinks.map(({ label, href }, i) => (
                <motion.a 
                  key={label} 
                  href={href} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-4 py-4 rounded-xl text-lg font-bold text-navy hover:bg-bg-cloud hover:text-machine-orange border border-transparent hover:border-border-grey/50 transition-all group"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                  <ChevronRight size={18} className="text-border-grey group-hover:text-machine-orange transition-transform group-hover:translate-x-1" />
                </motion.a>
              ))}
              <a 
                href="/#enquiry" 
                className="bg-gradient-to-r from-machine-orange to-amber text-white text-center font-bold py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                Get Free Quote <ChevronRight size={18} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

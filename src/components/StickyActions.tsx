'use client';
import React from 'react';
import { Phone } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

const StickyActions = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <a
        href="tel:+919876543210"
        className="group relative w-14 h-14 bg-navy text-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_20px_rgba(10,37,64,0.4)] transition-all duration-300"
        aria-label="Call Us"
      >
        <span className="absolute right-full mr-4 bg-white text-navy text-sm font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          Call Us
        </span>
        <Phone size={24} />
      </a>
      <a
        href="https://wa.me/919876543210"
        className="group relative w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-all duration-300"
        aria-label="WhatsApp Us"
      >
        <span className="absolute right-full mr-4 bg-white text-navy text-sm font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          WhatsApp Us
        </span>
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
};

export default StickyActions;

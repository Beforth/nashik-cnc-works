'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['Services', 'Machines', 'Gallery', 'Contact'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl px-6 py-3">
        <Link href="/" className="text-lg md:text-xl font-extrabold text-navy leading-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-machine-orange to-amber flex items-center justify-center text-white text-sm">KE</div>
          <span>Karan Engineers <span className="text-machine-orange block sm:inline text-sm sm:text-lg">& Fabrication</span></span>
        </Link>

        {/* Desktop Links - Enhanced Menu Design */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-bg-steel/40 rounded-xl border border-white/50 relative">
          {menuItems.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "relative px-5 py-2 text-sm font-bold transition-all duration-300 rounded-lg",
                hoveredItem === item ? "text-machine-orange" : "text-navy"
              )}
            >
              {hoveredItem === item && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-white shadow-sm border border-border-grey/30 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a href="#enquiry" className="bg-machine-orange text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-navy transition-colors shadow-sm">
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
            {menuItems.map((item, i) => (
              <motion.a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-4 py-4 rounded-xl text-lg font-bold text-navy hover:bg-bg-cloud hover:text-machine-orange border border-transparent hover:border-border-grey/50 transition-all group"
                onClick={() => setIsOpen(false)}
              >
                {item}
                <ChevronRight size={18} className="text-border-grey group-hover:text-machine-orange transition-transform group-hover:translate-x-1" />
              </motion.a>
            ))}
            <a 
              href="#enquiry" 
              className="bg-gradient-to-r from-machine-orange to-amber text-white text-center font-bold py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              Get Free Quote <ChevronRight size={18} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

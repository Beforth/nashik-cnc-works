import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
      scrolled ? "bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20" : "bg-transparent"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between transition-all duration-300",
        scrolled ? "px-2 py-1" : "bg-white/80 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl px-6 py-3"
      )}>
        <Link to="/" className="text-lg md:text-xl font-extrabold text-navy leading-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-machine-orange to-amber flex items-center justify-center text-white text-sm">KE</div>
          <span>Karan Engineers <span className="text-machine-orange block sm:inline text-sm sm:text-lg">And Fab.</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 bg-white/40 px-6 py-2 rounded-xl backdrop-blur-sm border border-white/50">
          {['Services', 'Machines', 'Gallery', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-navy hover:text-machine-orange transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a href="#enquiry" className="bg-navy text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-machine-orange transition-colors shadow-sm">
            Get Quote
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-navy p-2 bg-white/50 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-2xl border border-white rounded-2xl shadow-2xl p-6 md:hidden flex flex-col gap-4 z-50 origin-top"
          >
            {['Services', 'Machines', 'Gallery', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-lg font-bold text-navy border-b border-border-grey pb-3"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <a 
              href="#enquiry" 
              className="bg-gradient-to-r from-machine-orange to-amber text-white text-center font-bold py-4 rounded-xl shadow-lg mt-4"
              onClick={() => setIsOpen(false)}
            >
              Get Free Quote
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

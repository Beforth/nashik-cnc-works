'use client';
import React from 'react';
import Link from 'next/link';
import { COMPANY, CITIES } from '../constants';

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-border-grey pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link
              href="/"
              className="text-2xl font-extrabold leading-tight text-navy sm:text-3xl md:text-[1.75rem]"
            >
              Karan Engineers <span className="text-machine-orange">& Fabrication</span>, Nashik
            </Link>
            <p className="text-muted-grey mt-4 max-w-sm leading-relaxed">
              {COMPANY.tagline} Nature of business: {COMPANY.natureOfBusiness.toLowerCase()}. CEO:{' '}
              {COMPANY.ceo}.
            </p>
            <p className="text-xs text-muted-grey mt-3 font-mono">
              GSTIN: {COMPANY.gstin} · Reg. {COMPANY.gstRegistrationDate}
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-extrabold text-navy sm:text-xl">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-grey">
              <li><a href="#services" className="hover:text-machine-orange transition-colors">Services</a></li>
              <li><a href="#machines" className="hover:text-machine-orange transition-colors">Infrastructure</a></li>
              <li><a href="#enquiry" className="hover:text-machine-orange transition-colors">Get Quote</a></li>
              <li><a href="#contact" className="hover:text-machine-orange transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-extrabold text-navy sm:text-xl">Our Locations</h4>
            <ul className="space-y-3 text-sm text-muted-grey">
              {CITIES.map(city => (
                <li key={city.id}><Link href={`/${city.slug}`} className="hover:text-machine-orange transition-colors">{city.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-grey pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
          <div className="text-xs text-muted-grey">
            © 2025 Karan Engineers & Fabrication, Nashik. All rights reserved.
          </div>
          <div className="text-xs text-muted-grey">
            Made with ❤️ by <span className="text-machine-orange font-bold">Beforth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

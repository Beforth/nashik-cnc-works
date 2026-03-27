'use client';
import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
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
            <div className="flex gap-4 mt-8">
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-bg-steel rounded-lg flex items-center justify-center text-navy hover:bg-machine-orange hover:text-white transition-all"
                title="IndiaMART — Karan Engineers & Fabrication"
              >
                <Phone size={18} />
              </a>
              <a
                href={`${COMPANY.indiaMartUrl}enquiry.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-bg-steel rounded-lg flex items-center justify-center text-navy hover:bg-machine-orange hover:text-white transition-all"
                title="Enquiry on IndiaMART"
              >
                <Mail size={18} />
              </a>
              <a
                href={COMPANY.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-bg-steel rounded-lg flex items-center justify-center text-navy hover:bg-machine-orange hover:text-white transition-all"
                title="Nashik, Maharashtra"
              >
                <MapPin size={18} />
              </a>
            </div>
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

        <div className="border-t border-border-grey pt-10 flex flex-col items-center justify-center gap-6 text-center">
          <div className="text-xs text-muted-grey">
            © 2025 Karan Engineers & Fabrication, Nashik. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

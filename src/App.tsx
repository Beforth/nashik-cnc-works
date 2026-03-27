import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Settings,
  ShieldCheck,
  Zap,
  Clock,
  Upload,
  Send,
  ExternalLink,
  Briefcase,
  Landmark,
  Hash,
  PlayCircle
} from 'lucide-react';
import { cn } from './lib/utils';
import {
  CITIES,
  SERVICES,
  MACHINES,
  INDUSTRIES,
  STEPS,
  CityData,
  COMPANY,
  GALLERY_ITEMS,
  HSN_CODES,
  INDIA_MART_IMAGES,
} from './constants';

import SectionHeading from './components/SectionHeading';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhatsAppIcon from './components/WhatsAppIcon';


const Infrastructure = () => {
  return (
    <section id="machines" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start md:items-center">
          <div>
            <SectionHeading
              align="left"
              className="md:mb-10"
              kicker="Infrastructure"
              title="Advanced machine shop"
              description={`${COMPANY.natureOfBusiness}; ${COMPANY.legalStatus.toLowerCase()} firm. Annual turnover ${COMPANY.annualTurnover}. We undertake turning, milling, and CNC machine job work and supply machined components to industrial buyers.`}
            />

            <div className="space-y-4">
              {MACHINES.map((m, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white border border-border-grey rounded-xl">
                  <div className="mt-1 text-machine-orange"><Settings size={20} /></div>
                  <div>
                    <h4 className="text-base font-extrabold text-navy sm:text-lg">{m.name}</h4>
                    <p className="text-xs text-muted-grey mt-1">{m.specs}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src={INDIA_MART_IMAGES.turningAlt}
              alt="Turning machine job work"
              className="rounded-2xl border-2 border-border-grey shadow-md aspect-[3/4] object-cover hover:shadow-lg transition-shadow"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col gap-4">
              <img
                src={INDIA_MART_IMAGES.milling}
                alt="Milling machine job"
                className="rounded-2xl border-2 border-border-grey shadow-md aspect-square object-cover hover:shadow-lg transition-shadow"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <img
                src={INDIA_MART_IMAGES.automobile}
                alt="Components for automobile industry"
                className="rounded-2xl border-2 border-border-grey shadow-md aspect-square object-cover hover:shadow-lg transition-shadow"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HsnCodes = () => (
  <section id="hsn" className="py-20 px-4 bg-white border-y border-border-grey">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        // topIcon={<Hash size={26} className="text-machine-orange md:w-7 md:h-7" strokeWidth={2} />}
        kicker="HSN & compliance"
        title="Deals in HSN code"
        description="HSN classifications as listed on our IndiaMART profile — helpful for buyers, GST, and industrial procurement."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HSN_CODES.map((row) => (
          <motion.div
            key={row.code}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-cloud border border-border-grey rounded-2xl p-5 hover:border-machine-orange/40 hover:shadow-sm transition-all"
          >
            <p className="font-mono font-bold text-machine-orange text-lg">{row.code}</p>
            <p className="text-xs text-muted-grey leading-relaxed mt-2">{row.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  return (
    <section id="process" className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading kicker="Process" title="How we work" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="relative bg-white border-2 border-border-grey rounded-2xl p-8">
              <div className="w-10 h-10 bg-machine-orange text-white rounded-full flex items-center justify-center font-bold text-lg mb-6">
                {step.num}
              </div>
              <h3 className="mb-3 text-lg font-extrabold text-navy sm:text-xl">{step.title}</h3>
              <p className="text-xs text-muted-grey leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EnquiryForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="enquiry" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          kicker="Enquiry"
          title="Get a free quote"
          description="Upload your drawing and get a response within 24 hours."
          className="mb-10"
        />
        <div className="bg-white border-2 border-border-grey rounded-3xl p-8 md:p-12 shadow-xl">
          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-light text-machine-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-extrabold text-navy sm:text-4xl">Enquiry Sent!</h3>
              <p className="text-muted-grey mt-2">We will get back to you shortly.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 text-machine-orange font-bold underline"
              >
                Send another enquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Your Name *</label>
                  <input required type="text" placeholder="e.g. Raju Patil" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Phone Number *</label>
                  <input required type="tel" placeholder="e.g. 98765 43210" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Email (Optional)</label>
                <input type="email" placeholder="yourname@email.com" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Material</label>
                  <select className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all bg-white">
                    <option>Select material...</option>
                    <option>MS Steel</option>
                    <option>Stainless Steel</option>
                    <option>Aluminum</option>
                    <option>Brass</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Quantity</label>
                  <input type="number" placeholder="e.g. 100 pcs" className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Message / Requirements</label>
                <textarea rows={4} placeholder="Describe your part requirement..." className="w-full px-4 py-3 border-2 border-border-grey rounded-xl focus:border-machine-orange outline-none transition-all resize-none"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Upload Drawing (PDF, DXF, JPG)</label>
                <div className="relative border-2 border-dashed border-border-grey rounded-xl p-8 text-center hover:border-machine-orange transition-all cursor-pointer">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload className="mx-auto text-muted-grey mb-2" size={24} />
                  <p className="text-sm text-muted-grey">Click to upload or drag and drop</p>
                </div>
              </div>

              <div className="bg-green-light border border-machine-green/20 rounded-xl p-4 flex flex-wrap gap-4 text-xs text-machine-green font-medium">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Response within 24 hours</span>
                <span className="flex items-center gap-1"><ShieldCheck size={14} /> Confidential drawings</span>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-machine-orange text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {status === 'sending' ? 'Sending...' : <><Send size={18} /> Send Enquiry</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-border-grey pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          size="compact"
          kicker="Contact"
          title="Get in touch"
          description="Reach us via IndiaMART, the form above, or the links below. Based in Nashik, Maharashtra."
          className="mb-14"
        />
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link
              to="/"
              className="text-2xl font-extrabold leading-tight text-navy sm:text-3xl md:text-[1.75rem]"
            >
              Karan Engineers <span className="text-machine-orange">And Fabrication</span>, Nashik
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
                title="IndiaMART — Karan Engineers And Fabrication"
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
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-bg-steel rounded-lg flex items-center justify-center text-navy hover:bg-machine-orange hover:text-white transition-all"
                title="Nashik, Maharashtra"
              >
                <MapPin size={18} />
              </a>
            </div>
            <p className="text-xs text-muted-grey mt-4">
              <a
                href={COMPANY.indiaMartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-machine-orange font-semibold hover:underline"
              >
                View profile on IndiaMART
              </a>
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
                <li key={city.id}><Link to={`/${city.slug}`} className="hover:text-machine-orange transition-colors">{city.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-grey pt-10 flex flex-col items-center justify-center gap-6 text-center">
          <div className="text-xs text-muted-grey">
            © 2025 Karan Engineers And Fabrication, Nashik. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

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

// --- Page Components ---

const HomePage = () => {
  const { slug } = useParams();
  const location = useLocation();

  // Find city based on slug or default to Nashik
  const city = CITIES.find(c => c.slug === slug) || CITIES[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      <section id="industries" className="py-20 px-4 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-machine-orange/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            light
            kicker="Industries"
            title="Sectors we serve"
            description="Job work and machined components for power, automotive, engineering, and allied industries."
          />
          <div className="flex flex-wrap justify-center gap-4">
            {INDUSTRIES.map((ind, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-sm font-semibold"
              >
                {ind}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HsnCodes />

      <HowItWorks />

      {/* Work Showcase (Gallery) — IndiaMART product photos */}
      <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-bg-cloud/80 to-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            kicker="Gallery"
            title="Product gallery"
            description="Photos of our job work and machined components. Click to get a direct quote securely on WhatsApp."
            className="mb-12 md:mb-14"
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
                  <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/20 text-[10px] font-bold uppercase tracking-widest text-[#25D366] group-hover:text-white transition-colors">
                    Get best quote <WhatsAppIcon size={12} />
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

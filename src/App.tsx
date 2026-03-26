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
  MessageSquare, 
  ArrowRight,
  Settings,
  ShieldCheck,
  Zap,
  Clock,
  Upload,
  Send
} from 'lucide-react';
import { cn } from './lib/utils';
import { CITIES, SERVICES, MACHINES, INDUSTRIES, STEPS, CityData, COMPANY } from './constants';

// --- Components ---

const Navbar = () => {
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
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white border border-border-grey rounded-xl px-6 py-3">
        <Link to="/" className="text-base sm:text-lg md:text-xl font-extrabold text-navy leading-tight">
          Karan Engineers <span className="text-machine-orange">And Fabrication</span>, Nashik
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Services', 'Machines', 'Gallery', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-grey hover:text-machine-orange transition-colors">
              {item}
            </a>
          ))}
          <a href="#enquiry" className="bg-machine-orange text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-machine-orange/90 transition-all shadow-sm">
            Get Quote
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-navy" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-2 bg-white border border-border-grey rounded-xl shadow-xl p-6 md:hidden flex flex-col gap-4"
          >
            {['Services', 'Machines', 'Gallery', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-base font-semibold text-navy"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <a 
              href="#enquiry" 
              className="bg-machine-orange text-white text-center font-bold py-3 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Get Quote
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ city }: { city: CityData }) => {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-white border-2 border-border-grey rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-light rounded-full opacity-50" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-bg-steel rounded-full opacity-50" />

          <div className="relative z-10 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-orange-light border border-machine-orange/20 text-machine-orange text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            >
              Nashik • Maharashtra • {COMPANY.yearsOnIndiaMART} Yrs
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6"
            >
              {city.title.includes(' in ') ? (
                <>
                  {city.title.split(' in ')[0]}{' '}
                  <span className="text-machine-orange block md:inline">
                    in {city.title.split(' in ')[1]}
                  </span>
                </>
              ) : (
                city.title
              )}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base text-muted-grey mb-8 leading-relaxed"
            >
              {COMPANY.tagline} Turning, milling, and CNC machine job work; machined components
              including power sector, automobile industry, CNC turned parts, bush, and clamp shaft.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#enquiry" className="flex items-center gap-2 bg-machine-orange text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                <Send size={18} /> Get Quote
              </a>
              <a href="https://wa.me/919876543210" className="flex items-center gap-2 bg-machine-green text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                <MessageSquare size={18} /> WhatsApp
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 bg-steel text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                <Phone size={18} /> Call Now
              </a>
            </motion.div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {[
                { n: `${COMPANY.yearsOnIndiaMART}`, l: 'Yrs on IndiaMART' },
                { n: `${COMPANY.jobWorkProductCount}`, l: 'Job Work Lines' },
                { n: `${COMPANY.machinedComponentCount}`, l: 'Component Types' },
                { n: '2017', l: 'GST Registered' },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-cloud border border-border-grey rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-machine-orange">{stat.n}</div>
                  <div className="text-[10px] font-semibold text-muted-grey uppercase tracking-wider mt-1">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">02 — Services</span>
          <h2 className="text-3xl font-extrabold text-navy mt-2">Our Machining Expertise</h2>
          <p className="text-muted-grey mt-4 max-w-xl mx-auto">
            Job work (turning, milling, CNC) and machined components — factory / manufacturing and works
            contract from Nashik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((svc) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={svc.id} 
              className="bg-white border-2 border-border-grey rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 bg-orange-light rounded-xl flex items-center justify-center text-3xl mb-6">
                {svc.icon}
              </div>
              <h3 className="text-lg font-bold text-navy mb-3">{svc.name}</h3>
              <p className="text-sm text-muted-grey leading-relaxed">{svc.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Infrastructure = () => {
  return (
    <section id="machines" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">03 — Infrastructure</span>
            <h2 className="text-3xl font-extrabold text-navy mt-2">Advanced Machine Shop</h2>
            <p className="text-muted-grey mt-4 mb-8 leading-relaxed">
              {COMPANY.natureOfBusiness}; {COMPANY.legalStatus.toLowerCase()} firm. Annual turnover{' '}
              {COMPANY.annualTurnover}. We undertake turning, milling, and CNC machine job work and supply
              machined components to industrial buyers.
            </p>
            
            <div className="space-y-4">
              {MACHINES.map((m, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white border border-border-grey rounded-xl">
                  <div className="mt-1 text-machine-orange"><Settings size={20} /></div>
                  <div>
                    <h4 className="font-bold text-navy">{m.name}</h4>
                    <p className="text-xs text-muted-grey mt-1">{m.specs}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://picsum.photos/seed/machine1/600/800" 
              alt="CNC Machine" 
              className="rounded-2xl border border-border-grey shadow-sm aspect-[3/4] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col gap-4">
              <img 
                src="https://picsum.photos/seed/machine2/600/400" 
                alt="VMC Machine" 
                className="rounded-2xl border border-border-grey shadow-sm aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://picsum.photos/seed/parts/600/400" 
                alt="Machined Parts" 
                className="rounded-2xl border border-border-grey shadow-sm aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">04 — Process</span>
          <h2 className="text-3xl font-extrabold text-navy mt-2">How We Work</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="relative bg-white border-2 border-border-grey rounded-2xl p-8">
              <div className="w-10 h-10 bg-machine-orange text-white rounded-full flex items-center justify-center font-bold text-lg mb-6">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-navy mb-3">{step.title}</h3>
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
        <div className="bg-white border-2 border-border-grey rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">05 — Enquiry</span>
            <h2 className="text-3xl font-extrabold text-navy mt-2">Get a Free Quote</h2>
            <p className="text-muted-grey mt-2">Upload your drawing and get a response within 24 hours.</p>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-light text-machine-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-navy">Enquiry Sent!</h3>
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
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="text-xl sm:text-2xl font-extrabold text-navy leading-tight">
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
            <h4 className="font-bold text-navy mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-grey">
              <li><a href="#services" className="hover:text-machine-orange transition-colors">Services</a></li>
              <li><a href="#machines" className="hover:text-machine-orange transition-colors">Infrastructure</a></li>
              <li><a href="#enquiry" className="hover:text-machine-orange transition-colors">Get Quote</a></li>
              <li><a href="#contact" className="hover:text-machine-orange transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-navy mb-6">Our Locations</h4>
            <ul className="space-y-3 text-sm text-muted-grey">
              {CITIES.map(city => (
                <li key={city.id}><Link to={`/${city.slug}`} className="hover:text-machine-orange transition-colors">{city.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-grey pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
          <div className="text-xs text-muted-grey">
            © 2025 Karan Engineers And Fabrication, Nashik. All rights reserved.
          </div>
          <div className="text-xs text-muted-grey">
            Made with ❤️ by <span className="text-machine-orange font-bold">Beforth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const StickyActions = () => {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 flex gap-3 md:hidden">
      <a href="tel:+919876543210" className="flex-1 bg-steel text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center gap-2">
        <Phone size={20} /> Call Now
      </a>
      <a href="https://wa.me/919876543210" className="flex-1 bg-machine-green text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center gap-2">
        <MessageSquare size={20} /> WhatsApp
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
      <div className="md:hidden px-4 mb-12">
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
      </div>

      <Services />
      <Infrastructure />
      
      {/* Industries Served */}
      <section className="py-20 px-4 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-machine-orange/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">Industries</span>
            <h2 className="text-3xl font-extrabold mt-2">Sectors We Serve</h2>
          </div>
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

      <HowItWorks />
      
      {/* Work Showcase (Gallery) */}
      <section id="gallery" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-machine-orange uppercase tracking-widest">06 — Gallery</span>
            <h2 className="text-3xl font-extrabold text-navy mt-2">Our Recent Work</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="group relative aspect-square overflow-hidden rounded-2xl border border-border-grey">
                <img 
                  src={`https://picsum.photos/seed/part${n}/600/600`} 
                  alt={`Machined Part ${n}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                  <div className="text-white">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1">Precision Part</div>
                    <div className="text-[10px] opacity-80">Material: Aluminum · VMC</div>
                  </div>
                </div>
              </div>
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

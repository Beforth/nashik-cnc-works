'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Upload, Send, MapPin, Plus, Minus } from 'lucide-react';
import SectionHeading from './SectionHeading';

const EnquiryForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [showDrawing, setShowDrawing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSubmitWarning(null);
    setStatus('sending');

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get('name') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      material: String(fd.get('material') || '').trim(),
      qty: String(fd.get('qty') || '').trim(),
      requirements: String(fd.get('requirements') || '').trim(),
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        warning?: string;
      };

      if (!res.ok) {
        setFormError(typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.');
        setStatus('idle');
        return;
      }

      if (typeof data.warning === 'string' && data.warning.length > 0) {
        setSubmitWarning(data.warning);
      }
      setStatus('success');
      form.reset();
    } catch {
      setFormError('Could not reach the server. Check your connection and try again.');
      setStatus('idle');
    }
  };

  return (
    <section id="enquiry" className="py-24 px-4 bg-bg-steel/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute -left-20 top-20 w-64 h-64 bg-machine-orange/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="Enquiry"
          description="Partner with Nashik's leading CNC & VMC specialists for your next precision project."
          align="center"
          className="mb-16"
        />

        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* LEFT COLUMN: Location Details */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-border-grey rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:border-machine-orange transition-all duration-500">
              {/* Decorative technical corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-machine-orange/5 rounded-bl-[3rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
              
              <div className="relative mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-machine-orange/10 text-machine-orange text-[10px] font-black uppercase tracking-wider mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-machine-orange animate-pulse" />
                  Operational Hub
                </div>
                <h3 className="text-3xl font-black text-navy tracking-tighter">OUR <span className="text-machine-orange">FACILITY.</span></h3>
              </div>

              <div className="mb-8 rounded-[1.5rem] overflow-hidden border-2 border-border-grey h-72 relative bg-bg-steel group/map shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.972355554162!2d73.744133875887!3d19.95854428143438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeca9b8ef1663%3A0x1bec7d08fd8b7fec!2sKaran%20Engineers%20%26%20Fabrication%20-%20CNC%20VMC%20MACHINING%20Jobwork%20Nashik!5e0!3m2!1sen!2sin!4v1711641600000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Karan Engineers Location"
                  className="grayscale contrast-125 brightness-90 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700 scale-105 group-hover/map:scale-100"
                />
                <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 rounded-[1.5rem]" />
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-bg-cloud/50 border border-border-grey/50 group-hover:bg-white transition-colors duration-300">
                    <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:bg-machine-orange transition-colors duration-300">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-machine-orange uppercase tracking-[0.2em] mb-1">Corporate Address</div>
                      <p className="text-lg font-bold text-navy leading-tight">
                        Ambad Industrial Area,<br />
                        Nashik, Maharashtra — 422010
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border-grey rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">
              
              {status === 'success' ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-green-light text-machine-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-navy sm:text-4xl">Enquiry Sent!</h3>
                  <p className="text-muted-grey mt-4 text-lg">Our engineering team will review your requirements and respond within 24 hours.</p>
                  {submitWarning ? (
                    <p className="mx-auto mt-4 max-w-md text-sm text-muted-grey">{submitWarning}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setSubmitWarning(null);
                    }}
                    className="mt-8 px-8 py-3 bg-navy text-white font-bold rounded-xl hover:bg-machine-orange transition-colors"
                  >
                    Send Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {formError ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
                      {formError}
                    </p>
                  ) : null}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        required
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder=" "
                        className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all"
                      />
                      <label htmlFor="name" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Your Name *</label>
                    </div>
                    <div className="relative group">
                      <input
                        required
                        type="tel"
                        id="phone"
                        name="phone"
                        autoComplete="tel"
                        placeholder=" "
                        className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all"
                      />
                      <label htmlFor="phone" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Phone Number *</label>
                    </div>
                  </div>

                  <div className="relative group">
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      placeholder=" "
                      className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all"
                    />
                    <label htmlFor="email" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Email Address *</label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <select
                        id="material"
                        name="material"
                        defaultValue=""
                        className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all cursor-pointer"
                      >
                        <option value="" disabled hidden>Select Material...</option>
                        <option value="MS Steel">Mild Steel (MS)</option>
                        <option value="Stainless Steel">Stainless Steel (SS)</option>
                        <option value="Aluminum">Aluminum</option>
                        <option value="Brass">Brass / Copper</option>
                        <option value="Other">Other Alloy</option>
                      </select>
                      <label htmlFor="material" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-focus:text-machine-orange pointer-events-none">Material Category</label>
                    </div>
                    <div className="relative group">
                      <input
                        type="number"
                        id="qty"
                        name="qty"
                        min={0}
                        placeholder=" "
                        className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all"
                      />
                      <label htmlFor="qty" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Estimated Quantity</label>
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea
                      rows={4}
                      id="reqs"
                      name="requirements"
                      placeholder=" "
                      className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all resize-none"
                    />
                    <label htmlFor="reqs" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Detailed Requirements</label>
                  </div>

                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setShowDrawing(!showDrawing)}
                      className="flex items-center gap-2 text-sm font-extrabold text-navy hover:text-machine-orange transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-bg-steel flex items-center justify-center text-navy">
                        {showDrawing ? <Minus size={14} /> : <Plus size={14} />}
                      </div>
                      Add Project Drawing (Optional)
                    </button>
                    
                    <AnimatePresence>
                      {showDrawing && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="relative border-2 border-dashed border-border-grey rounded-2xl p-6 text-center hover:border-machine-orange hover:bg-machine-orange/5 transition-all cursor-pointer group">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Upload className="mx-auto text-muted-grey group-hover:text-machine-orange mb-2 transition-colors" size={24} />
                            <p className="text-xs font-bold text-muted-grey group-hover:text-navy">Click to upload drawing (PDF, DXF, IMG)</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-black text-white font-black text-lg py-5 rounded-2xl shadow-xl hover:bg-navy hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {status === 'sending' ? 'Processing...' : <><Send size={20} /> Get Best Quote</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;

'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, Upload, Send, Zap, Clock, MessageSquare, Award } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FEATURES = [
  {
    icon: Zap,
    title: 'Fast Quote',
    desc: 'Receive a detailed pricing estimate within 24 hours of enquiry.'
  },
  {
    icon: ShieldCheck,
    title: 'Precision Quality',
    desc: 'Sub-micron accuracy for complex industrial components.'
  },
  {
    icon: MessageSquare,
    title: 'Expert Support',
    desc: 'Direct consultation with our engineering team for technical specs.'
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    desc: 'Efficient production cycles to meet your strict project deadlines.'
  }
];

const EnquiryForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="enquiry" className="py-24 px-4 bg-bg-steel/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute -left-20 top-20 w-64 h-64 bg-machine-orange/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: Attractive Features */}
          <div className="lg:col-span-5 pt-4">
            <SectionHeading
              title="Get a Free Quote"
              description="Partner with Nashik's leading CNC & VMC specialists for your next precision project."
              align="left"
              className="mb-10"
            />
            
            <div className="grid gap-8">
              {FEATURES.map((f, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex gap-5 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-border-grey flex items-center justify-center text-machine-orange group-hover:bg-machine-orange group-hover:text-white transition-all duration-300">
                    <f.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-navy mb-1">{f.title}</h4>
                    <p className="text-sm text-muted-grey leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-navy rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-machine-orange/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
              <Award className="text-machine-orange mb-4" size={32} />
              <div className="text-xl font-bold mb-2">ISO Standard Compliance</div>
              <p className="text-white/70 text-sm">We strictly follow international quality standards for all job work and manufactured components.</p>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border-grey rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
              <div className="absolute top-0 right-12 w-12 h-1 bg-machine-orange rounded-b-full" />
              
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
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 px-8 py-3 bg-navy text-white font-bold rounded-xl hover:bg-machine-orange transition-colors"
                  >
                    Send Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input required type="text" id="name" placeholder=" " className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all" />
                      <label htmlFor="name" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Your Name *</label>
                    </div>
                    <div className="relative group">
                      <input required type="tel" id="phone" placeholder=" " className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all" />
                      <label htmlFor="phone" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Phone Number *</label>
                    </div>
                  </div>

                  <div className="relative group">
                    <input type="email" id="email" placeholder=" " className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all" />
                    <label htmlFor="email" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Email Address (Optional)</label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <select id="material" defaultValue="" className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all cursor-pointer">
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
                      <input type="number" id="qty" placeholder=" " className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all" />
                      <label htmlFor="qty" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Estimated Quantity</label>
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea rows={4} id="reqs" placeholder=" " className="block w-full px-5 py-4 text-navy bg-bg-cloud/30 border border-border-grey rounded-2xl appearance-none focus:outline-none focus:border-machine-orange focus:bg-white peer transition-all resize-none"></textarea>
                    <label htmlFor="reqs" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-4 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Detailed Requirements</label>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-navy ml-1 uppercase tracking-wider">Project Drawing (PDF / DXF / Image)</label>
                    <div className="relative border-2 border-dashed border-border-grey rounded-2xl p-8 text-center hover:border-machine-orange hover:bg-machine-orange/5 transition-all cursor-pointer group">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Upload className="mx-auto text-muted-grey group-hover:text-machine-orange mb-2 transition-colors" size={32} />
                      <p className="text-sm font-bold text-muted-grey group-hover:text-navy">Click to upload or drag files here</p>
                      <p className="text-[10px] text-muted-grey/60 mt-1 uppercase tracking-tighter">Max file size: 10MB</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <div className="flex-1 bg-green-light/50 border border-machine-green/20 rounded-2xl p-4 flex items-center gap-3">
                      <ShieldCheck className="text-machine-green flex-shrink-0" size={24} />
                      <div className="text-[10px] leading-tight font-bold text-machine-green uppercase tracking-wide">Your designs are 100% confidential and secure with us.</div>
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="flex-[1.5] bg-machine-orange text-white font-black text-lg py-5 rounded-2xl shadow-xl hover:bg-navy hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
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

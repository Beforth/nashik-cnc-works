'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, Upload, Send } from 'lucide-react';
import SectionHeading from './SectionHeading';

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
          title="Enquiry"
          kicker="Get a Free Quote"
          description="Send us your drawings or requirements and our team will get back to you with a competitive quote within 24 hours."
          align="center"
          className="mb-12"
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
              <div className="grid md:grid-cols-2 gap-6 pt-3">
                <div className="relative">
                  <input required type="text" id="name" placeholder=" " className="block w-full px-4 py-3.5 text-navy bg-transparent border-2 border-border-grey rounded-xl appearance-none focus:outline-none focus:border-machine-orange peer transition-colors" />
                  <label htmlFor="name" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Your Name *</label>
                </div>
                <div className="relative">
                  <input required type="tel" id="phone" placeholder=" " className="block w-full px-4 py-3.5 text-navy bg-transparent border-2 border-border-grey rounded-xl appearance-none focus:outline-none focus:border-machine-orange peer transition-colors" />
                  <label htmlFor="phone" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Phone Number *</label>
                </div>
              </div>

              <div className="relative">
                <input type="email" id="email" placeholder=" " className="block w-full px-4 py-3.5 text-navy bg-transparent border-2 border-border-grey rounded-xl appearance-none focus:outline-none focus:border-machine-orange peer transition-colors" />
                <label htmlFor="email" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Email (Optional)</label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <select id="material" defaultValue="" className="block w-full px-4 py-3.5 text-navy bg-transparent border-2 border-border-grey rounded-xl appearance-none focus:outline-none focus:border-machine-orange peer transition-colors">
                    <option value="" disabled hidden>Select material...</option>
                    <option value="MS Steel">MS Steel</option>
                    <option value="Stainless Steel">Stainless Steel</option>
                    <option value="Aluminum">Aluminum</option>
                    <option value="Brass">Brass</option>
                    <option value="Other">Other</option>
                  </select>
                  <label htmlFor="material" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 bg-white px-2 peer-focus:text-machine-orange pointer-events-none">Material</label>
                </div>
                <div className="relative">
                  <input type="number" id="qty" placeholder=" " className="block w-full px-4 py-3.5 text-navy bg-transparent border-2 border-border-grey rounded-xl appearance-none focus:outline-none focus:border-machine-orange peer transition-colors" />
                  <label htmlFor="qty" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Quantity</label>
                </div>
              </div>

              <div className="relative">
                <textarea rows={4} id="reqs" placeholder=" " className="block w-full px-4 py-4 text-navy bg-transparent border-2 border-border-grey rounded-xl appearance-none focus:outline-none focus:border-machine-orange peer transition-colors resize-none"></textarea>
                <label htmlFor="reqs" className="absolute text-sm font-bold text-muted-grey duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:text-machine-orange pointer-events-none">Message / Requirements</label>
              </div>

              <div className="space-y-2 mt-2">
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

export default EnquiryForm;

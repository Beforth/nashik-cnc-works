'use client';
import React from 'react';
import { motion } from 'motion/react';
import { STEPS } from '../constants';
import SectionHeading from './SectionHeading';
import { ArrowRight, Calculator, CheckCircle2, Factory, FileText, Truck } from 'lucide-react';

const STEP_ICONS = [FileText, Calculator, Factory, Truck];

const HowItWorks = () => {
  return (
    <section id="process" className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Process"
          kicker="Our Workflow"
          description="A streamlined 4-step precision workflow ensuring clarity and quality from initial enquiry to final component delivery."
          align="center"
        />

        <div className="relative mt-16">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-grey/30 -translate-y-1/2 hidden lg:block z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {STEPS.map((step, index) => {
              const Icon = STEP_ICONS[index] || CheckCircle2;
              
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Step Card */}
                  <div className="flex flex-col items-center text-center">
                    {/* Icon Circle */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-bg-cloud rounded-2xl flex items-center justify-center text-navy group-hover:bg-machine-orange group-hover:text-white transition-all duration-300 shadow-sm border border-border-grey/50 group-hover:border-machine-orange group-hover:rotate-3">
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-navy text-white text-xs font-bold rounded-full flex items-center justify-center border-4 border-white">
                        0{step.num}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-extrabold text-navy mb-3 group-hover:text-machine-orange transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-grey leading-relaxed max-w-[240px]">
                      {step.desc}
                    </p>

                    {/* Desktop Arrow Connector */}
                    {index < STEPS.length - 1 && (
                      <div className="absolute top-10 -right-4 translate-x-1/2 hidden lg:flex items-center text-border-grey/40">
                        <ArrowRight size={24} className="animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Mobile/Tablet Background Ornament */}
                  <div className="absolute -inset-4 bg-bg-cloud/50 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity lg:hidden" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA or Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-navy text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-machine-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-left">
              <h4 className="text-lg font-bold">Ready to start your project?</h4>
              <p className="text-white/70 text-sm">We provide expert consultation for complex machining requirements.</p>
            </div>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-machine-orange hover:bg-amber text-white font-bold rounded-xl transition-all shadow-lg shadow-machine-orange/20 whitespace-nowrap"
            >
              Request a Free Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

'use client';
import React from 'react';
import { STEPS } from '../constants';
import SectionHeading from './SectionHeading';

const HowItWorks = () => {
  return (
    <section id="process" className="py-20 px-4 bg-bg-steel/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Process"
          kicker="How We Work"
          description="A streamlined 4-step workflow ensuring clarity from initial enquiry to final component delivery."
          align="center"
        />
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

export default HowItWorks;

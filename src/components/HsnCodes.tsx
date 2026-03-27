'use client';
import React from 'react';
import { motion } from 'motion/react';
import { HSN_CODES } from '../constants';
import SectionHeading from './SectionHeading';

const HsnCodes = () => (
  <section id="hsn" className="py-20 px-4 bg-white border-y border-border-grey">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        title="Taxation"
        kicker="Deals in HSN Code"
        description="Transparent billing and compliance with standard HSN codes for industrial machining and fabrication services."
        align="center"
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

export default HsnCodes;

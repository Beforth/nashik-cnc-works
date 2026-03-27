'use client';
import React from 'react';
import { Settings } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { COMPANY, MACHINES, INDIA_MART_IMAGES } from '../constants';

const Infrastructure = () => {
  return (
    <section id="machines" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Infrastructure"
          kicker="Advanced Machine Shop"
          description="Equipped with heavy-duty machinery to handle complex geometries and large-scale production runs with absolute consistency."
          align="center"
          className="mb-12"
        />
        <div className="grid md:grid-cols-2 gap-12 items-start md:items-center">
          <div>
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

export default Infrastructure;

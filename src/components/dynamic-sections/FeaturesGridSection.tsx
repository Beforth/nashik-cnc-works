'use client';

import { Cpu } from 'lucide-react';

export type FeatureItem = {
  title: string;
  description?: string;
  iconKey?: string;
};

export type FeaturesGridSectionProps = {
  kicker?: string;
  title?: string;
  description?: string;
  features?: FeatureItem[];
};

/**
 * Generic marketing grid driven entirely by API props (FEATURES_GRID).
 */
export default function FeaturesGridSection({
  kicker = 'Features',
  title = 'Why work with us',
  description,
  features = [],
}: FeaturesGridSectionProps) {
  if (!features.length) {
    return (
      <section className="border-y border-dashed border-border-grey bg-bg-steel/20 px-4 py-16 text-center text-muted-grey">
        <p className="text-sm font-medium">No features configured for this section.</p>
      </section>
    );
  }

  return (
    <section id="features" className="px-4 py-24 bg-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-machine-orange">{kicker}</p>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-navy sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-grey">{description}</p>
        ) : null}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={`${f.title}-${i}`}
              className="rounded-2xl border border-border-grey bg-bg-cloud/60 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-machine-orange/10 text-machine-orange">
                <Cpu className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-navy">{f.title}</h3>
              {f.description ? <p className="mt-2 text-sm leading-relaxed text-muted-grey">{f.description}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

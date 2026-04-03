'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

function SectionLoading({ label }: { label: string }) {
  return (
    <div className="min-h-[100px] animate-pulse rounded-xl border border-border-grey/50 bg-bg-steel/40 px-4 py-10">
      <p className="text-center text-sm font-medium text-muted-grey">Loading {label}…</p>
    </div>
  );
}

/**
 * Maps CMS / admin `componentType` strings to lazily loaded React sections.
 * Add new keys here when the backend introduces new section types.
 */
export const SECTION_COMPONENT_REGISTRY = {
  NAVBAR_SECTION: dynamic(() => import('@/src/components/dynamic-sections/NavbarSection'), {
    loading: () => <SectionLoading label="navigation" />,
  }),
  HERO_SECTION: dynamic(() => import('@/src/components/dynamic-sections/HeroSection'), {
    loading: () => <SectionLoading label="hero" />,
  }),
  SERVICES_GRID: dynamic(() => import('@/src/components/dynamic-sections/ServicesSection'), {
    loading: () => <SectionLoading label="services" />,
  }),
  FEATURES_GRID: dynamic(() => import('@/src/components/dynamic-sections/FeaturesGridSection'), {
    loading: () => <SectionLoading label="features" />,
  }),
  INFRASTRUCTURE_SECTION: dynamic(() => import('@/src/components/dynamic-sections/InfrastructureSection'), {
    loading: () => <SectionLoading label="infrastructure" />,
  }),
  INDUSTRIES_STRIP: dynamic(() => import('@/src/components/dynamic-sections/IndustriesStripSection'), {
    loading: () => <SectionLoading label="industries" />,
  }),
  GALLERY_GRID: dynamic(() => import('@/src/components/dynamic-sections/GallerySection'), {
    loading: () => <SectionLoading label="gallery" />,
  }),
  HOW_IT_WORKS: dynamic(() => import('@/src/components/dynamic-sections/HowItWorksSection'), {
    loading: () => <SectionLoading label="how it works" />,
  }),
  ENQUIRY_FORM: dynamic(() => import('@/src/components/dynamic-sections/EnquiryFormSection'), {
    loading: () => <SectionLoading label="enquiry form" />,
  }),
  FOOTER_SECTION: dynamic(() => import('@/src/components/dynamic-sections/FooterSection'), {
    loading: () => <SectionLoading label="footer" />,
  }),
} as const;

export type RegisteredSectionType = keyof typeof SECTION_COMPONENT_REGISTRY;

export function isRegisteredSectionType(type: string): type is RegisteredSectionType {
  return Object.prototype.hasOwnProperty.call(SECTION_COMPONENT_REGISTRY, type);
}

/** Returns the dynamically imported component, or `null` if `componentType` is unknown. */
export function getRegisteredSectionComponent(componentType: string): ComponentType<any> | null {
  if (!isRegisteredSectionType(componentType)) return null;
  return SECTION_COMPONENT_REGISTRY[componentType] as ComponentType<any>;
}

/** Visible placeholder when the API references an unregistered `componentType`. */
export function UnknownSectionPlaceholder({ componentType }: { componentType: string }) {
  return (
    <div
      role="status"
      className="mx-auto my-4 max-w-3xl rounded-2xl border-2 border-dashed border-machine-orange/50 bg-orange-light px-6 py-8 text-center shadow-sm"
    >
      <p className="text-sm font-extrabold uppercase tracking-wide text-navy">Component not found</p>
      <p className="mt-2 font-mono text-xs text-muted-grey">componentType: {componentType}</p>
      <p className="mt-3 text-xs text-muted-grey">
        Register this key in <code className="rounded bg-white/80 px-1 py-0.5">SECTION_COMPONENT_REGISTRY</code>.
      </p>
    </div>
  );
}

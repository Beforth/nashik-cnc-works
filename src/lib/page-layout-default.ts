import type { PageLayoutApiResponse } from '@/src/types/page-sections';

/** Example layout for `/api/page-sections` or server-side `initialData`. Adjust order/keys to match your admin menu. */
export function getDefaultPageLayoutResponse(): PageLayoutApiResponse {
  return {
    sections: [
      { id: 'nav', componentType: 'NAVBAR_SECTION', componentProps: {} },
      {
        id: 'hero',
        componentType: 'HERO_SECTION',
        componentProps: { citySlug: 'cnc-job-work-nashik' },
      },
      { id: 'services', componentType: 'SERVICES_GRID', componentProps: {} },
      { id: 'infra', componentType: 'INFRASTRUCTURE_SECTION', componentProps: {} },
      { id: 'industries', componentType: 'INDUSTRIES_STRIP', componentProps: {} },
      {
        id: 'features',
        componentType: 'FEATURES_GRID',
        componentProps: {
          kicker: 'Capabilities',
          title: 'Built for precision',
          description: 'Configurable feature cards from your CMS.',
          features: [
            { title: 'CNC job work', description: 'Turning, milling, and complex profiles.' },
            { title: 'Quality focus', description: 'Repeatable accuracy for industrial buyers.' },
            { title: 'Nashik based', description: 'Serving Nashik and nearby industrial corridors.' },
          ],
        },
      },
      { id: 'how', componentType: 'HOW_IT_WORKS', componentProps: {} },
      { id: 'gallery', componentType: 'GALLERY_GRID', componentProps: {} },
      { id: 'enquiry', componentType: 'ENQUIRY_FORM', componentProps: {} },
      { id: 'footer', componentType: 'FOOTER_SECTION', componentProps: {} },
    ],
  };
}

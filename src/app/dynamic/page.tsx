import DynamicPage from '@/src/components/DynamicPage';

/**
 * Example route: CMS-driven layout from the same-origin API.
 * Remove or protect this route in production if you only use DynamicPage inside `[slug]` etc.
 */
export default function DynamicLayoutDemoPage() {
  return <DynamicPage apiUrl="/api/page-sections" />;
}

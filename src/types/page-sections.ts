/**
 * Shape returned by your backend for CMS-driven page layout.
 * `componentProps` is intentionally loose so each section type can define its own payload.
 */
export interface PageSectionConfig {
  /** Stable key for React lists */
  id?: string;
  componentType: string;
  componentProps?: any;
}

export interface PageLayoutApiResponse {
  sections: PageSectionConfig[];
}

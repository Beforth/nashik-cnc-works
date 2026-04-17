export type ProfileCmsSettings = {
  companyName: string;
  gstin: string;
  contactName: string;
  phone: string;
  phoneFormatted: string;
  email: string;
  address: string;
  googleMapsUrl: string;
};

export type ProfileCmsService = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type ProfileCmsGalleryImage = {
  src: string;
  alt: string;
};

export type ProfileCmsPayload = {
  settings: ProfileCmsSettings;
  services: ProfileCmsService[];
  galleryImages: ProfileCmsGalleryImage[];
  /** Persisted total from DB; client POST may refresh after an official-site view. */
  profileViewCount: number;
};

import { COMPANY } from '@/src/constants';
import { PROFILE_SERVICES } from '@/src/components/profile/profile-data';
import { getProfileCmsBundle } from '@/src/lib/cms-cache';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';
import type {
  ProfileCmsGalleryImage,
  ProfileCmsPayload,
  ProfileCmsService,
  ProfileCmsSettings,
} from '@/src/types/profile-cms';

export type {
  ProfileCmsGalleryImage,
  ProfileCmsPayload,
  ProfileCmsService,
  ProfileCmsSettings,
} from '@/src/types/profile-cms';

function settingsFromDb(s: Awaited<ReturnType<typeof getProfileCmsBundle>>['settings']): ProfileCmsSettings {
  return {
    companyName: s?.companyName?.trim() || COMPANY.siteFullName,
    gstin: s?.gstin?.trim() || COMPANY.gstin,
    contactName: s?.contactName?.trim() || COMPANY.contactName,
    phone: s?.phone?.trim() || COMPANY.phone,
    phoneFormatted: s?.phoneFormatted?.trim() || COMPANY.phoneFormatted,
    email: s?.email?.trim() || COMPANY.email,
    address: s?.address?.trim() || COMPANY.tagline,
    googleMapsUrl:
      s?.googleMapsUrl && s.googleMapsUrl.trim().length > 0 ? s.googleMapsUrl.trim() : COMPANY.googleMapsUrl,
  };
}

/** Uses the profile CMS cache (settings + services + gallery only); revalidates with admin via `cms-public` tag. */
export async function getProfileCmsPayload(): Promise<ProfileCmsPayload> {
  const { settings, services, galleryRaw } = await getProfileCmsBundle();
  const settingsOut = settingsFromDb(settings);

  let servicesOut: ProfileCmsService[] = (services ?? []).map((svc) => ({
    id: svc.id,
    name: svc.name,
    description: svc.description,
    imageUrl: svc.imageUrl,
  }));

  if (servicesOut.length === 0) {
    servicesOut = PROFILE_SERVICES.map((p, i) => ({
      id: `catalog-${i}`,
      name: p.name,
      description: p.desc,
      imageUrl: p.img,
    }));
  }

  const mergedGallery = getMergedGalleryItems(galleryRaw);
  const galleryImages: ProfileCmsGalleryImage[] = mergedGallery.map((g) => ({
    src: g.imageUrl,
    alt: g.title,
  }));

  return { settings: settingsOut, services: servicesOut, galleryImages };
}

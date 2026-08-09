// types/banner.ts

export type BannerType = "projects" | "design" | "events" | "blogs" | "about" | "contact" | "banner"

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  label: string;
  url?: string | null;
  image: string;
  discount?: number | null;
  discountType?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormData {
  title: string;
  subtitle: string;
  label: string;
  url?: string | null;
  discount?: number | null;
  discountType?: string;
  order?: number;
  isActive?: boolean;
  image?: File | null;
}

export interface CreateBannerPayload extends BannerFormData {
  type: BannerType;
}

export interface UpdateBannerPayload extends BannerFormData {
  type: BannerType;
  id: number;
}

export interface DeleteBannerPayload {
  type: BannerType;
  id: number;
}

export interface ToggleBannerPayload {
  type: BannerType;
  id: number;
}

export interface GetBannersPayload {
  type: BannerType;
}

export const BANNER_TYPES: { value: BannerType; label: string }[] = [
  { value: "projects", label: "Projects" },
  { value: "design", label: "Design" },
  { value: "events", label: "Events" },
  { value: "blogs", label: "Blogs" },
  { value: "about", label: "About" },
  { value: "contact", label: "Contact" },
  { value: "banner", label: "Home" },
];
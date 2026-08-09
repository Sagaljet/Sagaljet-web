// src/lib/types/orderDesign.ts

export type PostType =
  | "FACEBOOK_POST"
  | "INSTAGRAM_POST"
  | "INSTAGRAM_STORY"
  | "TIKTOK"
  | "YOUTUBE_THUMBNAIL"
  | "TWITTER"
  | "LINKEDIN"
  | "OTHER";

export interface OrderDesign {
  id: number;
  title: string;
  price: number;
  images: string[];
  size: string | null;
  postType: PostType;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostTypeOption {
  value: PostType;
  label: string;
}

export interface OrderDesignFilters {
  search?: string;
  postType?: PostType | "ALL";
  minPrice?: number;
  maxPrice?: number;
}
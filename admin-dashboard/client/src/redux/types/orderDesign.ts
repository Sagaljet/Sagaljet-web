// src/redux/types/orderDesign.ts

export type PostType =
  | "FACEBOOK_POST"
  | "INSTAGRAM_POST"
  | "INSTAGRAM_STORY"
  | "TIKTOK"
  | "YOUTUBE_THUMBNAIL"
  | "TWITTER"
  | "LINKEDIN"
  | "OTHER";

export interface PostTypeOption {
  value: PostType;
  label: string;
}

export interface OrderDesign {
  id: number;
  title: string;
  price: number;
  images: string[]; // Changed from image: string | null
  size: string | null;
  postType: PostType;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDesignInput {
  id?: number;
  title: string;
  price: number;
  images?: File[]; // Changed to File[]
  size?: string;
  postType?: PostType;
  description?: string;
  existingImages?: string[]; // Changed to string[]
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderDesignListResponse {
  success: boolean;
  result: OrderDesign[];
  pagination: PaginationInfo;
}

export interface OrderDesignResponse {
  success: boolean;
  result: OrderDesign;
  message?: string;
}
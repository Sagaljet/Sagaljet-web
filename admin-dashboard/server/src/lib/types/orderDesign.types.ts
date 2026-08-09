// src/types/orderDesign.types.ts

export interface CreateOrderDesignInput {
  title: string;
  price: number;
  image?: string;
  size?: string;
  postType?: string;
  description?: string;
}

export interface UpdateOrderDesignInput {
  title?: string;
  price?: number;
  image?: string;
  size?: string;
  postType?: string;
  description?: string;
}

export interface OrderDesignQuery {
  page?: number;
  limit?: number;
  search?: string;
  postType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
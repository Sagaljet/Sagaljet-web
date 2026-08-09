import { DesignCategory, DesignCategoryResponse } from "@/lib/types/services";
import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types
export interface Design {
  id: number;
  title: string;
  slug: string | null;
  price: number;
  description: string | null;
  images: string[];
  isPrintable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DesignsResponse {
  success: boolean;
  result: Design[];
  message?: string;
}

export interface SingleDesignResponse {
  success: boolean;
  result: Design;
  message?: string;
}

export interface CreateDesignRequest {
  title: string;
  slug?: string;
  price: number;
  description?: string;
  isPrintable?: boolean;
  images?: File[];
}

export interface UpdateDesignRequest extends CreateDesignRequest {
  id: number;
}

// Define a service using a base URL and expected endpoints
export const designApi = createApi({
  reducerPath: "designApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Url}/design`,
  }),
  tagTypes: ["Design", "Designs"],
  endpoints: (builder) => ({
    // Get all printable designs (public)
    getDesigns: builder.query<Design[], void>({
      query: () => "/get-designs",
      transformResponse: (response: DesignsResponse) => response.result || [],
      providesTags: ["Designs"],
    }),

    // Get single design by slug
    getDesignBySlug: builder.query<Design, string>({
      query: (slug) => `/get-design-by-slug/${slug}`,
      transformResponse: (response: SingleDesignResponse) => response.result,
      providesTags: (result) =>
        result ? [{ type: "Design", id: result.id }] : [],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDesignsQuery,
  useGetDesignBySlugQuery,
} = designApi;

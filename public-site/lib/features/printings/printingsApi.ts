import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types
export interface Printing {
  id: number;
  name: string;
  size: string;
  price: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrintingsResponse {
  success: boolean;
  result: Printing[];
  message?: string;
}

export interface SinglePrintingResponse {
  success: boolean;
  result: Printing;
  message?: string;
}

export interface CreatePrintingRequest {
  name: string;
  size?: string;
  price: number;
  description?: string;
}

export interface UpdatePrintingRequest {
  id: number;
  name?: string;
  size?: string;
  price?: number;
  description?: string;
}

export interface DeletePrintingResponse {
  success: boolean;
  result: Printing;
  message?: string;
}

// Define a service using a base URL and expected endpoints
export const printingApi = createApi({
  reducerPath: "printingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Url}`,
  }),
  tagTypes: ["Printing", "Printings"],
  endpoints: (builder) => ({
    // Get all printing types
    getPrintings: builder.query<Printing[], void>({
      query: () => "/printings",
      transformResponse: (response: PrintingsResponse) => response.result || [],
      providesTags: ["Printings"],
    }),

    // Get single printing by ID
    getPrinting: builder.query<Printing, number>({
      query: (id) => `/printing/${id}`,
      transformResponse: (response: SinglePrintingResponse) => response.result,
      providesTags: (result) =>
        result ? [{ type: "Printing", id: result.id }] : [],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetPrintingsQuery, useGetPrintingQuery } = printingApi;

// @ts-ignore
import { DesignCategory, DesignCategoryResponse } from "@/lib/types/services";
import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types

// Define a service using a base URL and expected endpoints
export const categoryApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Url}/categories/design`,
  }),
  tagTypes: ["Categories", "Categories"],
  endpoints: (builder) => ({
    // Get all printable designs (public)
    getCategories: builder.query<DesignCategory[], void>({
      query: () => "/get-categories",
      transformResponse: (response: DesignCategoryResponse) =>
        response.result || [],
      providesTags: ["Categories"],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetCategoriesQuery } = categoryApi;

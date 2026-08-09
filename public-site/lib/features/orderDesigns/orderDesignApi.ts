// src/lib/features/orderDesigns/orderDesignApi.ts

import { OrderDesign, PostTypeOption } from "@/lib/orderDesign";
import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const orderDesignApi = createApi({
  reducerPath: "orderDesignApi",
  baseQuery: fetchBaseQuery({ baseUrl:Url }),
  tagTypes: ["OrderDesign", "PostTypes"],
  endpoints: (builder) => ({
    // ✅ Get all order designs
    getOrderDesigns: builder.query<OrderDesign[], void>({
      query: () => "/order-designs",
      transformResponse: (response: { success: boolean; result: OrderDesign[] }) =>
        response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "OrderDesign" as const, id })),
              { type: "OrderDesign", id: "LIST" },
            ]
          : [{ type: "OrderDesign", id: "LIST" }],
    }),

    // ✅ Get single order design by ID
    getOrderDesignById: builder.query<OrderDesign, number>({
      query: (id) => `/order-designs/id/${id}`,
      transformResponse: (response: { success: boolean; result: OrderDesign }) =>
        response.result,
      providesTags: (result, error, id) => [{ type: "OrderDesign", id }],
    }),

    // ✅ Get single order design by Title
    getOrderDesignByTitle: builder.query<OrderDesign, string>({
      query: (title) => `/order-designs/title/${encodeURIComponent(title)}`,
      transformResponse: (response: { success: boolean; result: OrderDesign }) =>
        response.result,
      providesTags: (result) =>
        result ? [{ type: "OrderDesign", id: result.id }] : [],
    }),

    // ✅ Get post types for filter
    getPostTypes: builder.query<PostTypeOption[], void>({
      query: () => "/order-designs/post-types",
      transformResponse: (response: { success: boolean; result: PostTypeOption[] }) =>
        response.result,
      providesTags: ["PostTypes"],
    }),
  }),
});

export const {
  useGetOrderDesignsQuery,
  useGetOrderDesignByIdQuery,
  useGetOrderDesignByTitleQuery,
  useGetPostTypesQuery,
} = orderDesignApi;

export type { OrderDesign, PostTypeOption };
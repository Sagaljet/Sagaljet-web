// lib/features/designs/designApi.ts

import { Url } from "@/lib/url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ============================================
// INTERFACES
// ============================================

export interface ComponentType {
  id: number;
  name: string;
}

export interface ComponentOption {
  id: number;
  value: string;
  typeId: number;
  type?: ComponentType;
}

export interface ProductComponent {
  id: number;
  productId: number;
  optionId: number;
  extraPrice: number;
  option: ComponentOption;
}

export interface DesignFeature {
  id: number;
  name: string;
  value: string;
  extraCost: number;
  designId: number;
}

export interface DesignCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Design {
  id: number;
  title: string;
  slug: string | null;
  price: number;
  description: string | null;
  images: string[];
  isPrintable: boolean;
  categoryDesignId: number;
  category?: DesignCategory;
  features: DesignFeature[];
  components: ProductComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface SelectedOption {
  optionId: number;
  typeName: string;
  optionValue: string;
  extraPrice: number;
}

export interface SelectedFeature {
  featureId: number;
  name: string;
  value: string;
  extraCost: number;
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

// ============================================
// TYPE NAME MAPPING
// ============================================

const TYPE_NAMES: Record<number, string> = {
  1: "Size",
  2: "Material",
  3: "Color",
  4: "Finishing",
};

// ============================================
// HELPER: Sort function for components
// ============================================

const sortComponentsASC = (components: any[]): any[] => {
  return [...components].sort((a, b) => {
    // 1. Sort by type name (A-Z)
    const typeA = a.option?.type?.name || "";
    const typeB = b.option?.type?.name || "";
    const typeCompare = typeA.localeCompare(typeB, undefined, {
      numeric: true,
    });

    if (typeCompare !== 0) return typeCompare;

    // 2. Sort by option value (A-Z, 1-2-3)
    const valueA = a.option?.value || "";
    const valueB = b.option?.value || "";
    return valueA.localeCompare(valueB, undefined, { numeric: true });
  });
};

// ============================================
// HELPER: Transform API Response
// ============================================

const transformDesign = (design: any): Design => {
  const rawComponents = design.productComponents || design.components || [];

  // Transform components
  const transformedComponents = rawComponents.map((pc: any, index: number) => {
    const option = pc.option || {};
    const optionId = option.id;
    const optionValue = option.value || "Unknown";
    const typeId = option.typeId;

    // Get type name
    let typeName = "Other";
    if (option.type?.name) {
      typeName = option.type.name;
    } else if (typeId && TYPE_NAMES[typeId]) {
      typeName = TYPE_NAMES[typeId];
    }

    return {
      id: pc.id || index + 1,
      productId: pc.productId || design.id,
      optionId: optionId,
      extraPrice: pc.extraPrice || 0,
      option: {
        id: optionId,
        value: optionValue,
        typeId: typeId,
        type: {
          id: typeId,
          name: typeName,
        },
      },
    };
  });

  // ✅ Sort components ASC
  const sortedComponents = sortComponentsASC(transformedComponents);

  return {
    ...design,
    features: design.features || [],
    components: sortedComponents,
  };
};

// ============================================
// RTK QUERY API
// ============================================

export const designApi = createApi({
  reducerPath: "designApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Url}/design`,
  }),
  tagTypes: ["Design", "Designs"],
  endpoints: (builder) => ({
    getDesigns: builder.query<Design[], void>({
      query: () => "/get-designs",
      transformResponse: (response: DesignsResponse) => {
        const designs = response.result || [];
        return designs.map(transformDesign);
      },
      providesTags: ["Designs"],
    }),

    getAllDesigns: builder.query<Design[], void>({
      query: () => "/get-all-designs",
      transformResponse: (response: DesignsResponse) => {
        const designs = response.result || [];
        return designs.map(transformDesign);
      },
      providesTags: ["Designs"],
    }),

    getDesignBySlug: builder.query<Design, string>({
      query: (slug) => `/get-design-by-slug/${slug}`,
      transformResponse: (response: SingleDesignResponse) => {
        if (!response.result) {
          throw new Error("Design not found");
        }
        return transformDesign(response.result);
      },
      providesTags: (result) =>
        result ? [{ type: "Design", id: result.id }] : [],
    }),

    getDesignById: builder.query<Design, number>({
      query: (id) => `/get-design/${id}`,
      transformResponse: (response: SingleDesignResponse) => {
        if (!response.result) {
          throw new Error("Design not found");
        }
        return transformDesign(response.result);
      },
      providesTags: (result) =>
        result ? [{ type: "Design", id: result.id }] : [],
    }),
  }),
});

export const {
  useGetDesignsQuery,
  useGetAllDesignsQuery,
  useGetDesignBySlugQuery,
  useGetDesignByIdQuery,
} = designApi;

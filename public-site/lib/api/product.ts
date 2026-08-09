import { Url } from "../url";

// lib/api/designs.ts
export interface DesignCategory {
  id: number;
  name: string;
  description?: string;
}

export interface DesignFeature {
  id: number;
  name: string;
  value: string;
  extraCost: number;
}

export interface DesignComponent {
  id: number;
  optionId: number;
  extraPrice: number;
  option?: {
    id: number;
    value: string;
    typeId: number;
    type?: {
      id: number;
      name: string;
    };
  };
}

export interface Design {
  id: number;
  title: string;
  slug: string;
  description?: string;
  images: string[];
  price: number;
  isPrintable: boolean;
  categoryDesign?: DesignCategory;
  categoryDesignId?: number;
  features: DesignFeature[];
  components: DesignComponent[];
  createdAt: string;
  updatedAt: string;
}


export async function getDesignBySlug(slug: string): Promise<Design | null> {
  try {
    const response = await fetch(`${Url}/design/get-design-by-slug/${slug}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch design");
    }

    const data = await response.json();
    return data as Design;
  } catch (error) {
    console.error("Error fetching design:", error);
    return null;
  }
}

export async function getDesigns(): Promise<Design[]> {
  try {
    const response = await fetch(`${Url}/designs`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch designs");
    }

    const data = await response.json();
    return data as Design[];
  } catch (error) {
    console.error("Error fetching designs:", error);
    return [];
  }
}

export async function getDesignCategories(): Promise<DesignCategory[]> {
  try {
    const response = await fetch(`${Url}/designs/categories`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data as DesignCategory[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
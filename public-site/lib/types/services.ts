// lib/types/services.ts

// Component Type (e.g., "Size", "Material", "Finishing")
export interface ComponentType {
  id: number;
  name: string;
}

// Component Option (e.g., "Small", "Wood", "Matte")
export interface ComponentOption {
  id: number;
  value: string;
  typeId: number;
  type?: ComponentType;
}

// Product Component (links design to component option)
export interface ProductComponent {
  id: number;
  productId: number;
  optionId: number;
  extraPrice: number | null;
  option: ComponentOption;
}

// Design Feature
export interface DesignFeature {
  id: number;
  name: string;
  value: string;
  extraCost: number;
  designId: number;
}

// Design Category
export interface DesignCategory {
  id: number;
  name: string;
  description?: string;
}

// Main Design Interface
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

// Selected Component (for cart/order) - What user selects
export interface SelectedComponent {
  componentId: number;
  optionId: number;
  typeName: string;
  optionValue: string;
  extraPrice: number;
}

// Selected Feature (for cart/order)
export interface SelectedFeature {
  featureId: number;
  name: string;
  value: string;
  extraCost: number;
}

// Price Filter
export type PriceFilter = "all" | "low" | "medium" | "high";

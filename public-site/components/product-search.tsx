"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { X, Search, Loader2, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useGetDesignsQuery } from "@/lib/features/designs/designApi";

// Types
interface DesignCategory {
  id: number;
  name: string;
}

interface DesignFeature {
  id: number;
  name: string;
}

interface ProductComponent {
  id: number;
  name: string;
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

interface ProductSearchProps {
  onProductSelect?: () => void;
  placeholder?: string;
  initialProductsLimit?: number;
}

export function ProductSearch({
  onProductSelect,
  placeholder = "Search products...",
  initialProductsLimit = 6,
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    data: designsData,
    isLoading: designsLoading,
    isError: designsError,
    isFetching: designsFetching,
  } = useGetDesignsQuery();

  // Handle different API response structures
  //@ts-ignore
  const designs: Design[] = useMemo(() => {
    if (!designsData) return [];
    return Array.isArray(designsData) ? designsData : designsData || [];
  }, [designsData]);

  // Products to display - show initial products when no search, filtered when searching
  const displayProducts = useMemo(() => {
    // If there's a search query, filter products
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return designs
        .filter(
          (product) =>
            product.title?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.category?.name?.toLowerCase().includes(query)
        )
        .slice(0, 10);
    }
    
    // If no search query, show initial/popular products
    return designs.slice(0, initialProductsLimit);
  }, [searchQuery, designs, initialProductsLimit]);

  const handleProductClick = (product: Design) => {
    const productPath = product.slug || product.id.toString();
    router.push(`/services/${productPath}`);
    setSearchQuery("");
    setIsOpen(false);
    onProductSelect?.();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    // Keep dropdown open to show initial products
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const isLoading = designsLoading || designsFetching;
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="relative w-full sm:w-72 lg:w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9 h-9 sm:h-10 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isLoading && !designs.length}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {searchQuery && !isLoading && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown - shows when focused */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Loading state */}
          {isLoading && !designs.length ? (
            <div className="px-4 py-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : designsError ? (
            <div className="px-4 py-8 text-center text-sm text-destructive">
              Error loading products. Please try again.
            </div>
          ) : displayProducts.length > 0 ? (
            <>
              {/* Header - shows different text based on search state */}
              <div className="px-4 py-2 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  {hasSearchQuery ? (
                    <>
                      <Search className="h-3 w-3" />
                      <span>Search results for "{searchQuery}"</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-3 w-3" />
                      <span>Popular Products</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="py-1">
                {displayProducts.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleProductClick(product)}
                      className="w-full text-left px-4 py-2.5 sm:py-3 hover:bg-muted transition-colors flex items-center gap-3"
                    >
                      {/* Product Image */}
                      {product.images?.[0] ? (
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-foreground truncate hover:text-primary">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.category?.name && (
                            <>
                              <span>•</span>
                              <span className="truncate">
                                {product.category.name}
                              </span>
                            </>
                          )}
                          {product.isPrintable && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">Printable</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {/* View all link when showing initial products */}
              {!hasSearchQuery && designs.length > initialProductsLimit && (
                <div className="px-4 py-2 border-t border-border">
                  <button
                    onClick={() => {
                      router.push("/services");
                      handleCloseDropdown();
                    }}
                    className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium py-1"
                  >
                    View all {designs.length} products →
                  </button>
                </div>
              )}
            </>
          ) : hasSearchQuery ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No products found for "{searchQuery}"
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No products available
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleCloseDropdown}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
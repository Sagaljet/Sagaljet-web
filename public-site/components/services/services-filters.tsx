"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DesignCategory } from "@/lib/types/services";
import { cn } from "@/lib/utils";

interface DesignFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void;
  categories: DesignCategory[];
  totalFiltered: number;
  isFetching?: boolean;
}

export function DesignFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalFiltered,
  isFetching,
}: DesignFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCategory !== null;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <section className="sticky top-[56px] sm:top-[64px] z-40 bg-background/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        {/* Main Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-9 text-sm bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Results Count & Clear */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground whitespace-nowrap">
              {isFetching ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                <>
                  {/* <span className="font-semibold text-foreground">
                    {totalFiltered}
                  </span>{" "}
                  {totalFiltered === 1 ? "design" : "designs"} */}
                </>
              )}
            </span>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Categories Row */}
        <div className="mt-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 pb-1">
            <Badge
              variant={selectedCategory === null ? "default" : "secondary"}
              className={cn(
                "cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
                selectedCategory === null
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setSelectedCategory(null)}
            >
              All Designs
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "secondary"
                }
                className={cn(
                  "cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
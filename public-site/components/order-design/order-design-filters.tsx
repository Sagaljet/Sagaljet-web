// src/components/order-design/order-design-filters.tsx

"use client";

import { Search, Filter, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostType, PostTypeOption } from "@/lib/orderDesign";

interface OrderDesignFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPostType: PostType | "ALL";
  setSelectedPostType: (type: PostType | "ALL") => void;
  postTypes: PostTypeOption[];
  totalFiltered: number;
  isFetching?: boolean;
}

export function OrderDesignFilters({
  searchQuery,
  setSearchQuery,
  selectedPostType,
  setSelectedPostType,
  postTypes,
  totalFiltered,
  isFetching,
}: OrderDesignFiltersProps) {
  const hasFilters = searchQuery || selectedPostType !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPostType("ALL");
  };

  return (
    <section className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Post Type Filter */}
          <Select
            value={selectedPostType}
            onValueChange={(value) => setSelectedPostType(value as PostType | "ALL")}
          >
            <SelectTrigger className="w-full md:w-[200px] h-12">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Post Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {postTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-12 whitespace-nowrap"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Results Count & Active Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalFiltered}</span>{" "}
              {totalFiltered === 1 ? "design" : "designs"} found
            </span>
          </div>

          {hasFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {selectedPostType !== "ALL" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {selectedPostType.replace(/_/g, " ")}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedPostType("ALL")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
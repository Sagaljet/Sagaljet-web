import { Skeleton } from "@/components/ui/skeleton";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";

// Simple card-based skeleton for grid layouts
export function DesignCardSkeleton() {
  return (
    <div className="rounded-lg border-2 overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-56 w-full rounded-b-none" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Price and date skeleton */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="space-y-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

// List-based skeleton using Item component
export function DesignItemSkeleton() {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Skeleton className="size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <Skeleton className="h-5 w-48" />
        </ItemTitle>
        <ItemDescription>
          <Skeleton className="h-4 w-full" />
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Skeleton className="h-8 w-16" />
      </ItemActions>
    </Item>
  );
}

// Table row skeleton
export function DesignTableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="size-16 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

// Complete loading state with multiple skeletons
export function DesignsLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <DesignItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Grid layout skeleton
export function DesignsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Skeleton */}
      <div className="relative h-[400px] w-full">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Search Section Skeleton */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-32 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, i) => (
              <DesignCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Single Design Detail Skeleton
export function DesignDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            {/* Design Info Skeleton */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-12 w-3/4" />
              </div>

              <Skeleton className="h-16 w-48" />

              <Skeleton className="h-px w-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <Skeleton className="h-48 w-full rounded-lg" />

              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>

              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

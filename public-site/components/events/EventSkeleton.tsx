// components/event-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

// Event Card Skeleton for Grid Layout
export function EventCardSkeleton() {
  return (
    <div className="h-full flex flex-col group rounded-lg border">
      {/* Image skeleton */}
      <Skeleton className="h-64 w-full rounded-t-lg" />

      {/* Header skeleton */}
      <div className="p-6 space-y-3">
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-7 w-3/4" />
      </div>

      {/* Content skeleton */}
      <div className="px-6 pb-4 flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="p-6 pt-0">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// Events Loading Skeleton for List View
export function EventsLoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Event Detail Skeleton
export function EventDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Image Skeleton */}
      <Skeleton className="h-[50vh] lg:h-[60vh] w-full" />

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-xl border p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

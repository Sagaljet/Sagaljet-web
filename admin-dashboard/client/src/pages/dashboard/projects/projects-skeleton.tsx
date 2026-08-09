import { Skeleton } from "@/components/ui/skeleton"
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"

// Simple card-based skeleton for grid layouts
export function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}

// List-based skeleton using Item component
export function ProjectItemSkeleton() {
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
  )
}

// Table row skeleton
export function ProjectTableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}

// Complete loading state with multiple skeletons
export function ProjectsLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* List of project skeletons */}
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <ProjectItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Grid layout skeleton
export function ProjectsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Grid of project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// app/projects/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import ProjectsWrapper from "./projects-wrapper";

export const metadata = {
  title: "Sagaljet | Projects",
  description: "Browse projects and case studies from Sagaljet",
  openGraph: {
    title: "Sagaljet | Projects",
    description: "Browse projects and case studies from Sagaljet",
    siteName: "Sagaljet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagaljet | Projects",
    description: "Browse projects and case studies from Sagaljet",
  },
};

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-br from-[#422f7e] to-[#e20613] text-white py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-3/4 mb-4 bg-white/20" />
          <Skeleton className="h-6 w-full bg-white/20" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full md:w-[200px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-96">
              <Skeleton className="h-56 w-full rounded-t-lg" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProjectsWrapper />
    </Suspense>
  );
}
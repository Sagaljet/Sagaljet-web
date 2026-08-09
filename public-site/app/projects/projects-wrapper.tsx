// app/projects/projects-wrapper.tsx
"use client";

import ProjectsClient from "./projects-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useGetProjectsQuery } from "@/lib/features/projects/project-api";
import Navbar from "@/components/header";

export default function ProjectsWrapper() {
  const { data, isLoading, error } = useGetProjectsQuery();

  if (isLoading) {
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

  if (error || !data || !data.success) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Projects
          </h2>
          <p className="text-muted-foreground">
            We couldn&apos;t load the projects. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ProjectsClient projects={data.result} categories={data.categories} />
    </>
  );
}
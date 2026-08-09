// app/projects/[slug]/project-detail-wrapper.tsx
"use client";

import { notFound } from "next/navigation";
import ProjectDetailClient from "./projects-detail-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetProjectBySlugQuery } from "@/lib/features/projects/project-api";
import Navbar from "@/components/header";

interface ProjectDetailWrapperProps {
  slug: string;
}

export default function ProjectDetailWrapper({
  slug,
}: ProjectDetailWrapperProps) {
  const { data: project, isLoading, error } = useGetProjectBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Skeleton */}
        <div className="relative h-[50vh] min-h-[400px]">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Content Skeleton */}
        <div className="relative -mt-32 z-10 container mx-auto px-4 pb-12">
          <div className="w-full max-w-4xl mx-auto">
            <Card className="bg-white shadow-2xl border-0 dark:bg-black">
              <CardContent className="p-8 md:p-12 lg:p-16 space-y-6">
                <Skeleton className="h-8 w-32" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if ("status" in error && error.status === 404) {
      notFound();
    }

    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Project
          </h2>
          <p className="text-muted-foreground">
            We couldn&apos;t load this project. It may have been removed or the
            link is incorrect.
          </p>
          <Button
            asChild
            className="bg-[#422f7e] hover:bg-[#422f7e]/90 text-white"
          >
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProjectDetailClient project={project} />
    </>
  );
}
// app/projects/[slug]/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import ProjectDetailWrapper from "./project-detail-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectBySlug } from "@/lib/api/projects";
import { Project } from "@/lib/features/projects/project-api";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata based on the project
// NOTE: Cannot use RTK Query hooks here - must use server-side fetch
export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Use server-side fetch, NOT RTK Query hook
  const projects = await getProjectBySlug(decodedSlug);

  const project = projects.result;

  if (!project) {
    return {
      title: "Project Not Found | Sagaljet",
      description: "The requested project could not be found.",
    };
  }

  // Strip HTML tags from description for meta
  const plainDescription = project.description
    ? project.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `View ${project.name} project by Sagaljet`;

  const projectImage = project.imageUrl?.[0] || "/og-default.jpg";

  return {
    title: `${project.name} | Sagaljet Projects`,
    description: plainDescription,
    keywords: [
      project.category?.name,
      project.industry,
      project.client,
      "Sagaljet",
      "projects",
      "case study",
    ].filter(Boolean) as string[],
    authors: [{ name: "Sagaljet" }],
    openGraph: {
      title: `${project.name} | Sagaljet Projects`,
      description: plainDescription,
      type: "article",
      siteName: "Sagaljet",
      images: [
        {
          url: projectImage,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
      publishedTime: project.createAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Sagaljet Projects`,
      description: plainDescription,
      images: [projectImage],
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function LoadingSkeleton() {
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

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProjectDetailWrapper slug={decodedSlug} />
    </Suspense>
  );
}

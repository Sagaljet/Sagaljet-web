// app/blog/[slug]/page.tsx
"use client";

import { Suspense, use } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useGetBlogBySlugQuery } from "@/lib/features/blog/blog-api";
import BlogPostContent from "@/components/blog-post-content";
import Navbar from "@/components/header";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug);

  const { data: post, isLoading, error } = useGetBlogBySlugQuery(decodedSlug);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {/* Hero Skeleton */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Content Skeleton */}
        <article className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card rounded-lg shadow-lg">
              <CardContent className="p-8 md:p-12 space-y-6">
                <Skeleton className="h-8 w-32" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </article>
      </div>
    );
  }

  // Error state
  if (error) {
    if ("status" in error && error.status === 404) {
      notFound();
    }

    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-600">
            Error Loading Blog Post
          </h2>
          <p className="text-muted-foreground">
            We couldn't load this blog post. Please try again later.
          </p>
          <Button
            asChild
            className="bg-[#422f7e] hover:bg-[#422f7e]/90 text-white"
          >
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <BlogPostContent post={post} />
    </Suspense>
  );
}

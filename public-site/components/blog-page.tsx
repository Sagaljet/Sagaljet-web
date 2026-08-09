// app/blog/blog-page-client.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, RefreshCw, User } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllBlogsQuery } from "@/lib/features/blog/blog-api";
import { getBlogSlug } from "@/lib/utils/slugify";

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const plainText = stripHtmlTags(content);
  const wordCount = plainText.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

function getExcerpt(content: string, maxLength: number = 150): string {
  const plainText = stripHtmlTags(content);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
}

export default function BlogPageClient() {
  const {
    data: posts = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBlogsQuery();

  // Manual refresh function
  const handleRefresh = () => {
    refetch();
  };

  // Loading state with skeleton loader
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-full flex flex-col">
                  <Skeleton className="h-48 rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="flex flex-col">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">
                Failed to Load Blog Posts
              </h2>
              <p className="text-muted-foreground">
                Failed to load blog posts. Please try again later.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Empty state
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="flex flex-col">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                No blog posts available at the moment.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Main content
  return (
    <div className="flex flex-col">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2 text-balance">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3 leading-relaxed">
                      {getExcerpt(post.content)}
                    </CardDescription>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(post.createAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/blog/${getBlogSlug(post)}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// app/blog/[slug]/blog-post-content.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Blog, useGetAllBlogsQuery } from "@/lib/features/blog/blog-api";
import { getBlogSlug } from "@/lib/utils/slugify";

interface BlogPostContentProps {
  post: Blog;
}

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

function getExcerpt(content: string, maxLength: number = 200): string {
  const plainText = stripHtmlTags(content);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const { data: allPosts, isLoading } = useGetAllBlogsQuery();

  const recentArticles =
    allPosts
      ?.filter((blog) => blog.id !== post.id)
      .sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )
      .slice(0, 3) || [];

  const plainTextContent = stripHtmlTags(post.content);
  const readTime = calculateReadTime(post.content);

  return (
    <div className="flex flex-col">
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-lg shadow-lg p-8 md:p-12"
          >
            {/* Back Button */}
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.createAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{readTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
              {getExcerpt(post.content, 250)}
            </p>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
              {plainTextContent}
            </div>

            {/* CTA */}
            <div className="mt-12 pt-8 border-t">
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-2">
                  Need Printing Services?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Contact SagalJet today to discuss your printing needs with our
                  expert team.
                </p>
                <Button asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Recent Articles */}
          {recentArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Recent Articles
                </h2>
                <Button asChild variant="ghost">
                  <Link href="/blog">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full" />
                  ))
                ) : (
                  recentArticles.map((blog) => (
                    <Link key={blog.id} href={`/blog/${getBlogSlug(blog)}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {getExcerpt(blog.content, 100)}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(blog.createAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{blog.author}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </div>
  );
}
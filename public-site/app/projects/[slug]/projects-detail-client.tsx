// app/projects/[slug]/projects-detail-client.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Briefcase,
  ExternalLink,
  User,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Project } from "@/lib/features/projects/project-api";

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({
  project,
}: ProjectDetailClientProps) {
  // Safe null checks
  const categoryName = project?.category?.name || "Uncategorized";
  const categoryDescription = project?.category?.description;
  const hasImages = project?.imageUrl && project.imageUrl.length > 0;
  const additionalImages = hasImages ? project.imageUrl.slice(1) : [];

  // Strip HTML for plain text description
  const plainDescription = project.description
    ? project.description.replace(/<[^>]*>/g, "")
    : "";

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: plainDescription.slice(0, 200),
    image: hasImages ? project.imageUrl : undefined,
    dateCreated: project.createAt,
    datePublished: project.createAt,
    creator: {
      "@type": "Organization",
      name: "Sagaljet",
      url: "https://sagaljet.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Sagaljet",
      url: "https://sagaljet.com",
    },
    about: {
      "@type": "Thing",
      name: categoryName,
    },
    sourceOrganization: project.client
      ? {
          "@type": "Organization",
          name: project.client,
        }
      : undefined,
    industry: project.industry || undefined,
    url: project.link || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sagaljet.com/projects/${project.slug}`,
    },
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sagaljet.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://sagaljet.com/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `https://sagaljet.com/projects/${project.slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="project-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex flex-col">
        <div className="relative h-[50vh] min-h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={
                (hasImages ? project.imageUrl[0] : null) ||
                "/placeholder.svg?height=1080&width=1920"
              }
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <div className="relative -mt-32 z-10 container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto"
          >
            <Card className="bg-white shadow-2xl border-0 dark:bg-black">
              <CardContent className="p-8 md:p-12 lg:p-16">
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  <Button
                    asChild
                    variant="ghost"
                    className="text-foreground hover:bg-muted -ml-4"
                  >
                    <Link href="/projects">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Projects
                    </Link>
                  </Button>
                </motion.div>

                {/* Metadata Row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-4 mb-8 text-sm"
                >
                  <Badge className="bg-foreground text-background hover:bg-foreground/90 px-3 py-1 rounded-md">
                    {categoryName}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={project.createAt}>
                      {new Date(project.createAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>5 min read</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{project.client}</span>
                  </div>
                </motion.div>

                {/* Title - Using h1 for SEO */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight text-foreground mb-6"
                >
                  {project.name}
                </motion.h1>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-base md:text-lg text-muted-foreground leading-relaxed prose prose-sm md:prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: project.description || "",
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Content - Images Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2 space-y-6"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    Project Gallery
                  </h2>

                  {/* Additional Images Grid */}
                  {additionalImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {additionalImages.map((url, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.4 + index * 0.1,
                          }}
                          className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg group"
                        >
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`${project.name} - Image ${index + 2}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No additional images available for this project.
                    </p>
                  )}

                  {/* Category Description */}
                  {categoryDescription && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-8"
                    >
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-3">
                            About {categoryName}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {categoryDescription}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Sidebar - Project Details */}
              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
                aria-label="Project information"
              >
                {/* Project Information Card */}
                <Card className="sticky top-6">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Project Details
                      </h3>

                      <dl className="space-y-4">
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                          <Building2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <dt className="text-sm font-medium mb-1">Client</dt>
                            <dd className="text-sm text-muted-foreground">
                              {project.client || "N/A"}
                            </dd>
                          </div>
                        </div>

                        {project.industry && (
                          <div className="flex items-start gap-3 pb-4 border-b border-border">
                            <Briefcase className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <dt className="text-sm font-medium mb-1">
                                Industry
                              </dt>
                              <dd className="text-sm text-muted-foreground">
                                {project.industry}
                              </dd>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                          <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <dt className="text-sm font-medium mb-1">
                              Completed
                            </dt>
                            <dd className="text-sm text-muted-foreground">
                              <time dateTime={project.createAt}>
                                {new Date(project.createAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                            </dd>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <dt className="text-sm font-medium mb-1">
                              Category
                            </dt>
                            <dd className="text-sm text-muted-foreground">
                              {categoryName}
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </div>

                    {/* View Project Button */}
                    {project.link && (
                      <Button asChild className="w-full" size="lg">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          View Live Project
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
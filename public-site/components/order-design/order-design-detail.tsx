"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/header";
import { OrderDesignDetailSkeleton } from "@/components/order-design/order-design-skeleton";
import { WhatsAppOrderDesignDialog } from "@/components/order-design/whatsapp-order-design-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGetOrderDesignByTitleQuery } from "@/lib/features/orderDesigns/orderDesignApi";
import { PostType } from "@/lib/orderDesign";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageIcon,
  Layers,
  Ruler,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const postTypeColors: Record<string, string> = {
  FACEBOOK_POST:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  INSTAGRAM_POST:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  INSTAGRAM_STORY:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  TIKTOK: "bg-gray-800 text-white",
  YOUTUBE_THUMBNAIL:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  TWITTER: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  LINKEDIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

function formatPostType(type: PostType): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// JSON-LD Structured Data Component
function DesignJsonLd({ design }: { design: any }) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://sagaljet.net";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: design.title,
    description:
      design.description ||
      `Professional ${formatPostType(design.postType)} design by Sagaljet`,
    image: design.images || [],
    brand: {
      "@type": "Brand",
      name: "Sagaljet",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Sagaljet",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      url: typeof window !== "undefined" ? window.location.href : "",
      seller: {
        "@type": "Organization",
        name: "Sagaljet",
      },
    },
    category: formatPostType(design.postType),
    datePublished: design.createdAt,
    ...(design.size && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Size",
        value: design.size,
      },
    }),
  };

  return (
    <Script
      id="design-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Breadcrumb JSON-LD
function BreadcrumbJsonLd({ design }: { design: any }) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://sagaljet.net";
  
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sagaljet",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Designs",
        item: `${siteUrl}/designs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: design.title,
        item: `${siteUrl}/designs/${design.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
    ],
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}

// Organization JSON-LD (for brand recognition)
function OrganizationJsonLd() {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://sagaljet.net";
  
  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sagaljet",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://facebook.net/sagaljet",
      "https://instagram.net/sagaljet",
      "https://twitter.net/sagaljet",
    ],
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
    />
  );
}

export default function OrderDesignDetailPage() {
  const params = useParams();
  const title = params.title as string;

  const {
    data: design,
    isLoading,
    isError,
    error,
  } = useGetOrderDesignByTitleQuery(title, {
    skip: !title,
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Image Navigation
  const handlePrevImage = () => {
    const images = design?.images || [];
    if (images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    const images = design?.images || [];
    if (images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevImage();
    if (e.key === "ArrowRight") handleNextImage();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  // Loading State
  if (isLoading) {
    return <OrderDesignDetailSkeleton />;
  }

  // Error State
  if (isError || !design) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Design Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The design "{title?.replace(/-/g, " ")}" doesn't exist or has been
            removed.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {error && "message" in error
              ? String(error.message)
              : "Please check the URL and try again."}
          </p>
          <Button asChild>
            <Link href="/designs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Designs
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const images = design.images || [];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <DesignJsonLd design={design} />
      <BreadcrumbJsonLd design={design} />
      <OrganizationJsonLd />

      <Navbar />
      <main className="min-h-screen bg-background py-8 overflow-x-hidden">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Sagaljet
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/designs"
                  className="hover:text-foreground transition-colors"
                >
                  Designs
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]">
                {design.title}
              </li>
            </ol>
          </nav>

          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/designs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Designs
            </Link>
          </Button>

          <article className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Images */}
            <div className="space-y-4">
              <motion.figure
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-muted border group"
              >
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[selectedImageIndex] || "/placeholder.svg"}
                      alt={`${design.title} - ${formatPostType(design.postType)} design by Sagaljet`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Image Count Badge */}
                    {images.length > 1 && (
                      <Badge
                        variant="secondary"
                        className="absolute top-4 left-4 bg-black/60 text-white border-0"
                      >
                        <Layers className="w-3 h-3 mr-1" />
                        {selectedImageIndex + 1} / {images.length}
                      </Badge>
                    )}

                    {/* Post Type Badge */}
                    <Badge
                      className={cn(
                        "absolute top-4 right-4 border-0",
                        postTypeColors[design.postType] || postTypeColors.OTHER
                      )}
                    >
                      {formatPostType(design.postType)}
                    </Badge>

                    {/* Hover Overlay */}
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center"
                      aria-label="View full image"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                        <Expand className="w-5 h-5" />
                        <span className="font-medium">View Full Image</span>
                      </div>
                    </button>

                    {/* Zoom Button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-4 right-4 z-10 opacity-70 hover:opacity-100"
                      onClick={() => setLightboxOpen(true)}
                      aria-label="Zoom image"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-20 h-20 text-muted-foreground" />
                  </div>
                )}
              </motion.figure>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                  role="tablist"
                  aria-label="Design images"
                >
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      role="tab"
                      aria-selected={selectedImageIndex === index}
                      aria-label={`View image ${index + 1}`}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                        selectedImageIndex === index
                          ? "border-[#422f7e] ring-2 ring-[#422f7e]/20"
                          : "border-border hover:border-[#422f7e]/50"
                      )}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${design.title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Details */}
            <div className="space-y-6 overflow-hidden">
              {/* Header */}
              <header>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    className={cn(
                      "border-0",
                      postTypeColors[design.postType] || postTypeColors.OTHER
                    )}
                  >
                    {formatPostType(design.postType)}
                  </Badge>
                  {design.size && (
                    <Badge variant="outline" className="gap-1">
                      <Ruler className="w-3 h-3" />
                      {design.size}
                    </Badge>
                  )}
                  {images.length > 1 && (
                    <Badge variant="outline" className="gap-1">
                      <Layers className="w-3 h-3" />
                      {images.length} images
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-2">{design.title}</h1>

                {design.description && (
                  <p className="text-muted-foreground">{design.description}</p>
                )}
              </header>

              <Separator />

              {/* Quote Info */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#422f7e]/5 to-[#25D366]/5 border">
                <p className="text-sm text-muted-foreground">
                  Interested in this design? Request a quote and our Sagaljet
                  team will get back to you with pricing and delivery options.
                </p>
              </div>

              {/* WhatsApp Quote Button */}
              <WhatsAppOrderDesignDialog design={design} />

              {/* Date */}
              {design.createdAt && (
                <p className="text-center text-sm text-muted-foreground pt-4">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  <time dateTime={design.createdAt}>
                    Added {format(new Date(design.createdAt), "MMM d, yyyy")}
                  </time>
                </p>
              )}
            </div>
          </article>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none"
            onKeyDown={handleKeyDown}
          >
            <DialogTitle className="sr-only">
              {design.title} - Sagaljet Design Gallery
            </DialogTitle>

            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[selectedImageIndex] || "/placeholder.svg"}
                    alt={`${design.title} - Image ${selectedImageIndex + 1} by Sagaljet`}
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                    sizes="95vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails in Lightbox */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={cn(
                      "relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all border-2",
                      selectedImageIndex === index
                        ? "border-white ring-2 ring-white/50"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
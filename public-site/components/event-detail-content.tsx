// components/event-detail-content.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  User,
  X,
  ZoomIn,
  Images,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetEventBySlugQuery } from "@/lib/features/events/eventsApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Event } from "@/lib/features/events/eventsApi";
import DOMPurify from "isomorphic-dompurify";
import { EventDetailSkeleton } from "./events/EventSkeleton";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface EventDetailContentProps {
  eventSlug: string;
  initialEvent?: Event;
}

// Helper to get images array
function getImagesArray(
  imageUrl: string | string[] | null | undefined
): string[] {
  if (!imageUrl) return [];
  if (Array.isArray(imageUrl)) return imageUrl.filter(Boolean);
  return [imageUrl];
}

// Component to render HTML content safely
function HTMLContent({ html }: { html: string | null }) {
  if (!html) return null;

  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });

  return (
    <div
      className="text-base md:text-lg text-muted-foreground leading-relaxed prose prose-sm md:prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}

// Image Gallery Component
function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const hasMultipleImages = images.length > 1;
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  }, [displayImages.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevLightbox = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  return (
    <>
      {/* Main Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] lg:h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={displayImages[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover cursor-pointer"
              priority
              onClick={() => openLightbox(currentIndex)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Zoom Button */}
        <button
          onClick={() => openLightbox(currentIndex)}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            <Images className="h-4 w-4" />
            <span className="text-sm font-medium">
              {currentIndex + 1} / {displayImages.length}
            </span>
          </div>
        )}

        {/* Dot Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {displayImages.slice(0, 7).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  currentIndex === index
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
            {displayImages.length > 7 && (
              <span className="text-white/70 text-xs ml-1">
                +{displayImages.length - 7}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {hasMultipleImages && (
        <div className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                    currentIndex === index
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 p-2"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-50 text-white text-sm">
              {lightboxIndex + 1} / {displayImages.length}
            </div>

            {/* Navigation */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLightbox();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300 p-2"
                >
                  <ChevronLeft className="h-10 w-10" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightbox();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300 p-2"
                >
                  <ChevronRight className="h-10 w-10" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full max-w-6xl max-h-[85vh] m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[lightboxIndex]}
                alt={`${title} - Image ${lightboxIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Thumbnails in Lightbox */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(index);
                    }}
                    className={cn(
                      "relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all",
                      lightboxIndex === index
                        ? "border-white"
                        : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function EventDetailContent({
  eventSlug,
  initialEvent,
}: EventDetailContentProps) {
  const {
    data: event = initialEvent,
    isLoading,
    isError,
    refetch,
  } = useGetEventBySlugQuery(eventSlug, {
    skip: !eventSlug,
    refetchOnMountOrArgChange: true,
  });

  const images = event ? getImagesArray(event.imageUrl) : [];
  const eventDate = event ? new Date(event.startAt) : null;
  const endDate = event?.endAt ? new Date(event.endAt) : null;
  const isPast = event
    ? endDate
      ? endDate < new Date()
      : eventDate
      ? eventDate < new Date()
      : false
    : false;

  const handleShare = async () => {
    if (!event) return;

    const shareData = {
      title: event.title,
      text: event.description
        ? event.description.replace(/<[^>]*>/g, "").substring(0, 100)
        : "",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading && !initialEvent) {
    return <EventDetailSkeleton />;
  }

  if (isError || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>
              Event not found or an error occurred while loading the event.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Image Gallery */}
      <ImageGallery images={images} title={event.title} />

      {/* Main Content Card */}
      <div className="relative -mt-24 z-10 container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl mx-auto"
        >
          <Card className="bg-white dark:bg-gray-900 shadow-2xl border-0">
            <CardContent className="p-6 md:p-10 lg:p-12">
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <Button
                  asChild
                  variant="ghost"
                  className="text-foreground hover:bg-muted -ml-4"
                >
                  <Link href="/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                  </Link>
                </Button>
              </motion.div>

              {/* Metadata Row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                {/* Client Badge */}
                {event.client && (
                  <Badge
                    variant="outline"
                    className="bg-primary/5 border-primary/20 text-primary px-3 py-1"
                  >
                    <User className="h-3 w-3 mr-1.5" />
                    {event.client}
                  </Badge>
                )}

                {event.category && (
                  <Badge className="bg-foreground text-background hover:bg-foreground/90 px-3 py-1">
                    {event.category}
                  </Badge>
                )}

                {eventDate && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {eventDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {isPast && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Past Event
                  </Badge>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight text-foreground mb-6"
              >
                {event.title}
              </motion.h1>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {event.description ? (
                  <HTMLContent html={event.description} />
                ) : (
                  <p className="text-muted-foreground">
                    No description available for this event.
                  </p>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* About Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  About This Event
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <HTMLContent html={event.description} />
                    {!event.description && (
                      <p className="text-muted-foreground">
                        Join us for this exciting event. More details will be
                        shared soon.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Image Gallery Grid (if multiple images) */}
              {images.length > 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Event Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => {
                          // Open lightbox at this index
                        }}
                      >
                        <Image
                          src={img}
                          alt={`${event.title} - Gallery ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <Card className="sticky top-6">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Event Details
                    </h3>

                    <div className="space-y-4">
                      {/* Client */}
                      {event.client && (
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                          <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Client</p>
                            <p className="text-sm text-muted-foreground">
                              {event.client}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      {eventDate && (
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                          <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Date</p>
                            <p className="text-sm text-muted-foreground">
                              {eventDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            {endDate && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Ends:{" "}
                                {endDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Time */}
                      {event.time && (
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                          <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Time</p>
                            <p className="text-sm text-muted-foreground">
                              {event.time}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Location */}
                      {event.location && (
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Location</p>
                            <p className="text-sm text-muted-foreground">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* External Link */}
                      {event.link && (
                        <div className="flex items-start gap-3 pb-4 border-b border-border">
                          <LinkIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">
                              Event Link
                            </p>
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {event.link}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Capacity */}
                      {event.capacity && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Capacity</p>
                            <p className="text-sm text-muted-foreground">
                              Limited to {event.capacity} participants
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Image Count */}
                      {images.length > 1 && (
                        <div className="flex items-start gap-3 pt-4 border-t border-border">
                          <Images className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Gallery</p>
                            <p className="text-sm text-muted-foreground">
                              {images.length} photos available
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {/* External Link Button */}
                    {event.link && !isPast && (
                      <Button asChild className="w-full" size="lg">
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Visit Event Page
                        </a>
                      </Button>
                    )}

                    {/* Register Button (if no external link) */}
                    {!event?.link && !isPast && (
                      <Button className="w-full" size="lg">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Register Now
                      </Button>
                    )}

                    {/* Share Button */}
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="lg"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-5 w-5" />
                      Share Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

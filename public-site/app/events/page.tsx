"use client";

import { EventsLoadingSkeleton } from "@/components/events/EventSkeleton";
import HeroBanner from "@/components/hero/HeroBanner";
import PageHeader from "@/components/page-header";
import { SchemaOrg } from "@/components/schema-org";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useGetActiveEventsQuery } from "@/lib/features/events/eventsApi";
import { breadcrumbSchema } from "@/lib/schema-data";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

// Helper function to strip HTML and truncate text
function truncateText(html: string | null, maxLength: number = 150): string {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, "");
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

// Helper function to generate slug from title if not present
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to get images array (handles both string and array)
function getImagesArray(imageUrl: string | string[] | null): string[] {
  if (!imageUrl) return [];
  if (Array.isArray(imageUrl)) return imageUrl;
  return [imageUrl];
}

// Image Carousel Component for Event Cards
function EventImageCarousel({
  images,
  title,
  isPast,
}: {
  images: string[];
  title: string;
  isPast: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasMultipleImages = images.length > 1;
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative h-64 overflow-hidden rounded-t-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image
            src={displayImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Navigation Arrows */}
      {hasMultipleImages && (
        <>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg backdrop-blur-sm transition-all z-10"
          >
            <ChevronLeft className="h-4 w-4 text-gray-800" />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg backdrop-blur-sm transition-all z-10"
          >
            <ChevronRight className="h-4 w-4 text-gray-800" />
          </motion.button>
        </>
      )}

      {/* Image Counter Badge */}
      {hasMultipleImages && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full"
        >
          <Images className="h-3 w-3" />
          <span>
            {currentIndex + 1}/{displayImages.length}
          </span>
        </motion.div>
      )}

      {/* Past Event Badge */}
      {isPast && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 right-4"
        >
          <Badge
            variant="secondary"
            className="bg-gray-900/80 text-white backdrop-blur-sm"
          >
            Past Event
          </Badge>
        </motion.div>
      )}

      {/* Dot Indicators */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {displayImages.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToImage(index, e)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75",
              )}
            />
          ))}
          {displayImages.length > 5 && (
            <span className="text-white/70 text-xs ml-1">
              +{displayImages.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Event Card Component
function EventCard({
  event,
  isPast,
  eventSlug,
}: {
  event: any;
  isPast: boolean;
  eventSlug: string;
}) {
  const eventDate = new Date(event.startAt);
  const endDate = event.endAt ? new Date(event.endAt) : null;
  const images = getImagesArray(event.imageUrl);

  const formatDateRange = () => {
    const startFormatted = eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (endDate) {
      const endFormatted = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${startFormatted} - ${endFormatted}`;
    }

    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className={cn(
        "h-full flex flex-col group overflow-hidden",
        "hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500",
        "border-0 bg-white dark:bg-gray-900",
        isPast && "opacity-85",
      )}
    >
      {/* Event Image Carousel */}
      <EventImageCarousel images={images} title={event.title} isPast={isPast} />

      {/* Event Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {event.client && (
            <Badge
              variant="outline"
              className="bg-primary/5 border-primary/20 text-primary"
            >
              <User className="h-3 w-3 mr-1" />
              {event.client}
            </Badge>
          )}
          {!isPast && (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              Upcoming
            </Badge>
          )}
        </div>

        {/* Title */}
        <CardTitle className="text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {event.title}
        </CardTitle>

        {/* Description */}
        <CardDescription className="mb-4 line-clamp-2 text-muted-foreground">
          {truncateText(event.description, 100)}
        </CardDescription>

        {/* Event Details */}
        <div className="space-y-2.5 mt-auto">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{formatDateRange()}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {event.link && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <ExternalLink className="h-4 w-4 text-primary" />
              </div>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Event Link
              </a>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="mt-6 pt-4 border-t">
          <Button
            asChild
            className={cn(
              "w-full group/btn transition-all duration-300",
              isPast
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-primary hover:bg-primary/90",
            )}
          >
            <Link href={`/events/${eventSlug}`}>
              <span>{isPast ? "View Details" : "Learn More"}</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Featured Event Component (for the first/upcoming event)
function FeaturedEvent({ event }: { event: any }) {
  const eventDate = new Date(event.startAt);
  const images = getImagesArray(event.imageUrl);
  const eventSlug = event.slug || generateSlug(event.title);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-1">
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-80 lg:h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:bg-gradient-to-t" />

              {/* Featured Badge */}
              <div className="absolute top-6 left-6">
                <Badge className="bg-primary text-white px-4 py-1.5 text-sm font-semibold">
                  ⭐ Featured Event
                </Badge>
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                  {images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        "relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
                        currentImageIndex === idx
                          ? "border-white scale-105"
                          : "border-white/30 opacity-70 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                  {images.length > 4 && (
                    <div className="w-16 h-12 rounded-lg bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                      +{images.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {event.client && (
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/30"
                  >
                    <User className="h-3 w-3 mr-1" />
                    {event.client}
                  </Badge>
                )}
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {event.title}
              </h2>

              <p className="text-muted-foreground mb-6 text-lg line-clamp-3">
                {truncateText(event.description, 200)}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link href={`/events/${eventSlug}`}>
                    View Details
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {event.link && (
                  <Button asChild variant="outline" size="lg">
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      External Link
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const {
    data: events = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetActiveEventsQuery();

  const now = new Date();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Separate upcoming and past events
  const upcomingEvents = events.filter((event: any) => {
    const endDate = event.endAt
      ? new Date(event.endAt)
      : new Date(event.startAt);
    return endDate >= now;
  });

  const pastEvents = events.filter((event: any) => {
    const endDate = event.endAt
      ? new Date(event.endAt)
      : new Date(event.startAt);
    return endDate < now;
  });

  const featuredEvent = upcomingEvents[0];
  const otherUpcomingEvents = upcomingEvents.slice(1);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://sagaljet.net" },
    { name: "Events", url: "https://sagaljet.net/events" },
  ]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      <SchemaOrg schema={breadcrumbs} />

      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <HeroBanner
          type="events"
          heightClass="h-[350px] md:h-[450px]"
          ctaText="View Events"
          defaultLink="/event"
          autoPlayInterval={6000}
        />

        <section ref={sectionRef} className="py-16">
          <div className="container mx-auto px-4">
            {/* Loading State */}
            {isLoading && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <EventsLoadingSkeleton count={4} />
              </motion.div>
            )}

            {/* Error State */}
            {isError && (
              <Alert variant="destructive" className="mb-8">
                <AlertDescription className="flex items-center justify-between">
                  <span>Failed to load events. Please try again later.</span>
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
            )}

            {/* Empty State */}
            {!isLoading && !isError && events.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">No Events Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Check back later for upcoming events and workshops. We're
                  always planning something exciting!
                </p>
              </motion.div>
            )}

            {/* Events Content */}
            {!isLoading && events.length > 0 && (
              <>
                {/* Featured Event */}
                {featuredEvent && <FeaturedEvent event={featuredEvent} />}

                {/* Upcoming Events Section */}
                {otherUpcomingEvents.length > 0 && (
                  <div className="mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      className="flex items-center gap-4 mb-8"
                    >
                      <h2 className="text-2xl font-bold">Upcoming Events</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                      <Badge variant="secondary" className="text-sm">
                        {otherUpcomingEvents.length} events
                      </Badge>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                    >
                      {otherUpcomingEvents.map((event: any) => {
                        const eventSlug =
                          event.slug || generateSlug(event.title);
                        return (
                          // @ts-ignore
                          <motion.div key={event.id} variants={cardVariants}>
                            <EventCard
                              event={event}
                              isPast={false}
                              eventSlug={eventSlug}
                            />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                )}

                {/* Past Events Section */}
                {pastEvents.length > 0 && (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-4 mb-8"
                    >
                      <h2 className="text-2xl font-bold text-muted-foreground">
                        Past Events
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-muted-foreground/30 to-transparent" />
                      <Badge variant="outline" className="text-sm">
                        {pastEvents.length} events
                      </Badge>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                    >
                      {pastEvents.map((event: any) => {
                        const eventSlug =
                          event.slug || generateSlug(event.title);
                        return (
                          // @ts-ignore
                          <motion.div key={event.id} variants={cardVariants}>
                            <EventCard
                              event={event}
                              isPast={true}
                              eventSlug={eventSlug}
                            />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

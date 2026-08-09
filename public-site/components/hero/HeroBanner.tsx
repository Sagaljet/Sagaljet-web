// components/hero/HeroBanner.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Url } from "@/lib/url";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Types
export type BannerType = "projects" | "design" | "events" | "blogs" | "about" | "contact"|"banner";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  label: string;
  image: string;
  url?: string | null;
  discount?: number | null;
  discountType?: string | null;
  originalPrice?: number;
  finalPrice?: number;
}

interface HeroBannerProps {
  type: BannerType;
  heightClass?: string;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  ctaText?: string;
  defaultLink?: string;
  overlayGradient?: string;
}

export default function HeroBanner({
  type,
  heightClass = "h-[300px] md:h-[380px]",
  autoPlayInterval = 5000,
  showIndicators = true,
  ctaText = "Learn More",
  defaultLink = "/",
  overlayGradient = "bg-gradient-to-r from-black/70 via-black/30 to-transparent",
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerData, setBannerData] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners by type
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${Url}/banners/${type}/active`);

        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }

        const data = await response.json();
        setBannerData(data.result || []);
      } catch (err) {
        console.error(`Error fetching ${type} banners:`, err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  // Auto-play slides
  useEffect(() => {
    if (bannerData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerData.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [bannerData.length, autoPlayInterval]);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideVariants = {
    enter: { opacity: 0, scale: 1.05, zIndex: 1 },
    center: { opacity: 1, scale: 1, zIndex: 2 },
    exit: { opacity: 0, zIndex: 1 },
  };

  const getBannerLink = (banner: Banner): string => {
    return banner.url || defaultLink;
  };

  const isExternalUrl = (url: string): boolean => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  // Loading State
  if (isLoading) {
    return (
      <section className={`${heightClass} flex items-center justify-center bg-muted/20 w-full`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className={`${heightClass} flex items-center justify-center px-4 bg-muted/20 w-full`}>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="mt-2 bg-[#e20613]"
          >
            Reload
          </Button>
        </div>
      </section>
    );
  }

  // Empty State
  if (bannerData.length === 0) {
    return null;
  }

  const currentBanner = bannerData[currentIndex];
  const bannerLink = getBannerLink(currentBanner);
  const isExternal = isExternalUrl(bannerLink);

  return (
    <section className="w-full">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={`relative ${heightClass} w-full overflow-hidden group`}
      >
        {/* Background Images */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 1.0, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentBanner.image || "/placeholder.svg"}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center"
            />
            <div className={`absolute inset-0 ${overlayGradient}`} />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-xl space-y-2 md:space-y-4"
              >
                {/* Label */}
                {currentBanner.label && (
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-primary bg-white/95 px-2 md:px-3 py-1 rounded-full tracking-wider uppercase shadow-sm">
                      {currentBanner.label}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
                  {currentBanner.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-white/90 font-medium max-w-md line-clamp-2">
                  {currentBanner.subtitle}
                </p>

                {/* Discount Badge */}
                {currentBanner.discount && (
                  <div className="inline-block">
                    <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full">
                      {currentBanner.discountType === "percentage"
                        ? `${currentBanner.discount}% OFF`
                        : `$${currentBanner.discount} OFF`}
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-1 md:pt-2">
                  {isExternal ? (
                    <a href={bannerLink} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-[#e20613] hover:bg-primary/90 text-white font-bold h-9 md:h-11 px-6 text-sm md:text-base rounded-full shadow-lg transition-transform duration-300 hover:-translate-y-0.5">
                        {ctaText}
                      </Button>
                    </a>
                  ) : (
                    <Link href={bannerLink}>
                      <Button className="bg-[#e20613] hover:bg-[#e20613]/90 text-white font-bold h-9 md:h-11 px-6 text-sm md:text-base rounded-full shadow-lg transition-transform duration-300 hover:-translate-y-0.5">
                        {ctaText}
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators */}
        {showIndicators && bannerData.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {bannerData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-500 rounded-full shadow-sm ${
                  index === currentIndex
                    ? "bg-[#e20613] w-6 md:w-8 h-1.5 md:h-2"
                    : "bg-white/50 hover:bg-white/80 w-1.5 md:w-2 h-1.5 md:h-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
"use client";

import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useGetDesignsQuery } from "@/lib/features/designs/designApi";

// Price calculation helper function
function calculateMinPrice(design: any): {
  minPrice: number;
  hasOptions: boolean;
  type: "fixed" | "starting" | "quote";
} {
  const BOOKS_CATEGORY_NAME = "Books and Publications";

  // For books, show "Get Quote"
  if (design?.categoryDesign?.name === BOOKS_CATEGORY_NAME) {
    return {
      minPrice: 0,
      hasOptions: false,
      type: "quote",
    };
  }

  // Check if design has components
  if (!design?.components || design.components.length === 0) {
    return {
      minPrice: design?.price || 0,
      hasOptions: false,
      type: "fixed",
    };
  }

  // Group components by type and find minimum price for each type
  const typeMinPrices = new Map<number, number>();

  design.components.forEach((component: any) => {
    const typeId = component.option?.typeId || component.option?.type?.id;
    const price = component.extraPrice || 0;

    if (typeId === undefined) return;

    if (!typeMinPrices.has(typeId)) {
      typeMinPrices.set(typeId, price);
    } else {
      const currentMin = typeMinPrices.get(typeId)!;
      if (price < currentMin) {
        typeMinPrices.set(typeId, price);
      }
    }
  });

  // Sum up minimum prices from each type
  let totalMinPrice = 0;
  typeMinPrices.forEach((minPrice) => {
    totalMinPrice += minPrice;
  });

  return {
    minPrice: totalMinPrice,
    hasOptions: true,
    type: "starting",
  };
}

// Price Display Component
function PriceDisplay({ design }: { design: any }) {
  const priceInfo = useMemo(() => calculateMinPrice(design), [design]);

  if (priceInfo.type === "quote") {
    return (
      <p className="text-sm lg:text-base font-semibold text-blue-600 dark:text-blue-400">
        Get Quote
      </p>
    );
  }

  if (priceInfo.type === "starting" && priceInfo.hasOptions) {
    return (
      <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
        <span className="text-xs lg:text-sm font-medium text-gray-400 dark:text-gray-500">
          From{" "}
        </span>
        <span className="font-bold text-gray-800 dark:text-gray-100">
          ${priceInfo.minPrice.toFixed(2)}
        </span>
      </p>
    );
  }

  return (
    <p className="text-sm lg:text-base font-bold text-gray-800 dark:text-gray-100">
      ${priceInfo.minPrice.toFixed(2)}
    </p>
  );
}

// Design Card Component
function DesignCard({ design, index }: { design: any; index: number }) {
  const itemVariants: Variants = {
    // hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className="flex flex-col h-full">
      <Link
        href={`/services/${design.slug || design.id}`}
        className="group cursor-pointer h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3 lg:mb-4">
          {/* Coral Badge - Top Left */}
          {design.isPrintable && (
            <div className="absolute top-2 left-2 lg:top-3 lg:left-3 z-10">
              <span className="bg-[#ff7059] text-white text-[9px] sm:text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-0.5 lg:py-1 rounded shadow-sm uppercase tracking-wide">
                Print
              </span>
            </div>
          )}

          {/* Options Badge - Top Right */}
          {design.components && design.components.length > 0 && (
            <div className="absolute top-2 right-2 lg:top-3 lg:right-3 z-10">
              <span className="bg-[#422f7e]/90 text-white text-[9px] sm:text-[10px] lg:text-xs font-medium px-1.5 lg:px-2 py-0.5 lg:py-1 rounded shadow-sm">
                {
                  new Set(
                    design.components.map(
                      (c: any) => c.option?.typeId || c.option?.type?.id,
                    ),
                  ).size
                }{" "}
                options
              </span>
            </div>
          )}

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-1.5 lg:p-2">
            <motion.img
              src={design.images[0] || "/placeholder.svg"}
              alt={design.title}
              className="w-full h-full object-cover rounded-lg lg:rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
              whileHover={{ scale: 1.05 }}
            />
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl lg:rounded-2xl" />
        </div>

        {/* Text Content - Centered Below */}
        <div className="text-center space-y-0.5 lg:space-y-1 flex-1 flex flex-col justify-start">
          <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#e20613] transition-colors line-clamp-2 leading-tight">
            {design.title}
          </h3>

          {/* Dynamic Price Display */}
          <PriceDisplay design={design} />
        </div>
      </Link>
    </motion.div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <section className="py-8 lg:py-12 xl:py-16 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-[1800px] mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="h-8 lg:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto mb-3 animate-pulse" />
          <div className="h-4 lg:h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          {[...Array(12)].map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden bg-white dark:bg-gray-800 animate-pulse rounded-xl lg:rounded-2xl"
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
              <div className="p-3 lg:p-4 space-y-2">
                <div className="h-4 lg:h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 lg:h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FeaturedDesigns() {
  const { data: designs, isLoading, error } = useGetDesignsQuery();

  // Get 12 designs for 2 rows (6 per row on large screens)
  const featuredDesigns = designs?.slice(0, 12) || [];

  const containerVariants = {
    // hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || featuredDesigns.length === 0) {
    return null;
  }

  return (
    <section className="py-8 lg:py-12 xl:py-16 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white dark:bg-gray-950">
      <div className="max-w-[1800px] mx-auto">
        {/* Products Grid - Responsive: 2/3/4/5/6 columns */}
        <motion.div
          variants={containerVariants}
          // initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 xl:gap-8"
        >
          {featuredDesigns.map((design, index) => (
            <DesignCard key={design.id} design={design} index={index} />
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8 lg:mt-12 xl:mt-16"
        >
          <Link href="/services">
            <Button className="bg-[#e20613] hover:bg-[#c1050f] text-white font-bold px-6 sm:px-8 lg:px-10 py-5 sm:py-6 lg:py-7 text-sm sm:text-base lg:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
              View All Categories
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

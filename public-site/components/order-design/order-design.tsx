// src/app/order-designs/page.tsx

"use client";

import Navbar from "@/components/header";
import { NoResults } from "@/components/order-design/no-results";
import { OrderDesignCard } from "@/components/order-design/order-design-card";
import { OrderDesignFilters } from "@/components/order-design/order-design-filters";
import { OrderDesignsLoadingSkeleton } from "@/components/order-design/order-design-skeleton";
import { Button } from "@/components/ui/button";
import {
  useGetOrderDesignsQuery,
  useGetPostTypesQuery,
} from "@/lib/features/orderDesigns/orderDesignApi";
import { PostType } from "@/lib/orderDesign";
import { motion, Variants } from "framer-motion";
import { Palette, RefreshCw } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import HeroBanner from "../hero/HeroBanner";

export default function OrderDesignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostType, setSelectedPostType] = useState<PostType | "ALL">(
    "ALL",
  );

  const {
    data: orderDesigns = [],
    isLoading: designsLoading,
    isError: designsError,
    isFetching: designsFetching,
  } = useGetOrderDesignsQuery();

  const { data: postTypes = [] } = useGetPostTypesQuery();

  // Filter designs
  const filteredDesigns = useMemo(() => {
    return orderDesigns.filter((design) => {
      // Search filter
      const searchFields = [
        design.title || "",
        design.description || "",
        design.size || "",
      ].map((f) => f.toLowerCase());
      const matchesSearch =
        !searchQuery ||
        searchFields.some((field) => field.includes(searchQuery.toLowerCase()));

      // Post type filter
      const matchesPostType =
        selectedPostType === "ALL" || design.postType === selectedPostType;

      return matchesSearch && matchesPostType;
    });
  }, [orderDesigns, searchQuery, selectedPostType]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (designsLoading) {
    return <OrderDesignsLoadingSkeleton />;
  }

  if (designsError) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Error loading designs</h2>
            <p className="text-muted-foreground mb-6">
              Something went wrong. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#422f7e] hover:bg-[#422f7e]/90 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<OrderDesignsLoadingSkeleton />}>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-background">
        <HeroBanner
          type="design"
          heightClass="h-[350px] md:h-[450px]"
          ctaText="Order Now"
          defaultLink="/designs"
          autoPlayInterval={6000}
        />

        <OrderDesignFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPostType={selectedPostType}
          setSelectedPostType={setSelectedPostType}
          postTypes={postTypes}
          totalFiltered={filteredDesigns.length}
          isFetching={designsFetching}
        />

        {/* Designs Grid */}
        <section className="py-8 sm:py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            {filteredDesigns.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredDesigns.map((design) => (
                  <motion.div
                    key={design.id}
                    variants={cardVariants}
                    className="h-full"
                  >
                    <OrderDesignCard design={design} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <NoResults
                onClearFilters={() => {
                  setSearchQuery("");
                  setSelectedPostType("ALL");
                }}
              />
            )}
          </div>
        </section>
      </div>
    </Suspense>
  );
}

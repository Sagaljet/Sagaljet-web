"use client";

import { DesignsLoadingSkeleton } from "@/components/design/design-skeleton";
import Navbar from "@/components/header";
import { DesignCard } from "@/components/services/design-card";
import { NoResults } from "@/components/services/no-results";
import { DesignFilters } from "@/components/services/services-filters";
import { Button } from "@/components/ui/button";
import { useGetCategoriesQuery } from "@/lib/features/categories/categories-api";
import { Design, useGetDesignsQuery } from "@/lib/features/designs/designApi";
import type { DesignCategory } from "@/lib/types/services";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Palette, RefreshCw, Package } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function DesignsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const searchParams = useSearchParams();

  const {
    data: designsData,
    isLoading: designsLoading,
    isError: designsError,
    isFetching: designsFetching,
  } = useGetDesignsQuery();

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      setSelectedCategory(Number(categoryParam));
    } else {
      setSelectedCategory(null);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const designs: Design[] = Array.isArray(designsData) ? designsData : [];
  const categories: DesignCategory[] = Array.isArray(categoriesData)
    ? categoriesData
    : [];

  const filterDesigns = (items: Design[]): Design[] => {
    return items.filter((item) => {
      const searchFields = [
        item.title || "",
        item.description || "",
        item.slug || "",
      ].map((f) => f.toLowerCase());
      const matchesSearch = searchFields.some((field) =>
        field.includes(searchQuery.toLowerCase())
      );

      const matchesCategory =
        selectedCategory === null ||
        item.categoryDesignId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredDesigns = filterDesigns(designs);

  const isLoading = designsLoading || categoriesLoading;
  const isFetching = designsFetching;
  const isError = designsError;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  if (isLoading) {
    return <DesignsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Unable to load designs
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Something went wrong. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Sticky Filter Bar */}
        <DesignFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          totalFiltered={filteredDesigns.length}
          isFetching={isFetching}
        />

        {/* Products Grid Section */}
        <section className="py-4 sm:py-6" ref={sectionRef}>
          <div className="container mx-auto px-4">
            {filteredDesigns.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`${selectedCategory}-${searchQuery}`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredDesigns.map((design) => (
                    <motion.div
                      key={design.id}
                      variants={cardVariants}
                      layout
                      className="h-full"
                    >
                      <DesignCard design={design} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <NoResults
                onClearFilters={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default function DesignsPage() {
  return (
    <Suspense fallback={<DesignsLoadingSkeleton />}>
      <DesignsContent />
    </Suspense>
  );
}
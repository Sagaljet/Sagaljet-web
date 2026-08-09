"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, BookOpen, Settings, Sparkles, ArrowRight } from "lucide-react";
import { useMemo } from "react";

// Types from your interfaces
interface ComponentType {
  id: number;
  name: string;
}

interface ComponentOption {
  id: number;
  value: string;
  typeId: number;
  type?: ComponentType;
}

interface ProductComponent {
  id: number;
  productId: number;
  optionId: number;
  extraPrice: number;
  option: ComponentOption;
}

interface DesignCategory {
  id: number;
  name: string;
}

interface DesignFeature {
  id: number;
  name: string;
  value: string;
  extraCost: number;
}

interface Design {
  id: number;
  title: string;
  slug: string | null;
  price: number;
  description: string | null;
  images: string[];
  isPrintable: boolean;
  categoryDesignId: number;
  categoryDesign?: DesignCategory;
  features: DesignFeature[];
  components: ProductComponent[];
  createdAt: string;
  updatedAt: string;
}

// Constants
const BOOKS_CATEGORY_NAME = "Books and Publications";

interface DesignCardProps {
  design: Design;
}

export function DesignCard({ design }: DesignCardProps) {
  // Check if it's a book category
  const isBookCategory = useMemo(() => {
    return design?.categoryDesign?.name === BOOKS_CATEGORY_NAME;
  }, [design?.categoryDesign?.name]);

  // Calculate minimum price from component options
  const priceInfo = useMemo(() => {
    if (isBookCategory) {
      return {
        type: "quote" as const,
        minPrice: 0,
        hasOptions: false,
        optionCount: 0,
      };
    }

    if (!design?.components || design.components.length === 0) {
      return {
        type: "fixed" as const,
        minPrice: design?.price || 0,
        hasOptions: false,
        optionCount: 0,
      };
    }

    const typeMinPrices = new Map<number, { minPrice: number; typeName: string }>();

    design.components.forEach((component) => {
      const typeId = component.option?.typeId || component.option?.type?.id;
      const typeName = component.option?.type?.name || "Option";
      const price = component.extraPrice || 0;

      if (typeId === undefined) return;

      if (!typeMinPrices.has(typeId)) {
        typeMinPrices.set(typeId, { minPrice: price, typeName });
      } else {
        const current = typeMinPrices.get(typeId)!;
        if (price < current.minPrice) {
          typeMinPrices.set(typeId, { minPrice: price, typeName });
        }
      }
    });

    let totalMinPrice = 0;
    typeMinPrices.forEach(({ minPrice }) => {
      totalMinPrice += minPrice;
    });

    return {
      type: "starting" as const,
      minPrice: totalMinPrice,
      hasOptions: true,
      optionCount: typeMinPrices.size,
    };
  }, [design?.components, design?.price, isBookCategory]);

  const mainImage = design.images?.[0];

  const cleanDescription = useMemo(() => {
    if (!design.description) return "";
    return design.description.replace(/<[^>]*>/g, "").trim();
  }, [design.description]);

  return (
    <Link href={`/services/${design.slug}`} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-b from-card to-card/95 rounded-3xl">
          {/* Image Container - Rounded corners */}
          <div className="relative m-3 rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] relative bg-gradient-to-br from-muted via-muted to-muted/80">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={design.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#422f7e]/10 to-[#e20613]/10">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground/50 mt-2">No image</span>
                </div>
              )}

              {/* Beautiful Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Top Left - Category Badge */}
              <div className="absolute top-3 left-3">
                {design.categoryDesign?.name && (
                  <Badge
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg ${
                      isBookCategory
                        ? "bg-blue-500/90 text-white border border-blue-400/30"
                        : "bg-white/20 text-white border border-white/30"
                    }`}
                  >
                    {isBookCategory && <BookOpen className="w-3 h-3 mr-1.5" />}
                    {design.categoryDesign.name}
                  </Badge>
                )}
              </div>

              {/* Top Right - Printable Badge */}
              {design.isPrintable && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-[#e20613] to-[#ff4757] text-white text-[11px] px-3 py-1.5 rounded-full font-semibold shadow-lg border border-red-400/30">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Printable
                  </Badge>
                </div>
              )}

              {/* Bottom - Price Display (Centered & Prominent) */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between">
                  {/* Options Count */}
                  {priceInfo.hasOptions && priceInfo.optionCount > 0 && (
                    <Badge className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                      <Settings className="w-3 h-3 mr-1" />
                      {priceInfo.optionCount} options
                    </Badge>
                  )}
                  
                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Price Badge - Beautiful Design */}
                  {priceInfo.type === "quote" ? (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl shadow-xl backdrop-blur-sm">
                      <span className="text-sm font-bold">Get Quote</span>
                    </div>
                  ) : priceInfo.type === "starting" && priceInfo.hasOptions ? (
                    <div className="bg-gradient-to-r from-[#422f7e] to-[#5a3fa3] text-white px-4 py-2 rounded-xl shadow-xl backdrop-blur-sm">
                      <span className="text-[10px] font-medium opacity-80 block leading-none">Starting from</span>
                      <span className="text-lg font-bold leading-none">${priceInfo.minPrice.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-[#422f7e] to-[#5a3fa3] text-white px-4 py-2 rounded-xl shadow-xl backdrop-blur-sm">
                      <span className="text-lg font-bold">${priceInfo.minPrice.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="flex flex-col flex-grow px-4 pb-4 pt-1">
            {/* Title */}
            <h3 className="font-bold text-base sm:text-lg leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] text-foreground group-hover:text-[#422f7e] transition-colors duration-300">
              {design.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[2.5rem] leading-relaxed">
              {cleanDescription || "Professional design service tailored to your needs"}
            </p>

            {/* Spacer */}
            <div className="flex-grow min-h-3" />

            {/* Footer - CTA Button Style */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                {/* Left side info */}
                <div className="flex items-center gap-2">
                  {isBookCategory ? (
                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Custom Project
                    </span>
                  ) : priceInfo.hasOptions ? (
                    <span className="text-xs text-muted-foreground">
                      Customizable
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Fixed price
                    </span>
                  )}
                </div>

                {/* View Button */}
                <motion.div
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#422f7e] group-hover:text-[#e20613] transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
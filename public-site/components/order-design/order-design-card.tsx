// src/components/order-design/order-design-card.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ImageIcon,
  ShoppingCart,
  Eye,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { titleToSlug } from "@/lib/utils/slug";
import { OrderDesign } from "@/lib/orderDesign";

interface OrderDesignCardProps {
  design: OrderDesign;
}

const postTypeColors: Record<string, string> = {
  FACEBOOK_POST: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  INSTAGRAM_POST: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  INSTAGRAM_STORY: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  TIKTOK: "bg-gray-800 text-white dark:bg-gray-700",
  YOUTUBE_THUMBNAIL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  TWITTER: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  LINKEDIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

function formatPostType(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function OrderDesignCard({ design }: OrderDesignCardProps) {
  const firstImage = design.images?.[0];
  const imageCount = design.images?.length || 0;
  
  // ✅ Create URL-friendly slug from title
  const slug = titleToSlug(design.title);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="group overflow-hidden h-full flex flex-col border-border/50 hover:border-[#422f7e]/30 hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={design.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Image Count Badge */}
          {imageCount > 1 && (
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-black/60 text-white border-0"
            >
              <Layers className="w-3 h-3 mr-1" />
              {imageCount}
            </Badge>
          )}

          {/* Post Type Badge */}
          <Badge
            className={cn(
              "absolute top-3 right-3 border-0",
              postTypeColors[design.postType] || postTypeColors.OTHER
            )}
          >
            {formatPostType(design.postType)}
          </Badge>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              {/* ✅ Use title-based slug in URL */}
              <Link href={`/designs/${slug}`}>
                <Button
                  size="sm"
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-[#422f7e] transition-colors">
            {design.title}
          </h3>

          {design.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {design.description}
            </p>
          )}

          {design.size && (
            <Badge variant="outline" className="text-xs">
              {design.size}
            </Badge>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[#422f7e]">
              ${design.price.toFixed(2)}
            </span>
          </div>

          {/* ✅ Use title-based slug in URL */}
          <Link href={`/designs/${slug}`}>
            <Button className="bg-[#422f7e] hover:bg-[#422f7e]/90">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Now
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
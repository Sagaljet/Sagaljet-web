// app/services/[slug]/design-detail-client.tsx
"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import Script from "next/script";

import {
  Calendar,
  Sparkles,
  ImageIcon,
  ArrowLeft,
  Settings,
  AlertCircle,
  Check,
  X,
  BookOpen,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Expand,
  Briefcase,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { WhatsAppOrderDialog } from "@/components/whatsapp-contact-dialog";
import Navbar from "@/components/header";

import {
  type SelectedFeature,
  type SelectedOption,
} from "@/lib/features/designs/designApi";
import { cn } from "@/lib/utils";

// ✅ Categories that don't require components/options and have special pricing
const SPECIAL_CATEGORIES = ["Books and Publications", "Services"];

interface OptionItem {
  optionId: number;
  optionValue: string;
  extraPrice: number;
}

interface ComponentTypeGroup {
  typeName: string;
  typeId: number;
  options: OptionItem[];
}

interface DesignDetailClientProps {
  design: any; // Use your Design type from designApi
}

// ============================================
// ✅ TWITTER/X STYLE ANIMATED NUMBER
// ============================================

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <SpringNumber spring={spring} />;
}

function SpringNumber({ spring }: { spring: MotionValue<number> }) {
  const display = useTransform(spring, (current) => `$${current.toFixed(2)}`);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

// ============================================
// ✅ ANIMATED PRICE WITH SCALE EFFECT
// ============================================

function AnimatedPrice({
  price,
  className = "",
}: {
  price: number;
  className?: string;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPrice = useRef(price);

  useEffect(() => {
    if (prevPrice.current !== price) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevPrice.current = price;
      return () => clearTimeout(timer);
    }
  }, [price]);

  return (
    <motion.span
      className={cn("inline-flex items-baseline tabular-nums", className)}
      animate={
        isAnimating
          ? {
              scale: [1, 1.15, 1],
              color:
                price > prevPrice.current
                  ? ["inherit", "#22c55e", "inherit"]
                  : ["inherit", "#ef4444", "inherit"],
            }
          : {}
      }
      transition={{ duration: 0.3 }}
    >
      <AnimatedNumber value={price} />
    </motion.span>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DesignDetailClient({ design }: DesignDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeature[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // ============================================
  // ✅ CATEGORY CHECKS
  // ============================================

  const categoryName = useMemo(() => {
    return design?.categoryDesign?.name || "";
  }, [design?.categoryDesign?.name]);

  const isSpecialCategory = useMemo(() => {
    return SPECIAL_CATEGORIES.includes(categoryName);
  }, [categoryName]);

  const isBookCategory = categoryName === "Books and Publications";
  const isServiceCategory = categoryName === "Services";

  // ============================================
  // JSON-LD STRUCTURED DATA
  // ============================================

  const plainDescription = design.description
    ? design.description.replace(/<[^>]*>/g, "")
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isServiceCategory ? "Service" : "Product",
    name: design.title,
    description: plainDescription.slice(0, 200),
    image: design.images?.length > 0 ? design.images : undefined,
    ...(isSpecialCategory
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price: design.price || 0,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Sagaljet",
            },
          },
        }),
    category: categoryName,
    brand: {
      "@type": "Organization",
      name: "Sagaljet",
    },
    dateCreated: design.createdAt,
    ...(isBookCategory && {
      "@type": "Book",
      bookFormat: "Paperback",
    }),
  };

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
        name: "Services",
        item: "https://sagaljet.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: design.title,
        item: `https://sagaljet.com/services/${design.slug}`,
      },
    ],
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const componentTypes: ComponentTypeGroup[] = useMemo(() => {
    if (isSpecialCategory) return [];
    if (!design?.components?.length) return [];

    const typeMap = new Map<string, ComponentTypeGroup>();

    design.components.forEach((component: any) => {
      const typeName = component.option?.type?.name;
      const typeId = component.option?.type?.id || component.option?.typeId;
      const optionId = component.option?.id || component.optionId;
      const optionValue = component.option?.value;
      const extraPrice = component.extraPrice || 0;

      if (!typeName || !optionId) return;

      if (!typeMap.has(typeName)) {
        typeMap.set(typeName, {
          typeName,
          typeId: typeId || 0,
          options: [],
        });
      }

      const group = typeMap.get(typeName)!;
      const exists = group.options.some((opt) => opt.optionId === optionId);

      if (!exists) {
        group.options.push({
          optionId,
          optionValue: optionValue || "Unknown",
          extraPrice,
        });
      }
    });

    const result = Array.from(typeMap.values());
    result.forEach((group) => {
      group.options.sort((a, b) =>
        a.optionValue.localeCompare(b.optionValue, undefined, { numeric: true })
      );
    });
    result.sort((a, b) => a.typeName.localeCompare(b.typeName));

    return result;
  }, [design?.components, isSpecialCategory]);

  const hasOptions = componentTypes.length > 0;
  const typeNames = componentTypes.map((ct) => ct.typeName);

  const missingSelections = useMemo(() => {
    return typeNames.filter((typeName) => !selectedOptions[typeName]);
  }, [typeNames, selectedOptions]);

  const allOptionsSelected =
    isSpecialCategory || missingSelections.length === 0 || typeNames.length === 0;

  const selectedOptionsArray: SelectedOption[] = useMemo(() => {
    if (isSpecialCategory) return [];

    const result: SelectedOption[] = [];

    Object.entries(selectedOptions).forEach(([typeName, optionIdStr]) => {
      const optionId = Number(optionIdStr);
      const typeGroup = componentTypes.find((ct) => ct.typeName === typeName);
      const option = typeGroup?.options.find(
        (opt) => opt.optionId === optionId
      );

      if (option) {
        result.push({
          optionId: option.optionId,
          typeName,
          optionValue: option.optionValue,
          extraPrice: option.extraPrice,
        });
      }
    });

    return result;
  }, [selectedOptions, componentTypes, isSpecialCategory]);

  // ============================================
  // PRICE CALCULATIONS
  // ============================================

  const currentOptionsTotal = useMemo(() => {
    if (isSpecialCategory) return 0;
    return selectedOptionsArray.reduce(
      (sum, opt) => sum + (opt.extraPrice || 0),
      0
    );
  }, [selectedOptionsArray, isSpecialCategory]);

  const currentFeaturesTotal = useMemo(() => {
    if (isSpecialCategory) return 0;
    return selectedFeatures.reduce(
      (sum, feat) => sum + (feat.extraCost || 0),
      0
    );
  }, [selectedFeatures, isSpecialCategory]);

  const totalPrice = useMemo(() => {
    if (isSpecialCategory) return 0;
    const basePrice = hasOptions ? 0 : design?.price || 0;
    return (basePrice + currentOptionsTotal + currentFeaturesTotal) * quantity;
  }, [
    currentOptionsTotal,
    currentFeaturesTotal,
    quantity,
    isSpecialCategory,
    design?.price,
    hasOptions,
  ]);

  const unitPrice = useMemo(() => {
    if (isSpecialCategory) return 0;
    const basePrice = hasOptions ? 0 : design?.price || 0;
    return basePrice + currentOptionsTotal + currentFeaturesTotal;
  }, [
    currentOptionsTotal,
    currentFeaturesTotal,
    isSpecialCategory,
    design?.price,
    hasOptions,
  ]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleOptionSelect = (typeName: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [typeName]: optionId,
    }));
  };

  const handleClearSelection = (typeName: string) => {
    setSelectedOptions((prev) => {
      const updated = { ...prev };
      delete updated[typeName];
      return updated;
    });
  };

  const handleFeatureToggle = (feature: {
    id: number;
    name: string;
    value: string;
    extraCost: number;
  }) => {
    setSelectedFeatures((prev) => {
      const isSelected = prev.some((f) => f.featureId === feature.id);
      if (isSelected) {
        return prev.filter((f) => f.featureId !== feature.id);
      }
      return [
        ...prev,
        {
          featureId: feature.id,
          name: feature.name,
          value: feature.value,
          extraCost: feature.extraCost,
        },
      ];
    });
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };

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

  // ============================================
  // ✅ HELPER FUNCTION FOR CATEGORY INFO
  // ============================================

  const getCategoryInfo = () => {
    if (isBookCategory) {
      return {
        icon: <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0" />,
        badge: (
          <Badge className="bg-blue-600 text-white">
            <BookOpen className="w-3 h-3 mr-1" />
            Book / Publication
          </Badge>
        ),
        title: "Books & Publications",
        description:
          "This is a book/publication item. Price depends on specifications like page count, size, binding type, and quantity. Click 'Get Quote' to discuss your requirements with us.",
        cardBg: "bg-blue-50 dark:bg-blue-950/30",
        cardBorder: "border-blue-200 dark:border-blue-800",
        titleColor: "text-blue-800 dark:text-blue-200",
        descColor: "text-blue-700 dark:text-blue-300",
        priceText: "Contact for Price",
        priceColor: "text-blue-600",
        quantityLabel: "Estimated Quantity",
        quantityHint: "Enter your estimated quantity for an accurate quote",
      };
    }
    if (isServiceCategory) {
      return {
        icon: <Briefcase className="w-6 h-6 text-purple-600 flex-shrink-0" />,
        badge: (
          <Badge className="bg-purple-600 text-white">
            <Briefcase className="w-3 h-3 mr-1" />
            Service
          </Badge>
        ),
        title: "Professional Service",
        description:
          "This is a professional service. Pricing is customized based on your specific requirements, project scope, and timeline. Click 'Get Quote' to discuss your needs with our team.",
        cardBg: "bg-purple-50 dark:bg-purple-950/30",
        cardBorder: "border-purple-200 dark:border-purple-800",
        titleColor: "text-purple-800 dark:text-purple-200",
        descColor: "text-purple-700 dark:text-purple-300",
        priceText: "Price on Request",
        priceColor: "text-purple-600",
        quantityLabel: "Project Scope / Quantity",
        quantityHint: "Describe your project scope for an accurate quote",
      };
    }
    return null;
  };

  const categoryInfo = getCategoryInfo();
  const hasFeatures = !isSpecialCategory && design.features && design.features.length > 0;
  const images = design.images || [];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="design-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />
      <div className="min-h-screen bg-background py-8 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Designs
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Images */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-muted border group"
              >
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[selectedImageIndex] || "/placeholder.svg"}
                      alt={design.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                        <Expand className="w-5 h-5" />
                        <span className="font-medium">View Full Image</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-20 h-20 text-muted-foreground" />
                  </div>
                )}

                {isSpecialCategory && categoryInfo && (
                  <div className="absolute top-4 left-4 z-10">
                    {categoryInfo.badge}
                  </div>
                )}

                {images.length > 0 && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-4 right-4 z-10 opacity-70 hover:opacity-100 transition-opacity"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                )}
              </motion.div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                        selectedImageIndex === index
                          ? "border-[#422f7e] ring-2 ring-[#422f7e]/20"
                          : "border-border hover:border-[#422f7e]/50"
                      )}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
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
                  {isBookCategory && (
                    <Badge className="bg-blue-600">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Book
                    </Badge>
                  )}
                  {isServiceCategory && (
                    <Badge className="bg-purple-600">
                      <Briefcase className="w-3 h-3 mr-1" />
                      Service
                    </Badge>
                  )}
                  {design.isPrintable && !isServiceCategory && (
                    <Badge className="bg-[#e20613]">Printable</Badge>
                  )}
                  {hasOptions && !isSpecialCategory && (
                    <Badge variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      {componentTypes.length} Options
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-2">{design.title}</h1>

                {design.description && (
                  <p className="text-muted-foreground">
                    {design.description.replace(/<[^>]*>/g, "")}
                  </p>
                )}

                {/* PRICE DISPLAY */}
                <div className="flex items-center gap-3 mt-4">
                  {isSpecialCategory && categoryInfo ? (
                    <>
                      <span className={`text-2xl font-bold ${categoryInfo.priceColor}`}>
                        {categoryInfo.priceText}
                      </span>
                      <Badge
                        variant="outline"
                        className={`${categoryInfo.priceColor} border-current`}
                      >
                        Quote Required
                      </Badge>
                    </>
                  ) : hasOptions ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <AnimatedPrice
                        price={unitPrice}
                        className="text-3xl font-bold text-[#422f7e]"
                      />
                      {quantity > 1 && (
                        <span className="text-muted-foreground text-sm flex items-center gap-1">
                          × {quantity} =
                          <AnimatedPrice
                            price={totalPrice}
                            className="font-semibold text-[#422f7e] text-base"
                          />
                        </span>
                      )}
                      {selectedOptionsArray.length === 0 && (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-300 animate-pulse"
                        >
                          Select options
                        </Badge>
                      )}
                      {selectedOptionsArray.length > 0 &&
                        !allOptionsSelected && (
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-300"
                          >
                            {selectedOptionsArray.length}/
                            {componentTypes.length} selected
                          </Badge>
                        )}
                      {allOptionsSelected &&
                        selectedOptionsArray.length > 0 && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400">
                            <Check className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <AnimatedPrice
                        price={totalPrice}
                        className="text-3xl font-bold text-[#422f7e]"
                      />
                      <Badge variant="secondary">Fixed price</Badge>
                    </div>
                  )}
                </div>
              </header>

              <Separator />

              {/* Special Category Notice Card */}
              {isSpecialCategory && categoryInfo && (
                <Card className={`${categoryInfo.cardBg} ${categoryInfo.cardBorder}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {categoryInfo.icon}
                      <div>
                        <h3 className={`font-semibold ${categoryInfo.titleColor}`}>
                          {categoryInfo.title}
                        </h3>
                        <p className={`text-sm ${categoryInfo.descColor} mt-1`}>
                          {categoryInfo.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Options - HIDDEN for special categories */}
              {hasOptions && !isSpecialCategory && (
                <section className="space-y-6" aria-label="Product options">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-[#422f7e]" />
                    Customize Your Order
                  </h2>

                  {componentTypes.map((typeGroup) => {
                    const selectedOptionId =
                      selectedOptions[typeGroup.typeName] || "";
                    const selectedOption = typeGroup.options.find(
                      (opt) => String(opt.optionId) === selectedOptionId
                    );
                    const isSelected = selectedOptionId !== "";

                    return (
                      <div key={typeGroup.typeName} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">
                            {typeGroup.typeName}
                            <span className="text-destructive ml-1">*</span>
                          </Label>
                          {selectedOption && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              key={selectedOption.optionId}
                            >
                              <Badge className="bg-[#422f7e] text-white font-medium">
                                +${selectedOption.extraPrice.toFixed(2)}
                              </Badge>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Select
                            value={selectedOptionId}
                            onValueChange={(value: string) =>
                              handleOptionSelect(typeGroup.typeName, value)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "flex-1 h-12 text-base transition-colors duration-200",
                                !isSelected &&
                                  "border-amber-400 bg-amber-50/50 dark:bg-amber-950/20",
                                isSelected &&
                                  "border-green-500 bg-green-50/50 dark:bg-green-950/20"
                              )}
                            >
                              <SelectValue
                                placeholder={`Select ${typeGroup.typeName.toLowerCase()}...`}
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {typeGroup.options.map((option) => (
                                <SelectItem
                                  key={option.optionId}
                                  value={String(option.optionId)}
                                  className="py-3 cursor-pointer"
                                >
                                  <div className="flex items-center justify-between w-full gap-4">
                                    <span className="font-medium">
                                      {option.optionValue}
                                    </span>
                                    <span className="text-[#422f7e] font-semibold">
                                      ${option.extraPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {isSelected && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 shrink-0 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                              onClick={() =>
                                handleClearSelection(typeGroup.typeName)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {!isSelected ? (
                          <p className="text-xs text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Please select a {typeGroup.typeName.toLowerCase()}
                          </p>
                        ) : (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {selectedOption?.optionValue} selected
                          </p>
                        )}
                      </div>
                    );
                  })}
                </section>
              )}

              {/* Features - HIDDEN for special categories */}
              {hasFeatures && (
                <>
                  <Separator />
                  <section className="space-y-4" aria-label="Additional features">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#422f7e]" />
                      Additional Features
                    </h2>

                    <div className="space-y-3">
                      {design.features.map((feature: any) => {
                        const isSelected = selectedFeatures.some(
                          (f) => f.featureId === feature.id
                        );

                        return (
                          <div
                            key={feature.id}
                            onClick={() => handleFeatureToggle(feature)}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200",
                              isSelected
                                ? "border-[#422f7e] bg-[#422f7e]/5"
                                : "border-border hover:border-[#422f7e]/50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox checked={isSelected} />
                              <div>
                                <p className="font-medium">{feature.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {feature.value}
                                </p>
                              </div>
                            </div>
                            {feature.extraCost > 0 && (
                              <Badge
                                variant={isSelected ? "default" : "outline"}
                                className={isSelected ? "bg-[#422f7e]" : ""}
                              >
                                +${feature.extraCost.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}

              {/* Quantity */}
              {!isSpecialCategory && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Quantity</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(Number.parseInt(e.target.value) || 1)
                        }
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </Button>
                      {quantity > 1 && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          ={" "}
                          <AnimatedPrice
                            price={totalPrice}
                            className="font-semibold text-[#422f7e]"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Quantity for Special Categories */}
              {isSpecialCategory && categoryInfo && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      {categoryInfo.quantityLabel}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(Number.parseInt(e.target.value) || 1)
                        }
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {categoryInfo.quantityHint}
                    </p>
                  </div>
                </>
              )}

              {/* Price Summary Card */}
              <Card className="bg-gradient-to-br from-muted/50 to-muted">
                <CardContent className="pt-6">
                  {isSpecialCategory && categoryInfo ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className={`font-medium ${categoryInfo.priceColor}`}>
                          {categoryInfo.title}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {isBookCategory ? "Quantity" : "Scope"}
                        </span>
                        <span className="font-medium">
                          {quantity} {isBookCategory ? "copies" : "unit(s)"}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-semibold">Price</span>
                        <div className="text-right">
                          <span className={`text-xl font-bold ${categoryInfo.priceColor}`}>
                            Get Quote
                          </span>
                          <p className="text-xs text-muted-foreground">
                            Based on your requirements
                          </p>
                        </div>
                      </div>

                      <div className={`mt-4 p-3 rounded-lg ${categoryInfo.cardBg} border ${categoryInfo.cardBorder}`}>
                        <div className="flex items-center gap-2">
                          <MessageCircle className={`w-4 h-4 ${categoryInfo.priceColor}`} />
                          <p className={`text-sm ${categoryInfo.descColor}`}>
                            {isBookCategory
                              ? "Contact us with details about pages, size, binding, and quantity."
                              : "Contact us to discuss your project requirements and timeline."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : hasOptions ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">
                          Build Your Price
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {selectedOptionsArray.length}/{componentTypes.length}{" "}
                          selected
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base</span>
                        <span className="text-muted-foreground">$0.00</span>
                      </div>

                      {selectedOptionsArray.map((opt) => (
                        <div
                          key={opt.optionId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {opt.typeName}:{" "}
                            <span className="text-foreground font-medium">
                              {opt.optionValue}
                            </span>
                          </span>
                          <span className="text-[#422f7e] font-medium">
                            +${opt.extraPrice.toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {selectedFeatures.length > 0 && (
                        <>
                          <Separator className="my-2" />
                          {selectedFeatures.map((feat) => (
                            <div
                              key={feat.featureId}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {feat.name}
                              </span>
                              <span className="text-[#e20613] font-medium">
                                +${feat.extraCost.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </>
                      )}

                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Quantity
                          </span>
                          <span className="font-medium">× {quantity}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-semibold">Total</span>
                        <AnimatedPrice
                          price={totalPrice}
                          className="text-3xl font-bold text-[#422f7e]"
                        />
                      </div>

                      {!allOptionsSelected && (
                        <p className="text-xs text-amber-600 text-right">
                          Select all options for final price
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Base Price
                        </span>
                        <span className="text-[#422f7e] font-medium">
                          ${(design?.price || 0).toFixed(2)}
                        </span>
                      </div>

                      {selectedFeatures.map((feat) => (
                        <div
                          key={feat.featureId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {feat.name}
                          </span>
                          <span className="text-[#e20613] font-medium">
                            +${feat.extraCost.toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Quantity
                          </span>
                          <span className="font-medium">× {quantity}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-semibold">Total</span>
                        <AnimatedPrice
                          price={totalPrice}
                          className="text-3xl font-bold text-[#422f7e]"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Validation Warning */}
              {hasOptions && !allOptionsSelected && !isSpecialCategory && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        Complete your selection
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Missing:{" "}
                        <span className="font-semibold">
                          {missingSelections.join(", ")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Button */}
              <WhatsAppOrderDialog
                design={design}
                selectedFeatures={isSpecialCategory ? [] : selectedFeatures}
                selectedOptions={isSpecialCategory ? [] : selectedOptionsArray}
                quantity={quantity}
                totalPrice={totalPrice}
                disabled={!isSpecialCategory && hasOptions && !allOptionsSelected}
                isQuoteRequest={isSpecialCategory}
              />

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
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none"
            onKeyDown={handleKeyDown}
          >
            <DialogTitle className="sr-only">
              View {design.title} Images
            </DialogTitle>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}

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
                    alt={`${design.title} - Image ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
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
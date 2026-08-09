// components/whatsapp-contact-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  MapPin,
  Send,
  Sparkles,
  Package,
  Settings,
  DollarSign,
  ShoppingCart,
  Check,
  BookOpen,
  FileText,
  Building2,
  Globe,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Design,
  SelectedFeature,
  SelectedOption,
} from "@/lib/features/designs/designApi";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Branch contacts organized by region
const branchGroups = [
  {
    region: "Hargeisa",
    icon: Building2,
    description: "Main city branches",
    color: "purple",
    branches: [
      {
        name: "Hargeisa HQ",
        number: "+252638099909",
        department: "Main Headquarters",
        isHQ: true,
      },
      {
        name: "Tiyaatar Branch",
        number: "+252633333057",
        department: "Tiyaatar Area",
        isHQ: false,
      },
      {
        name: "Total Branch",
        number: "+252638099934",
        department: "Total Area",
        isHQ: false,
      },
    ],
  },
  {
    region: "Regional Branches",
    icon: Globe,
    description: "Other cities",
    color: "green",
    branches: [
      {
        name: "Berbera",
        number: "+252636999920",
        department: "Berbera Branch",
        isHQ: false,
      },
      {
        name: "Wajaale",
        number: "+252634627777",
        department: "Wajaale Branch",
        isHQ: false,
      },
      {
        name: "Gabiley",
        number: "+252637663333",
        department: "Gabiley Branch",
        isHQ: false,
      },
      {
        name: "Ceerigaabo",
        number: "+252638099960",
        department: "Ceerigaabo Branch",
        isHQ: false,
      },
      {
        name: "Borama",
        number: "+252638099948",
        department: "Borama Branch",
        isHQ: false,
      },
      {
        name: "Burco",
        number: "+252633333975",
        department: "Burco Branch",
        isHQ: false,
      },
    ],
  },
];

// Flatten branches for easy lookup
const allBranches = branchGroups.flatMap((group) =>
  group.branches.map((branch) => ({
    ...branch,
    region: group.region,
  }))
);

interface ContactOption {
  name: string;
  number: string;
  department?: string;
  isHQ?: boolean;
  region?: string;
}

interface WhatsAppOrderDialogProps {
  design: Design;
  selectedFeatures: SelectedFeature[];
  selectedOptions: SelectedOption[];
  quantity: number;
  totalPrice: number;
  disabled?: boolean;
  isQuoteRequest?: boolean;
}

export function WhatsAppOrderDialog({
  design,
  selectedFeatures = [],
  selectedOptions = [],
  quantity = 1,
  totalPrice = 0,
  disabled = false,
  isQuoteRequest = false,
}: WhatsAppOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<ContactOption | null>(
    null
  );
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Hargeisa");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    pageCount: "",
    bookSize: "",
    bindingType: "",
    paperType: "",
  });

  // Format phone number for display
  const formatPhoneDisplay = (phone: string) => {
    // +252638099909 → +252 63 8099909
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  // Get design URL
  const getDesignUrl = () => {
    if (!design?.slug) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/services/${design.slug}`;
  };

  // Get formatted date
  const getHumanDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate totals
  const basePrice = 0;

  const optionsTotal = selectedOptions.reduce(
    (sum, opt) => sum + (opt.extraPrice || 0),
    0
  );
  const featuresTotal = selectedFeatures.reduce(
    (sum, f) => sum + (f.extraCost || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;

    const orderId = isQuoteRequest
      ? `QUOTE-${Date.now().toString().slice(-8)}`
      : `ORD-${Date.now().toString().slice(-8)}`;
    const humanDate = getHumanDate();
    const designUrl = getDesignUrl();

    // Build message
    let message = `Hello! 👋\n\n`;

    if (isQuoteRequest) {
      message += `I'd like to request a quote from your ${selectedBranch.name}.\n\n`;

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📚 *BOOK/PUBLICATION QUOTE REQUEST*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*Product:* ${design.title}\n`;
      if (designUrl) message += `*Link:* ${designUrl}\n`;
      message += `*Category:* Books & Publications\n`;
      message += `\n`;

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📖 *BOOK SPECIFICATIONS*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*Quantity:* ${quantity} ${quantity === 1 ? "copy" : "copies"}\n`;
      if (formData.pageCount)
        message += `*Page Count:* ${formData.pageCount} pages\n`;
      if (formData.bookSize) message += `*Book Size:* ${formData.bookSize}\n`;
      if (formData.bindingType)
        message += `*Binding Type:* ${formData.bindingType}\n`;
      if (formData.paperType) message += `*Paper Type:* ${formData.paperType}\n`;
      message += `\n`;

      if (selectedFeatures.length > 0) {
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `✨ *ADDITIONAL REQUIREMENTS*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        selectedFeatures.forEach((feat) => {
          message += `✓ *${feat.name}:* ${feat.value}\n`;
        });
        message += `\n`;
      }

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *PRICING*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*Status:* Quote Required\n`;
      message += `_Price will be calculated based on specifications_\n\n`;
    } else {
      message += `I'm interested in ordering from your ${selectedBranch.name}.\n\n`;

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🎨 *DESIGN DETAILS*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*Product:* ${design.title}\n`;
      if (designUrl) message += `*Link:* ${designUrl}\n`;
      message += `\n`;

      if (selectedOptions.length > 0) {
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `⚙️ *SELECTED OPTIONS*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        selectedOptions.forEach((opt) => {
          message += `*${opt.typeName}:* ${opt.optionValue}`;
          if (opt.extraPrice > 0) {
            message += ` ($${opt.extraPrice.toFixed(2)})`;
          } else {
            message += ` (Included)`;
          }
          message += `\n`;
        });

        if (optionsTotal > 0) {
          message += `\n*Options Subtotal:* $${optionsTotal.toFixed(2)}\n`;
        }
        message += `\n`;
      }

      if (selectedFeatures.length > 0) {
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `✨ *ADDITIONAL FEATURES*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        selectedFeatures.forEach((feat) => {
          message += `✓ *${feat.name}:* ${feat.value}`;
          if (feat.extraCost > 0) {
            message += ` (+$${feat.extraCost.toFixed(2)})`;
          }
          message += `\n`;
        });

        if (featuresTotal > 0) {
          message += `\n*Features Subtotal:* +$${featuresTotal.toFixed(2)}\n`;
        }
        message += `\n`;
      }

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📦 *QUANTITY*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*Quantity:* ${quantity} ${quantity === 1 ? "piece" : "pieces"}\n\n`;

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💰 *PRICE BREAKDOWN*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      const unitPrice = basePrice + optionsTotal + featuresTotal;
      if (optionsTotal > 0) message += `Options: $${optionsTotal.toFixed(2)}\n`;
      if (featuresTotal > 0)
        message += `Features: +$${featuresTotal.toFixed(2)}\n`;
      message += `─────────────────\n`;
      message += `Unit Price: $${unitPrice.toFixed(2)}\n`;
      if (quantity > 1) message += `Quantity: × ${quantity}\n`;

      message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💵 *TOTAL: $${totalPrice.toFixed(2)}*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    message += `👤 *CUSTOMER INFO*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*Name:* ${formData.name}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    if (formData.email) message += `*Email:* ${formData.email}\n`;
    message += `\n`;

    if (formData.message) {
      message += `📝 *${isQuoteRequest ? "ADDITIONAL NOTES" : "NOTES"}*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `${formData.message}\n\n`;
    }

    message += `📋 *${isQuoteRequest ? "QUOTE REFERENCE" : "ORDER REFERENCE"}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*${isQuoteRequest ? "Quote ID" : "Order ID"}:* ${orderId}\n`;
    message += `*Date:* ${humanDate}\n`;
    message += `*Branch:* ${selectedBranch.name}${selectedBranch.region ? ` (${selectedBranch.region})` : ""}\n\n`;

    if (isQuoteRequest) {
      message += `Please provide me with a quote based on these specifications! 📋\n`;
    } else {
      message += `Looking forward to your response! 😊\n`;
    }
    message += `Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = selectedBranch.number.replace(/[^0-9]/g, "");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        pageCount: "",
        bookSize: "",
        bindingType: "",
        paperType: "",
      });
      setSelectedBranch(null);
      setOpen(false);
    }, 1000);
  };

  const toggleGroup = (region: string) => {
    setExpandedGroup(expandedGroup === region ? null : region);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={`w-full shadow-lg ${
            isQuoteRequest
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-[#25D366] hover:bg-[#25D366]/90 text-white"
          }`}
          disabled={disabled}
        >
          {isQuoteRequest ? (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Get Quote
            </>
          ) : (
            <>
              <MessageCircle className="mr-2 h-5 w-5" />
              {disabled ? "Select All Options First" : "Order via WhatsApp"}
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl overflow-y-scroll  max-h-[90vh] flex flex-col p-0">
        {!selectedBranch ? (
          // Branch Selection - Updated UI
          <div className="flex flex-col h-full">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#25D366]" />
                Select Your Branch
              </DialogTitle>
              <DialogDescription>
                {isQuoteRequest
                  ? "Choose your nearest branch to request a quote"
                  : "Choose your nearest branch to place your order"}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {branchGroups.map((group) => {
                  const Icon = group.icon;
                  const isExpanded = expandedGroup === group.region;

                  return (
                    <div
                      key={group.region}
                      className="border rounded-xl overflow-hidden"
                    >
                      {/* Group Header */}
                      <button
                        onClick={() => toggleGroup(group.region)}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${
                          group.color === "purple"
                            ? "bg-gradient-to-r from-[#422f7e]/10 to-[#422f7e]/5 hover:from-[#422f7e]/15 hover:to-[#422f7e]/10"
                            : "bg-gradient-to-r from-[#25D366]/10 to-[#25D366]/5 hover:from-[#25D366]/15 hover:to-[#25D366]/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              group.color === "purple"
                                ? "bg-[#422f7e] text-white"
                                : "bg-[#25D366] text-white"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-base">
                              {group.region}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {group.description} • {group.branches.length}{" "}
                              {group.branches.length === 1
                                ? "location"
                                : "locations"}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </motion.div>
                      </button>

                      {/* Branch List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 bg-muted/30 space-y-2">
                              {group.branches.map((branch) => (
                                <motion.button
                                  key={branch.number}
                                  onClick={() =>
                                    setSelectedBranch({
                                      ...branch,
                                      region: group.region,
                                    })
                                  }
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  className="w-full flex items-center justify-between p-3 rounded-lg border bg-background hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-full transition-colors ${
                                        branch.isHQ
                                          ? "bg-[#422f7e]/10 group-hover:bg-[#422f7e]"
                                          : "bg-muted group-hover:bg-[#25D366]"
                                      }`}
                                    >
                                      <MapPin
                                        className={`h-4 w-4 transition-colors ${
                                          branch.isHQ
                                            ? "text-[#422f7e] group-hover:text-white"
                                            : "text-muted-foreground group-hover:text-white"
                                        }`}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">
                                          {branch.name}
                                        </span>
                                        {branch.isHQ && (
                                          <Badge
                                            variant="secondary"
                                            className="text-[10px] px-1.5 py-0 bg-[#422f7e]/10 text-[#422f7e]"
                                          >
                                            HQ
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {formatPhoneDisplay(branch.number)}
                                      </div>
                                    </div>
                                  </div>
                                  <MessageCircle className="h-4 w-4 text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#422f7e]" />
                    <span>3 Hargeisa Locations</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#25D366]" />
                    <span>6 Regional Branches</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          // Order/Quote Form
          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                {isQuoteRequest ? (
                  <>
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Request a Quote
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 text-[#25D366]" />
                    Complete Your Order
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Sending to: {selectedBranch.name}
                {selectedBranch.region && (
                  <Badge variant="outline" className="text-xs ml-1">
                    {selectedBranch.region}
                  </Badge>
                )}
                <span className="text-muted-foreground">
                  ({formatPhoneDisplay(selectedBranch.number)})
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Summary */}
                <div
                  className={`p-5 rounded-lg border space-y-4 ${
                    isQuoteRequest
                      ? "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20"
                      : "bg-gradient-to-br from-[#422f7e]/5 to-[#25D366]/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isQuoteRequest ? (
                      <>
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h4 className="font-bold text-lg">Book Details</h4>
                      </>
                    ) : (
                      <>
                        <Package className="h-5 w-5 text-[#422f7e]" />
                        <h4 className="font-bold text-lg">Order Summary</h4>
                      </>
                    )}
                  </div>

                  {/* Product */}
                  <div className="bg-background/80 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      {design.images?.[0] && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                          <img
                            src={design.images[0]}
                            alt={design.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h5 className="font-bold">{design.title}</h5>
                        {isQuoteRequest && (
                          <Badge className="mt-2 bg-blue-600">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Book / Publication
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Book Specifications - Only for Quote Requests */}
                  {isQuoteRequest && (
                    <div className="bg-background/80 p-4 rounded-lg space-y-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm">
                          Book Specifications (Optional)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="pageCount" className="text-xs">
                            Page Count
                          </Label>
                          <Input
                            id="pageCount"
                            type="number"
                            placeholder="e.g., 200"
                            value={formData.pageCount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pageCount: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bookSize" className="text-xs">
                            Book Size
                          </Label>
                          <Input
                            id="bookSize"
                            placeholder="e.g., A5, 6x9 inch"
                            value={formData.bookSize}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bookSize: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bindingType" className="text-xs">
                            Binding Type
                          </Label>
                          <Input
                            id="bindingType"
                            placeholder="e.g., Perfect, Saddle"
                            value={formData.bindingType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bindingType: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paperType" className="text-xs">
                            Paper Type
                          </Label>
                          <Input
                            id="paperType"
                            placeholder="e.g., Matte, Glossy"
                            value={formData.paperType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paperType: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        * Fill in what you know. We'll discuss details with you.
                      </p>
                    </div>
                  )}

                  {/* Selected Options - Only for non-quote requests */}
                  {!isQuoteRequest && selectedOptions.length > 0 && (
                    <div className="bg-background/80 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-[#422f7e]" />
                          <span className="font-semibold text-sm">
                            Selected Options
                          </span>
                        </div>
                        <Badge variant="outline">
                          {selectedOptions.length} selected
                        </Badge>
                      </div>

                      <div className="space-y-2 pl-6">
                        {selectedOptions.map((opt) => (
                          <div
                            key={opt.optionId}
                            className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>
                                <span className="text-muted-foreground">
                                  {opt.typeName}:
                                </span>{" "}
                                {opt.optionValue}
                              </span>
                            </span>
                            {opt.extraPrice > 0 ? (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-[#422f7e]/10 text-[#422f7e]"
                              >
                                ${opt.extraPrice.toFixed(2)}
                              </Badge>
                            ) : (
                              <span className="text-xs text-green-600">
                                Included
                              </span>
                            )}
                          </div>
                        ))}

                        {optionsTotal > 0 && (
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-sm font-medium">
                              Options Subtotal:
                            </span>
                            <span className="font-bold text-[#422f7e]">
                              ${optionsTotal.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {selectedFeatures.length > 0 && (
                    <div className="bg-background/80 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#e20613]" />
                          <span className="font-semibold text-sm">
                            {isQuoteRequest
                              ? "Additional Requirements"
                              : "Additional Features"}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {selectedFeatures.length} selected
                        </Badge>
                      </div>

                      <div className="space-y-2 pl-6">
                        {selectedFeatures.map((feat) => (
                          <div
                            key={feat.featureId}
                            className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              {feat.name}: {feat.value}
                            </span>
                            {!isQuoteRequest && feat.extraCost > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-[#e20613]/10 text-[#e20613]"
                              >
                                +${feat.extraCost.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                        ))}

                        {!isQuoteRequest && featuresTotal > 0 && (
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-sm font-medium">
                              Features Subtotal:
                            </span>
                            <span className="font-bold text-[#e20613]">
                              +${featuresTotal.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Total / Quantity */}
                  <div
                    className={`p-4 rounded-lg space-y-3 ${
                      isQuoteRequest
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/20"
                        : "bg-gradient-to-r from-[#422f7e]/10 to-[#25D366]/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {isQuoteRequest ? "Estimated Quantity:" : "Quantity:"}
                      </span>
                      <Badge
                        className={`text-base px-4 ${
                          isQuoteRequest ? "bg-blue-600" : "bg-[#422f7e]"
                        } text-white`}
                      >
                        {quantity}{" "}
                        {quantity === 1
                          ? isQuoteRequest
                            ? "copy"
                            : "piece"
                          : isQuoteRequest
                            ? "copies"
                            : "pieces"}
                      </Badge>
                    </div>

                    <Separator />

                    {isQuoteRequest ? (
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Price:
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-blue-600">
                            Quote Required
                          </span>
                          <p className="text-xs text-muted-foreground">
                            Based on specifications
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-[#422f7e]" />
                          TOTAL:
                        </span>
                        <span className="text-3xl font-bold text-[#422f7e]">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                  <div className="font-semibold">Your Information</div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+252 XX XXX XXXX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {isQuoteRequest
                        ? "Additional Details (Optional)"
                        : "Special Notes (Optional)"}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={
                        isQuoteRequest
                          ? "Describe your book project, any specific requirements..."
                          : "Any special requirements..."
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 bg-background flex-shrink-0">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBranch(null)}
                  className="flex-1"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Change Branch
                </Button>
                <Button
                  onClick={handleSubmit}
                  className={`flex-1 text-white ${
                    isQuoteRequest
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-[#25D366] hover:bg-[#25D366]/90"
                  }`}
                  disabled={!formData.name || !formData.phone}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isQuoteRequest ? "Request Quote" : "Send to WhatsApp"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
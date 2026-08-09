
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
  Package,
  Building2,
  Globe,
  ChevronRight,
  Layers,
  Ruler,
  Image as ImageIcon,
  FileQuestion,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderDesign, PostType } from "@/lib/orderDesign";

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

interface ContactOption {
  name: string;
  number: string;
  department?: string;
  isHQ?: boolean;
  region?: string;
}

interface WhatsAppOrderDesignDialogProps {
  design: OrderDesign;
  disabled?: boolean;
}

// Helper to format post type
function formatPostType(type: PostType): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Post type colors for badges
const postTypeColors: Record<string, string> = {
  FACEBOOK_POST: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  INSTAGRAM_POST: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  INSTAGRAM_STORY: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  TIKTOK: "bg-gray-800 text-white",
  YOUTUBE_THUMBNAIL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  TWITTER: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  LINKEDIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

export function WhatsAppOrderDesignDialog({
  design,
  disabled = false,
}: WhatsAppOrderDesignDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<ContactOption | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Hargeisa");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Format phone number for display
  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  // Get design URL
  const getDesignUrl = () => {
    if (!design?.id) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/order-designs/${design.id}`;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;

    const quoteId = `QTE-${Date.now().toString().slice(-8)}`;
    const humanDate = getHumanDate();
    const designUrl = getDesignUrl();

    // Build message
    let message = `Hello! 👋\n\n`;
    message += `I'd like to request a quote from your ${selectedBranch.name}.\n\n`;

    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🎨 *QUOTE REQUEST*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `*Design:* ${design.title}\n`;
    if (designUrl) message += `*Link:* ${designUrl}\n`;
    message += `*Type:* ${formatPostType(design.postType)}\n`;
    if (design.size) message += `*Size:* ${design.size}\n`;
    if (design.images?.length) message += `*Images:* ${design.images.length} image(s)\n`;
    message += `\n`;

    if (design.description) {
      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📝 *DESCRIPTION*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `${design.description}\n\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 *CUSTOMER INFO*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*Name:* ${formData.name}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    if (formData.email) message += `*Email:* ${formData.email}\n`;
    message += `\n`;

    if (formData.message) {
      message += `📝 *SPECIAL NOTES*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `${formData.message}\n\n`;
    }

    message += `📋 *QUOTE REFERENCE*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*Quote ID:* ${quoteId}\n`;
    message += `*Date:* ${humanDate}\n`;
    message += `*Branch:* ${selectedBranch.name}${selectedBranch.region ? ` (${selectedBranch.region})` : ""}\n\n`;

    message += `Please provide me with a quote for this design. 💬\n`;
    message += `Looking forward to your response! 😊\n`;
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
          className="w-full shadow-lg bg-[#25D366] hover:bg-[#25D366]/90 text-white"
          disabled={disabled}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Request Quote via WhatsApp
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl overflow-y-scroll max-h-[90vh] flex flex-col p-0">
        {!selectedBranch ? (
          // Branch Selection
          <div className="flex flex-col h-full">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#25D366]" />
                Select Your Branch
              </DialogTitle>
              <DialogDescription>
                Choose your nearest branch to request a quote
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
          // Quote Request Form
          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-[#25D366]" />
                Request a Quote
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
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
                {/* Design Summary */}
                <div className="p-5 rounded-lg border space-y-4 bg-gradient-to-br from-[#422f7e]/5 to-[#25D366]/5">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#422f7e]" />
                    <h4 className="font-bold text-lg">Design Details</h4>
                  </div>

                  {/* Design Card */}
                  <div className="bg-background/80 p-4 rounded-lg">
                    <div className="flex items-start gap-4">
                      {design.images?.[0] ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0">
                          <img
                            src={design.images[0]}
                            alt={design.title}
                            className="w-full h-full object-cover"
                          />
                          {design.images.length > 1 && (
                            <Badge
                              variant="secondary"
                              className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0"
                            >
                              <Layers className="w-3 h-3 mr-0.5" />
                              {design.images.length}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-lg truncate">{design.title}</h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            className={`${postTypeColors[design.postType] || postTypeColors.OTHER} border-0`}
                          >
                            {formatPostType(design.postType)}
                          </Badge>
                          {design.size && (
                            <Badge variant="outline" className="gap-1">
                              <Ruler className="w-3 h-3" />
                              {design.size}
                            </Badge>
                          )}
                        </div>
                        {design.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {design.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quote Notice */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                      <FileQuestion className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Our team will provide you with a detailed quote including pricing and delivery options.
                      </span>
                    </p>
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
                    <Label htmlFor="message">Special Notes (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Any special requirements, customizations, or questions about the design..."
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
                  className="flex-1 text-white bg-[#25D366] hover:bg-[#25D366]/90"
                  disabled={!formData.name || !formData.phone}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Request Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
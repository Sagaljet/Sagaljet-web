// components/whatsapp-floating-button.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  MapPin,
  ChevronUp,
  Building2,
  Globe,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Branch contacts organized by region
const branchGroups = [
  {
    region: "Hargeisa",
    icon: Building2,
    color: "primary",
    branches: [
      {
        name: "Hargeisa HQ",
        number: "+252638099909",
        isHQ: true,
      },
      {
        name: "Tiyaatar Branch",
        number: "+252633333057",
        isHQ: false,
      },
      {
        name: "Total Branch",
        number: "+252638099934",
        isHQ: false,
      },
    ],
  },
  {
    region: "Regional",
    icon: Globe,
    color: "secondary",
    branches: [
      {
        name: "Berbera",
        number: "+252636999920",
        isHQ: false,
      },
      {
        name: "Wajaale",
        number: "+252634627777",
        isHQ: false,
      },
      {
        name: "Gabiley",
        number: "+252637663333",
        isHQ: false,
      },
      {
        name: "Ceerigaabo",
        number: "+252638099960",
        isHQ: false,
      },
      {
        name: "Borama",
        number: "+252638099948",
        isHQ: false,
      },
      {
        name: "Burco",
        number: "+252633333975",
        isHQ: false,
      },
    ],
  },
];

interface WhatsAppFloatingButtonProps {
  defaultMessage?: string;
  showAfterScroll?: number;
  position?: "left" | "right";
}

export function WhatsAppFloatingButton({
  defaultMessage = "Hello! I'm interested in your services. Can you help me?",
  showAfterScroll = 0,
  position = "right",
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(showAfterScroll === 0);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(
    "Hargeisa"
  );

  // Handle scroll visibility
  useEffect(() => {
    if (showAfterScroll === 0) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".whatsapp-floating-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  const openWhatsApp = (phoneNumber: string) => {
    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(defaultMessage);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${cleanedNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanedNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  const positionClasses =
    position === "right" ? "right-4 sm:right-6" : "left-4 sm:left-6";

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className={`whatsapp-floating-container fixed bottom-4 sm:bottom-6 ${positionClasses} z-50`}
        >
          {/* Branch Selection Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`absolute bottom-16 ${position === "right" ? "right-0" : "left-0"} w-72 sm:w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border overflow-hidden`}
              >
                {/* Header */}
                <div
                  className="p-4 text-white"
                  style={{
                    background: "linear-gradient(135deg, #EB252E 0%, #ED8486 100%)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Chat with Us</h3>
                        <p className="text-xs text-white/80">
                          Select your nearest branch
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Branch List */}
                <div className="max-h-80 overflow-y-auto">
                  {branchGroups.map((group) => {
                    const Icon = group.icon;
                    const isExpanded = expandedRegion === group.region;
                    const isPrimary = group.color === "primary";

                    return (
                      <div key={group.region}>
                        {/* Region Header */}
                        <button
                          onClick={() =>
                            setExpandedRegion(isExpanded ? null : group.region)
                          }
                          className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                          style={{
                            backgroundColor: isPrimary
                              ? "rgba(237, 132, 134, 0.1)"
                              : "rgba(235, 37, 46, 0.05)",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className="w-4 h-4"
                              style={{
                                color: isPrimary ? "#EB252E" : "#ED8486",
                              }}
                            />
                            <span className="font-semibold text-sm">
                              {group.region}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: isPrimary
                                  ? "rgba(235, 37, 46, 0.1)"
                                  : "rgba(237, 132, 134, 0.2)",
                                color: "#EB252E",
                              }}
                            >
                              {group.branches.length}
                            </Badge>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </button>

                        {/* Branches */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {group.branches.map((branch) => (
                                <button
                                  key={branch.number}
                                  onClick={() => openWhatsApp(branch.number)}
                                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                      style={{
                                        backgroundColor: "rgba(237, 132, 134, 0.15)",
                                      }}
                                    >
                                      <MapPin
                                        className="w-4 h-4 transition-colors group-hover:scale-110"
                                        style={{ color: "#EB252E" }}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-sm group-hover:text-[#EB252E] transition-colors">
                                          {branch.name}
                                        </span>
                                        {branch.isHQ && (
                                          <Badge
                                            className="text-[10px] px-1.5 py-0 text-white"
                                            style={{
                                              backgroundColor: "#EB252E",
                                            }}
                                          >
                                            HQ
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {formatPhoneDisplay(branch.number)}
                                      </span>
                                    </div>
                                  </div>
                                  <Phone
                                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110"
                                    style={{ color: "#EB252E" }}
                                  />
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div
                  className="px-4 py-3 border-t"
                  style={{
                    backgroundColor: "rgba(237, 132, 134, 0.05)",
                  }}
                >
                  {/* <p className="text-xs text-center text-muted-foreground">
                    📞 Available Mon-Sat, 8AM-6PM
                  </p> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Floating Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: isOpen
                ? "#ED8486"
                : "linear-gradient(135deg, #EB252E 0%, #ED8486 100%)",
              boxShadow: "0 4px 20px rgba(235, 37, 46, 0.4)",
            }}
          >
            {/* Pulse Animation */}
            <span
              className="absolute w-full h-full rounded-full animate-ping opacity-30"
              style={{ backgroundColor: "#EB252E" }}
            />

            {/* Ripple Effect */}
            <span
              className="absolute w-full h-full rounded-full animate-pulse"
              style={{
                backgroundColor: "rgba(237, 132, 134, 0.3)",
                transform: "scale(1.2)",
              }}
            />

            {/* Icon */}
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="message"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification Badge */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
              style={{ color: "#EB252E" }}
            >
              <span className="text-[10px] font-bold">1</span>
            </motion.span>
          </motion.button>

          {/* Tooltip */}
        
        </div>
      )}
    </AnimatePresence>
  );
}
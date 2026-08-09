// components/whatsapp-floating-button-simple.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface WhatsAppFloatingButtonSimpleProps {
  phoneNumber?: string;
  message?: string;
  showAfterScroll?: number;
  position?: "left" | "right";
}

export function WhatsAppFloatingButtonSimple({
  phoneNumber = "+252638099909",
  message = "Hello! I'm interested in your services.",
  showAfterScroll = 0,
  position = "right",
}: WhatsAppFloatingButtonSimpleProps) {
  const [isVisible, setIsVisible] = useState(showAfterScroll === 0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (showAfterScroll === 0) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  const openWhatsApp = () => {
    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${cleanedNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanedNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const positionClasses =
    position === "right" ? "right-4 sm:right-6" : "left-4 sm:left-6";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50`}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className={`absolute bottom-full mb-3 ${position === "right" ? "right-0" : "left-0"} whitespace-nowrap`}
              >
                <div
                  className="text-white text-sm px-4 py-2.5 rounded-xl shadow-lg font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, #EB252E 0%, #ED8486 100%)",
                  }}
                >
                  Chat with us on WhatsApp 💬
                  <div
                    className={`absolute top-full ${position === "right" ? "right-6" : "left-6"} w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent`}
                    style={{ borderTopColor: "#ED8486" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openWhatsApp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: "linear-gradient(135deg, #EB252E 0%, #ED8486 100%)",
              boxShadow: "0 4px 25px rgba(235, 37, 46, 0.4)",
              //@ts-ignore
              focusRingColor: "#ED8486",
            }}
          >
            {/* Animated Rings */}
            <span
              className="absolute w-full h-full rounded-full animate-ping"
              style={{
                backgroundColor: "#EB252E",
                opacity: 0.25,
              }}
            />
            <span
              className="absolute w-full h-full rounded-full animate-pulse"
              style={{
                backgroundColor: "#ED8486",
                opacity: 0.2,
                transform: "scale(1.15)",
              }}
            />

            {/* WhatsApp Icon */}
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />

            {/* Online Indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

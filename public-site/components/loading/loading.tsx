"use client";

import Image from "next/image";

interface PageLoadingProps {
  logo?: boolean;
  text?: string;
}

export function PageLoading({
  logo = true,
  text = "Loading...",
}: PageLoadingProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with Animation */}
        {logo && (
          <div className="relative animate-pulse">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={120}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Custom Animated Loader */}
        <div className="relative">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full bg-[#132440]"
                style={{
                  animation: "loadingDot 1.4s infinite ease-in-out both",
                  animationDelay: `${index * 0.16}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          {text}
        </p>
      </div>

      <style jsx>{`
        @keyframes loadingDot {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

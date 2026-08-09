"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function HeroSection() {
  const sagaljetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (sagaljetRef.current) {
      gsap.fromTo(
        sagaljetRef.current,
        {
          scale: 0.8,
          opacity: 0,
          rotation: -5,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        }
      );

      gsap.to(sagaljetRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8 px-4 sm:px-6 md:px-8 lg:px-0">
      {/* Badge */}
      <Badge
        variant="outline"
        className="w-fit gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5"
      >
        <span className="text-xs sm:text-sm">🏆</span>
        <span className="text-xs sm:text-sm font-medium">
          Number 1 in the industry
        </span>
      </Badge>

      {/* Heading */}
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance">
          Premium Printing & Design Solutions for Your Business{" "}
          <span
            ref={sagaljetRef}
            className="inline-block mt-2 sm:mt-0 sm:ml-2 md:ml-3 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 border border-dashed border-[#e20613] rounded-md text-[#312782] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            SagalJet
          </span>
        </h1>
      </div>

      {/* Description */}
      <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-xl text-muted-foreground">
        SagalJet empowers businesses with premium printing services, stunning
        designs, and exceptional quality. Let's bring your vision to life with
        professional printing solutions.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-stretch sm:items-center justify-center md:justify-start">
        {/* Primary Button */}
        <Link href={"/services"} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="group relative w-full sm:w-40 md:w-44 lg:w-48 h-12 sm:h-13 md:h-14 text-base sm:text-lg font-semibold rounded-2xl 
    bg-gradient-to-r from-[#e20613] to-[#ff4b5c] text-white
    shadow-lg shadow-[#e20613]/30
    hover:scale-105 hover:shadow-[#ff4b5c]/40
    transition-all duration-300 ease-in-out overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Buy Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Button>
        </Link>

        {/* Secondary Button */}
        <Link href="/contact" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="group relative w-full sm:w-40 md:w-44 lg:w-48 h-12 sm:h-13 md:h-14 text-base sm:text-lg font-semibold rounded-2xl
      border-2 border-[#e20613]
      text-[#e20613] bg-transparent
      hover:bg-gradient-to-r hover:from-[#e20613] hover:to-[#ff4b5c]
      hover:text-white hover:shadow-lg hover:shadow-[#ff4b5c]/30
      transition-all duration-300 ease-in-out"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Contact Us
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

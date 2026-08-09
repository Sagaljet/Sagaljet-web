"use client";

import FeaturedDesigns from "@/components/FeaturedDesigns";
import Navbar from "@/components/header";
import HeroSection from "@/components/hero-section";
import LogosPage from "@/components/home/client";
import { CTASection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/features-section";
import Statistics from "@/components/home/Statistics";
import { PageLoading } from "@/components/loading/loading";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div>
          {" "}
          <PageLoading />{" "}
        </div>
      }
    >
      <div className="flex flex-col">
        <Navbar />
        {/* Hero Section with Modern Hero */}
        <HeroSection />
        <FeaturedDesigns />
        {/* clients */}
        <LogosPage />
        {/* Statistics section */}
        <Statistics />
        {/* Features Section */}
        {/* <FeaturesSection /> */}

        {/* CTA Section */}
        <CTASection />
      </div>
    </Suspense>
  );
}

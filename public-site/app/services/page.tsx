// app/services/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import ServicesWrapper from "./services-wrapper";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Products & Printing Services | Sagaljet",
  description:
    "Browse our professional design and printing services. From business cards to banners, books to brochures - quality printing solutions for all your needs.",
  keywords: [
    "printing services",
    "design services",
    "business cards",
    "banners",
    "brochures",
    "book printing",
    "Sagaljet",
    "professional printing",
  ],
  openGraph: {
    title: "Design & Printing Services | Sagaljet",
    description:
      "Browse our professional design and printing services. Quality printing solutions for all your needs.",
    type: "website",
    siteName: "Sagaljet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design & Printing Services | Sagaljet",
    description:
      "Browse our professional design and printing services. Quality printing solutions for all your needs.",
  },
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-screen">
          <Spinner className="animate-spin flex items-center w-20 justify-center" />
        </div>
      }
    >
      <ServicesWrapper />
    </Suspense>
  );
}
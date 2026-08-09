// app/services/[slug]/design-detail-wrapper.tsx
"use client";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetDesignBySlugQuery } from "@/lib/features/designs/designApi";
import Navbar from "@/components/header";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import DesignDetailClient from "./design-detail-client";

interface DesignDetailWrapperProps {
  slug: string;
}

export default function DesignDetailWrapper({
  slug,
}: DesignDetailWrapperProps) {
  const { data: design, isLoading, isError } = useGetDesignBySlugQuery(slug, {
    skip: !slug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#422f7e]" />
        </div>
      </>
    );
  }

  if (isError || !design) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Design Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The design you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Designs
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return <DesignDetailClient design={design} />;
}
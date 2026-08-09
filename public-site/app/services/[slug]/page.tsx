// app/services/[slug]/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/header";
import { Design, getDesignBySlug } from "@/lib/api/product";
import DesignDetailWrapper from "./design-detail-wrapper";

interface DesignDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata based on the design
export async function generateMetadata({
  params,
}: DesignDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const designs = await getDesignBySlug(decodedSlug);
  console.log(designs)
  //@ts-ignore
  const design = designs?.result
  if (!design) {
    return {
      title: "Design Not Found | Sagaljet",
      description: "The requested design could not be found.",
    };
  }

  // Strip HTML tags from description for meta
  const plainDescription = design.description
    ? design.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `${design.title} - Professional printing and design service by Sagaljet`;

  const designImage = design.images?.[0] || "/og-default.jpg";
  const categoryName = design.categoryDesign?.name || "Design";

  // Determine if it's a special category
  const isBookCategory = categoryName === "Books and Publications";
  const isServiceCategory = categoryName === "Services";
  const isSpecialCategory = isBookCategory || isServiceCategory;

  // Price display for structured data
  const priceInfo = isSpecialCategory
    ? undefined
    : {
        price: design.price,
        priceCurrency: "USD",
      };

  return {
    title: `${design.title} | ${categoryName} | Sagaljet`,
    description: plainDescription,
    keywords: [
      design.title,
      categoryName,
      "printing",
      "design",
      "Sagaljet",
      design.isPrintable ? "printable" : "",
      isBookCategory ? "book printing" : "",
      isServiceCategory ? "design service" : "",
    ].filter(Boolean) as string[],
    authors: [{ name: "Sagaljet" }],
    openGraph: {
      title: `${design.title} | Sagaljet`,
      description: plainDescription,
      type: "website",
      siteName: "Sagaljet",
      images: [
        {
          url: designImage,
          width: 1200,
          height: 630,
          alt: design.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${design.title} | Sagaljet`,
      description: plainDescription,
      images: [designImage],
    },
    alternates: {
      canonical: `/services/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: priceInfo
      ? {
          "product:price:amount": String(priceInfo.price),
          "product:price:currency": priceInfo.priceCurrency,
        }
      : undefined,
  };
}

function LoadingSkeleton() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#422f7e]" />
      </div>
    </>
  );
}

export default async function DesignDetailPage({
  params,
}: DesignDetailPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DesignDetailWrapper slug={decodedSlug} />
    </Suspense>
  );
}
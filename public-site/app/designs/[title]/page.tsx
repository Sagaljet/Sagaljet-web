import { Metadata } from "next";
import { Suspense } from "react";
import OrderDesignDetailPage from "@/components/order-design/order-design-detail";
import { OrderDesignDetailSkeleton } from "@/components/order-design/order-design-skeleton";
import { Url } from "@/lib/url";

// Type for params
type Props = {
  params: { title: string };
};

// Server-side fetch function for metadata
async function getDesignByTitle(title: string) {
  try {
    const baseUrl = Url;
    
    // Skip if no backend URL configured
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_BACKEND_URL not configured");
      return null;
    }

    const response = await fetch(
      `${baseUrl}/designs/${encodeURIComponent(title)}`,
      {
        next: { revalidate: 60 },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Check if response is ok
    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      return null;
    }

    // Check content type before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("API did not return JSON:", contentType);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching design for metadata:", error);
    return null;
  }
}

// Helper to format title
function formatTitleFromSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Dynamic Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const titleSlug = params.title;
  const formattedTitle = formatTitleFromSlug(titleSlug);
  
  // Try to fetch design data
  const design = await getDesignByTitle(titleSlug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sagaljet.com";

  // If design found, use its data
  if (design) {
    const pageTitle = `Sagaljet | ${design.title}`;
    const pageDescription =
      design.description ||
      `Explore "${design.title}" - Professional ${design.postType?.replace(/_/g, " ").toLowerCase()} design by Sagaljet.`;
    const ogImage = design.images?.[0] || `${siteUrl}/og-default.jpg`;

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: [
        "Sagaljet",
        design.title,
        design.postType?.replace(/_/g, " "),
        "custom design",
        "graphic design",
        "printing services",
      ].filter(Boolean),
      authors: [{ name: "Sagaljet" }],
      creator: "Sagaljet",
      publisher: "Sagaljet",
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `${siteUrl}/designs/${titleSlug}`,
        siteName: "Sagaljet",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${design.title} - Sagaljet Design`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [ogImage],
        creator: "@sagaljet",
        site: "@sagaljet",
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${siteUrl}/designs/${titleSlug}`,
      },
    };
  }

  // Fallback metadata when API fails or design not found
  return {
    title: `Sagaljet | ${formattedTitle}`,
    description: `Explore "${formattedTitle}" - Professional design by Sagaljet. Request a custom quote today!`,
    keywords: ["Sagaljet", formattedTitle, "custom design", "graphic design"],
    authors: [{ name: "Sagaljet" }],
    creator: "Sagaljet",
    publisher: "Sagaljet",
    openGraph: {
      title: `Sagaljet | ${formattedTitle}`,
      description: `Explore "${formattedTitle}" - Professional design by Sagaljet.`,
      url: `${siteUrl}/designs/${titleSlug}`,
      siteName: "Sagaljet",
      images: [
        {
          url: `${siteUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${formattedTitle} - Sagaljet Design`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Sagaljet | ${formattedTitle}`,
      description: `Explore "${formattedTitle}" - Professional design by Sagaljet.`,
      creator: "@sagaljet",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Page Component
export default function DesignDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<OrderDesignDetailSkeleton />}>
      <OrderDesignDetailPage />
    </Suspense>
  );
}
// app/events/[slug]/page.tsx

import EventDetailContent from "@/components/event-detail-content";
import { SchemaOrg } from "@/components/schema-org";
import { fetchAllEvents, fetchEventBySlug } from "@/lib/events-service";
import { breadcrumbSchema } from "@/lib/schema-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to get first image from array or string
function getFirstImage(imageUrl: string | string[] | null): string {
  if (!imageUrl) return "/events-header.jpg";
  if (Array.isArray(imageUrl)) return imageUrl[0] || "/events-header.jpg";
  return imageUrl;
}

export async function generateStaticParams() {
  try {
    const events = await fetchAllEvents();
    return events.map((event) => ({
      slug: event.slug || event.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | SagalJet",
      description: "The requested event could not be found.",
    };
  }

  const primaryImage = getFirstImage(event.imageUrl);
  const description = event.description
    ? event.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : "Join us at this exciting event";

  return {
    title: `${event.title} | SagalJet Events`,
    description,
    keywords: [event.title, event.client, "event", "SagalJet"].filter(Boolean),
    openGraph: {
      title: event.title,
      description,
      type: "article",
      images: Array.isArray(event.imageUrl)
        ? event.imageUrl.map((img) => ({
            url: img,
            width: 1200,
            height: 630,
            alt: event.title,
          }))
        : [
            {
              url: primaryImage,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://sagaljet.net" },
    { name: "Events", url: "https://sagaljet.net/events" },
    { name: event.title, url: `https://sagaljet.net/events/${slug}` },
  ]);

  return (
    <>
      <SchemaOrg schema={breadcrumbs} />
      <EventDetailContent eventSlug={slug} initialEvent={event} />
    </>
  );
}
import { branches } from "./contact-data"

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SagalJet",
  url: "https://sagaljet.net",
  logo: "https://sagaljet.net/logo.png",
  description:
    "Leading printing company in Somaliland offering high-quality printing solutions across Hargeisa, Burao, Berbera, and more.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Print Street",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10001",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-123-4567",
    contactType: "customer service",
    email: "main@sagaljet.com",
    availableLanguage: ["en"],
  },
  sameAs: ["https://facebook.com/sagaljet", "https://twitter.com/sagaljet", "https://linkedin.com/company/sagaljet"],
}

export const localBusinessSchema = branches.map((branch) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: branch.name,
  image: "https://sagaljet.net/logo.png",
  "@id": `https://sagaljet.net/contact#${branch.id}`,
  url: "https://sagaljet.net/contact",
  telephone: branch.phone,
  email: branch.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: branch.address,
    addressLocality: branch.city.split(",")[0],
    addressRegion: branch.city.split(",")[1]?.trim() || "NY",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: branch.coordinates.lat,
    longitude: branch.coordinates.lng,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
}))

export function createBlogPostSchema(post: {
  title: string
  excerpt: string
  date: string
  author: string
  slug: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image || "https://sagaljet.net/blog-header.jpg",
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "SagalJet",
      logo: {
        "@type": "ImageObject",
        url: "https://sagaljet.net/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sagaljet.net/blog/${post.slug}`,
    },
  }
}

export function createEventSchema(event: {
  title: string
  description: string
  date: string
  location: string
  slug?: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.image || "https://sagaljet.net/events-header.jpg",
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "New York",
        addressRegion: "NY",
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "SagalJet",
      url: "https://sagaljet.net",
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  }
}

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

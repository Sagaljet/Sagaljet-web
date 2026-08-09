import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us ",
  description:
    "Learn about SagalJet's 15+ years of excellence in printing services. Discover our mission, values, and journey as the leading printing company in Somaliland.",
  openGraph: {
    title: "About Us | SagalJet",
    description: "Learn about SagalJet's 15+ years of excellence in printing services across Somaliland.",
    type: "website",
    images: [
      {
        url: "/modern-printing-press-facility.jpg",
        width: 1200,
        height: 630,
        alt: "SagalJet Printing Facility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | SagalJet",
    description: "Learn about SagalJet's 15+ years of excellence in printing services.",
    images: ["/modern-printing-press-facility.jpg"],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// app/blog/layout.tsx
import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Stay updated with the latest trends, tips, and news from the printing industry. Expert insights on printing technology, design, and best practices.",
  openGraph: {
    title: "Blog & Insights",
    description: "Stay updated with the latest trends, tips, and news from the printing industry.",
    type: "website",
    images: [
      {
        url: "/blog-header.jpg",
        width: 1200,
        height: 630,
        alt: "Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Insights",
    description: "Stay updated with the latest trends, tips, and news from the printing industry.",
    images: ["/blog-header.jpg"],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
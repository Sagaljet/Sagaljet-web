// app/blog/page.tsx
import BlogPageClient from "@/components/blog-page";
import Navbar from "@/components/header";
import HeroBanner from "@/components/hero/HeroBanner";
import PageHeader from "@/components/page-header";
import { Suspense } from "react";

export default function Blog() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col">
        <Navbar />
        <HeroBanner
          type="blogs"
          heightClass="h-[350px] md:h-[450px]"
          ctaText="View Blog"
          defaultLink="/blogs"
          autoPlayInterval={6000}
        />
        <BlogPageClient />
      </div>
    </Suspense>
  );
}

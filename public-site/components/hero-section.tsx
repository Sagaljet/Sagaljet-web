// app/projects/page.tsx (or pages/projects.tsx)
import HeroBanner from "@/components/hero/HeroBanner";

export default function ProjectsPage() {
  return (
    <main>
      {/* Projects Hero Banner */}
      <HeroBanner
        type="banner"
        heightClass="h-[350px] md:h-[450px]"
        ctaText="Order Now"
        defaultLink="/services"
        autoPlayInterval={6000}
      />
    </main>
  );
}

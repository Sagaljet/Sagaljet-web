import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { BranchLocations } from "@/components/branch-locations";
import { ContactMap } from "@/components/contact-map";
import { SchemaOrg } from "@/components/schema-org";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/schema-data";
import Navbar from "@/components/header";
import { Suspense } from "react";
import HeroBanner from "@/components/hero/HeroBanner";

export const metadata: Metadata = {
  title: "Contact Us | SagalJet",
  description:
    "Get in touch with SagalJet. Visit our locations in Hargeisa, Burao, Berbera, Las'anod, Cerigabo, Wajale, and Djabouti or send us a message.",
  openGraph: {
    title: "Contact Us | SagalJet",
    description:
      "Get in touch with SagalJet. Visit our locations across Somaliland and Djibouti or send us a message.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | SagalJet",
    description:
      "Get in touch with SagalJet. Visit our locations or send us a message.",
  },
};

export default function ContactPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://sagaljet.net" },
    { name: "Contact", url: "https://sagaljet.net/contact" },
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {localBusinessSchema.map((schema, index) => (
        <SchemaOrg key={index} schema={schema} />
      ))}
      <SchemaOrg schema={breadcrumbs} />
      <Navbar />
      <div className="min-h-screen bg-background">
        <HeroBanner
          type="contact"
          heightClass="h-[350px] md:h-[450px]"
          ctaText="View Contact"
          defaultLink="/contact"
          autoPlayInterval={6000}
        />

        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="space-y-12">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ContactForm />
              </div>

              <div>
                <BranchLocations />
              </div>
            </div>

            <div>
              <ContactMap />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

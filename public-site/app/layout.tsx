import { Footer } from "@/components/footer";
import Navbar from "@/components/header";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { SchemaOrg } from "@/components/schema-org";
import { ThemeProvider } from "@/components/theme-provider";
import { organizationSchema } from "@/lib/schema-data";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sagaljet.net"),
  title: {
    default: "SagalJet - Professional Printing Services",
    template: "%s | SagalJet",
  },
  description:
    "Leading printing company in Somaliland offering high-quality printing solutions across Hargeisa, Burao, Berbera, and more. Expert printing services for businesses and individuals.",
  keywords: [
    "printing",
    "SagalJet",
    "Somaliland",
    "Hargeisa",
    "commercial printing",
    "digital printing",
    "offset printing",
    "large format printing",
    "business cards",
    "brochures",
    "banners",
  ],
  authors: [{ name: "SagalJet" }],
  creator: "SagalJet",
  publisher: "SagalJet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SagalJet - Professional Printing Services",
    description:
      "Leading printing company in Somaliland offering high-quality printing solutions across multiple locations.",
    url: "https://sagaljet.net",
    siteName: "SagalJet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SagalJet Professional Printing Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SagalJet - Professional Printing Services",
    description:
      "Leading printing company in Somaliland offering high-quality printing solutions.",
    images: ["/og-image.jpg"],
    creator: "@sagaljet",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  generator: "hornsolution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <SchemaOrg schema={organizationSchema} />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen">
            <ReduxProvider>{children}</ReduxProvider>
            <WhatsAppFloatingButton
              defaultMessage=""
              showAfterScroll={200}
              position="right"
            />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

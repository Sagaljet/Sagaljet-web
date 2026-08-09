import type React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Events | SagalJet",
  description:
    "Join us at upcoming printing industry events, workshops, and open houses. Connect with experts and explore the latest in printing technology.",
  openGraph: {
    title: "Events | SagalJet",
    description:
      "Join us at upcoming printing industry events, workshops, and open houses.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Events | SagalJet",
    description:
      "Join us at upcoming printing industry events, workshops, and open houses.",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      {children}
    </Suspense>
  );
}

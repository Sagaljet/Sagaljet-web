import Navbar from "@/components/header";
import AboutClientPage from "./about-client";
import { Suspense } from "react";

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <AboutClientPage />
    </Suspense>
  );
}
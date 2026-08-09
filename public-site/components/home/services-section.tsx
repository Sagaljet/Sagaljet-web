"use client"

import { useEffect, useRef } from "react"
import { Printer, Package, Zap, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ServicesSection() {
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (servicesRef.current) {
        gsap.from(".service-card", {
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 75%",
          },
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 0.7,
          ease: "power2.out",
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={servicesRef} className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Professional printing solutions tailored to your business needs with exceptional quality and fast turnaround
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="service-card border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ backgroundColor: "oklch(var(--primary))" }}
              >
                <Printer className="w-6 h-6" style={{ color: "oklch(var(--primary-foreground))" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Printing</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                High-quality custom prints for business cards, brochures, and marketing materials
              </p>
            </CardContent>
          </Card>

          <Card className="service-card border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ backgroundColor: "oklch(var(--accent-color))" }}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Turnaround</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Express printing services with same-day and next-day delivery options available
              </p>
            </CardContent>
          </Card>

          <Card className="service-card border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ backgroundColor: "oklch(var(--primary))" }}
              >
                <Package className="w-6 h-6" style={{ color: "oklch(var(--primary-foreground))" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Large Format</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Banners, posters, and signage in any size with vibrant colors and sharp details
              </p>
            </CardContent>
          </Card>

          <Card className="service-card border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ backgroundColor: "oklch(var(--accent-color))" }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Premium materials and rigorous quality control ensure perfect results every time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="rounded-full bg-transparent">
            Explore All Services
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

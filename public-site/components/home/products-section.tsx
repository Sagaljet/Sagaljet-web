"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ProductsSection() {
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (productsRef.current) {
        gsap.from(".product-card", {
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 75%",
          },
          opacity: 0,
          scale: 0.95,
          stagger: 0.2,
          duration: 0.7,
          ease: "back.out(1.2)",
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={productsRef} className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Discover Our Print Solutions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            From corporate materials to creative projects, find the perfect printing solution for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="product-card overflow-hidden border-2 hover:shadow-xl transition-all">
            <div className="relative h-64">
              <img
                src="/business-cards-and-corporate-stationery-printing.jpg"
                alt="Business Printing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Business Printing</h3>
                <p className="text-sm opacity-90 mb-4">Professional materials for your brand</p>
                <Button size="sm" variant="secondary" className="rounded-full">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>

          <Card className="product-card overflow-hidden border-2 hover:shadow-xl transition-all">
            <div className="relative h-64">
              <img
                src="/large-format-banner-and-poster-printing.jpg"
                alt="Marketing Materials"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Marketing Materials</h3>
                <p className="text-sm opacity-90 mb-4">Eye-catching promotional prints</p>
                <Button size="sm" variant="secondary" className="rounded-full">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

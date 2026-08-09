"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function StatsSection() {
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (statsRef.current) {
        gsap.from(".stat-card", {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={statsRef} className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="stat-card border-2">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: "oklch(var(--primary))" }}>
                500+
              </div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </CardContent>
          </Card>
          <Card
            className="stat-card border-2"
            style={{
              backgroundColor: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
              borderColor: "oklch(var(--primary))",
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-sm opacity-90">Projects Completed</div>
            </CardContent>
          </Card>
          <Card className="stat-card border-2">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: "oklch(var(--primary))" }}>
                15+
              </div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </CardContent>
          </Card>
          <Card className="stat-card border-2">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: "oklch(var(--primary))" }}>
                50+
              </div>
              <div className="text-sm text-muted-foreground">Print Solutions</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

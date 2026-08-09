"use client"

import { motion } from "framer-motion"

export function ServicesHero() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#422f7e]/10 via-background to-[#e20613]/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-foreground">
            Designs & Printing Services
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            Explore our professional designs and printing services. High-quality solutions for all your business needs.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

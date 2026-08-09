"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function DesignHero() {
  return (
    <section className="relative h-[50vh] min-h-[400px] max-h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.pexels.com/photos/1050244/pexels-photo-1050244.jpeg"
          alt="Design Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </motion.div>

      {/* Rich Gradient Overlay - No low opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0826] via-[#1a1040] to-[#0a0612]" />

      {/* Accent Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e20613] rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#7c3aed] rounded-full blur-[120px]" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#e20613] animate-pulse" />
            <span className="text-sm font-medium text-white">Premium Quality Products</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
            Professional{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#e20613] via-[#ff4757] to-[#ff6b81] bg-clip-text text-transparent">
                Products
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#e20613] to-[#ff6b81] rounded-full origin-left"
              />
            </span>{" "}
            Sales
          </h1>

          {/* Description - Full opacity */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Browse and purchase high-quality, printable designs for your business and creative projects.
          </p>

         
        </motion.div>
      </div>


      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}

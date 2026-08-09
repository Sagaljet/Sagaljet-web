"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description: string
  imageSrc?: string
}

export function PageHeader({ title, description, imageSrc }: PageHeaderProps) {
  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90"
        style={
          imageSrc
            ? {
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl text-pretty"
        >
          {description}
        </motion.p>
      </div>
    </div>
  )
}

// Keep default export for backward compatibility
export default PageHeader

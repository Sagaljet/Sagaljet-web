"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#422f7e]/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#e20613]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center justify-center mb-6"
        >
          <div className="px-4 py-2 rounded-full bg-[#422f7e]/10 border border-[#422f7e]/20">
            <span className="text-sm font-medium text-[#422f7e]">
              Get on board
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight mb-6"
        >
          Bring Your Vision to Life with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#422f7e] to-[#e20613]">
            Premium Printing
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Professional printing services for businesses and individuals.
          Experience exceptional quality, fast turnaround, and outstanding
          customer support with every project.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(66, 47, 126, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href={"/contact"}>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#422f7e] hover:bg-[#422f7e]/90 text-white px-8 py-6 text-base md:text-lg font-semibold rounded-xl shadow-lg shadow-[#422f7e]/30 transition-all duration-300"
              >
                Get a Quote
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href={"/projects"}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#422f7e] text-[#422f7e] hover:bg-[#422f7e] hover:text-white px-8 py-6 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent group"
              >
                View Our Projects
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
        ></motion.div>
      </div>
    </section>
  );
}

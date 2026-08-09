"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Users,
  Building2,
  Award,
  Sparkles,
} from "lucide-react";

interface StatItem {
  number: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const stats: StatItem[] = [
  {
    number: 300,
    suffix: "k",
    label: "Projects",
    icon: FolderKanban,
    description: "Successfully delivered projects worldwide",
  },
  {
    number: 350,
    suffix: "+",
    label: "Employees",
    icon: Users,
    description: "Talented professionals in our team",
  },
  {
    number: 13,
    suffix: "",
    label: "Offices",
    icon: Building2,
    description: "Global offices across continents",
  },
  {
    number: 19,
    suffix: "+",
    label: "Years of Experience",
    icon: Award,
    description: "Industry-leading expertise",
  },
];

// Simple Animated Counter with Intersection Observer
function SimpleAnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            
            const duration = 2000;
            const startTime = Date.now();

            const updateCounter = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.round(value * easeProgress);
              
              setDisplayValue(currentValue);

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              }
            };

            requestAnimationFrame(updateCounter);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasStarted]);

  // Fallback for mobile - start animation after mount
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasStarted) {
        setHasStarted(true);
        
        const duration = 2000;
        const startTime = Date.now();

        const updateCounter = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.round(value * easeProgress);
          
          setDisplayValue(currentValue);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };

        requestAnimationFrame(updateCounter);
      }
    }, 1000);

    return () => clearTimeout(fallbackTimer);
  }, [value, hasStarted]);

  return (
    <div ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}
      {suffix}
    </div>
  );
}

// Individual Stat Card Component - Light & Dark Mode
function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-lg transition-all duration-500 hover:shadow-2xl border
        bg-white border-gray-200 hover:shadow-gray-200/50
        dark:bg-[#2d2d2d] dark:border-[#424242] dark:shadow-black/20 dark:hover:shadow-[#7c4dff]/10"
      >
        {/* Background Gradient on Hover - Light Mode */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
            bg-gradient-to-br from-[#ED8486]/10 via-transparent to-[#ED8486]/5
            dark:from-[#7c4dff]/10 dark:via-transparent dark:to-[#ff7043]/5"
          initial={false}
        />

        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-bl from-gray-100 to-transparent
          dark:from-[#383838] dark:to-transparent" 
        />

        {/* Glowing Effect on Hover (Dark mode only) */}
        <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 hidden dark:block
          bg-gradient-to-r from-[#7c4dff] to-[#ff7043]" 
        />

        {/* Icon Container */}
        <motion.div
          className="relative mb-4 md:mb-6"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl transition-colors duration-500 border
            bg-gray-100 border-gray-200 group-hover:bg-[#ED8486] group-hover:border-[#ED8486]
            dark:bg-[#383838] dark:border-[#424242] dark:group-hover:bg-[#7c4dff] dark:group-hover:border-[#7c4dff]"
          >
            <Icon  className="w-7 h-7 md:w-8 md:h-8 transition-colors duration-500
              text-gray-800 group-hover:text-white
              dark:text-[#f5f5f5] dark:group-hover:text-white" 
            />
          </div>

          {/* Floating Sparkle */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300
              text-[#ED8486] dark:text-[#ff7043]" 
            />
          </motion.div>
        </motion.div>

        {/* Number */}
        <div className="relative mb-2">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight
            text-gray-900 dark:text-[#f5f5f5]"
          >
            <SimpleAnimatedCounter value={stat.number} suffix={stat.suffix} />
          </h3>
        </div>

        {/* Label */}
        <p className="text-lg md:text-xl font-semibold mb-2 transition-colors duration-300
          text-gray-900 group-hover:text-[#ED8486]
          dark:text-[#f5f5f5] dark:group-hover:text-[#7c4dff]"
        >
          {stat.label}
        </p>

        {/* Description */}
        <p className="text-sm leading-relaxed
          text-gray-500 dark:text-[#9e9e9e]"
        >
          {stat.description}
        </p>

        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1
            bg-gradient-to-r from-[#ED8486] to-[#ED8486]/50
            dark:from-[#7c4dff] dark:to-[#ff7043]"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// Main Statistics Component - Light & Dark Mode
export default function Statistics() {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden
      bg-white dark:bg-[#212121]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      {/* Gradient Orbs - Light Mode */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl
        bg-[#ED8486]/10 dark:bg-[#7c4dff]/10" 
      />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl
        bg-[#ED8486]/5 dark:bg-[#ff7043]/10" 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6
              bg-gray-50 border-gray-200
              dark:bg-[#2d2d2d] dark:border-[#424242]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-[#ED8486] dark:text-[#7c4dff]" />
            <span className="text-sm font-medium text-gray-600 dark:text-[#9e9e9e]">
              Our Impact
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4
              text-gray-900 dark:text-[#f5f5f5]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Building Excellence,{" "}
            <span className="relative">
              {/* Light mode accent */}
              <span className="relative z-10 text-[#ED8486] dark:bg-gradient-to-r dark:from-[#7c4dff] dark:to-[#ff7043] dark:bg-clip-text dark:text-transparent">
                Delivering Results
              </span>
              <motion.span
                className="absolute bottom-2 left-0 h-3 -z-0 rounded
                  bg-[#ED8486]/20 dark:bg-gradient-to-r dark:from-[#7c4dff]/30 dark:to-[#ff7043]/30"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg max-w-2xl mx-auto
              text-gray-600 dark:text-[#9e9e9e]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            For over 19 years, we have been at the forefront of innovation,
            delivering exceptional solutions to clients worldwide.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="mt-12 md:mt-16 lg:mt-20 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300 dark:to-[#424242]" />
            <div className="w-2 h-2 rounded-full bg-[#ED8486] dark:bg-[#7c4dff]" />
            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-[#ff7043]" />
            <div className="w-2 h-2 rounded-full bg-[#ED8486] dark:bg-[#7c4dff]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300 dark:to-[#424242]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
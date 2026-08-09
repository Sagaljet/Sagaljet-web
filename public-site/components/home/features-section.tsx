"use client";

import { motion, useInView, Variants } from "framer-motion";
import {
  Clock,
  Gauge,
  Lightbulb,
  Package,
  RefreshCw,
  Shield,
  Smartphone,
  Target,
  Zap,
} from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Shield,
    title: "Reliable",
    description:
      "Top-tier printing quality and unmatched service uptime. Our dependable support and consistent results ensure you can always rely on Sagaljet for your printing needs.",
    featured: false,
  },
  {
    icon: Zap,
    title: "Productive",
    description:
      "Fast turnaround times and efficient workflows boost your productivity. We help you focus on your business while we handle all your printing requirements with speed and precision.",
    featured: true,
  },
  {
    icon: Lightbulb,
    title: "Intuitive",
    description:
      "User-friendly ordering process and clear communication make printing simple. Our intuitive platform and expert guidance ensure a seamless experience from start to finish.",
    featured: false,
  },
  {
    icon: Gauge,
    title: "Efficient",
    description:
      "Streamlined production processes and automated workflows allow us to deliver high-quality prints faster, helping you accomplish more in less time.",
    featured: false,
  },
  {
    icon: Target,
    title: "Accurate",
    description:
      "Precision printing technology and rigorous quality control ensure accurate color reproduction and sharp details in every project we deliver.",
    featured: false,
  },
  {
    icon: Smartphone,
    title: "Responsive",
    description:
      "Quick response times and dedicated customer support enhance your experience. We're always ready to answer queries and provide solutions promptly.",
    featured: false,
  },
  {
    icon: Package,
    title: "Convenient",
    description:
      "Easy online ordering and flexible delivery options provide unparalleled convenience. Order from anywhere, anytime, and receive your prints when you need them.",
    featured: false,
  },
  {
    icon: RefreshCw,
    title: "Adaptive",
    description:
      "Flexible printing solutions that adapt to your unique requirements. From small runs to large volumes, we customize our services to match your specific needs.",
    featured: false,
  },
  {
    icon: Clock,
    title: "Time Saving",
    description:
      "Express printing services and efficient processes help you meet tight deadlines. Save valuable time with our quick turnaround and reliable delivery.",
    featured: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className=" md:py-10 lg:py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/50 border border-border mb-4">
            <span className="text-xs md:text-sm font-medium text-accent-foreground">
              Professional Printing Solutions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Printing Tailored Just for You
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            Experience the world of professional printing with Sagaljet,
            designed to deliver exceptional quality and enhance your brand
            presence.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className={`group relative p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                  feature.featured
                    ? "bg-[#422f7e] border-[#422f7e] text-white"
                    : "bg-card border-border hover:border-[#422f7e]/50 hover:shadow-lg hover:shadow-[#422f7e]/10"
                }`}
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      feature.featured
                        ? "bg-white/20"
                        : "bg-accent group-hover:bg-[#422f7e]/10"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        feature.featured
                          ? "text-white"
                          : " text-white group-hover:text-[#422f7e]"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl md:text-2xl font-semibold mb-3 ${
                      feature.featured ? "text-white" : "text-foreground"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm md:text-base leading-relaxed ${
                      feature.featured
                        ? "text-white/90"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

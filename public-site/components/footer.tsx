"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  services: [
    { name: "Business Cards", href: "/" },
    { name: "Brochures", href: "/" },
    { name: "Banners", href: "/" },
  ],
  resources: [
    { name: "Designs", href: "/designs" },
    { name: "Blog", href: "/blog" },
    { name: "Support", href: "/contact" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Events", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/SagaljetCompany",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/sagaljet",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/sagaljet",
  },
  { name: "Twitter", icon: Twitter, href: "https://x.com/SagaljetCompany" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/" },
  { name: "Terms of Service", href: "/" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer
      ref={ref}
      className="relative mt-24 px-4 md:px-6 lg:px-8 py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-background/80 backdrop-blur-sm rounded-3xl border border-border shadow-lg p-8 md:p-12 lg:p-16"
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-12">
            {/* Left Side - Brand */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <Image src={"/logo.jpg"} width={100} height={100} alt="logo" />
              </Link>

              <p className="text-muted-foreground leading-relaxed max-w-md">
                Sagaljet empowers businesses to transform their brand identity
                with premium printing solutions — making quality prints easier
                to create, understand, and deliver.
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        isInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0 }
                      }
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 text-white rounded-lg bg-accent hover:bg-[#422f7e] flex items-center justify-center transition-all group"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5 text-white group-hover:text-white transition-all" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side - Navigation Links */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12"
            >
              {/* Services Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Services
                </h3>
                <ul className="space-y-3">
                  {footerLinks.services.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                      }
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-[#422f7e] transition-all inline-block hover:translate-x-1 duration-200"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Resources Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Resources
                </h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                      }
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-[#422f7e] transition-all inline-block hover:translate-x-1 duration-200"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                      }
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-all hover:text-[#422f7e] inline-block hover:translate-x-1 duration-200"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            variants={itemVariants}
            className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <p className="text-sm text-muted-foreground">
              © 2025 Sagaljet. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#422f7e] transition-all underline-offset-4 hover:underline"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="pt-4 flex justify-center items-center"
          >
            <p className="text-sm text-muted-foreground">
              Developed by{" "}
              <a
                href="https://hornsolution.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#422f7e] hover:text-[#5a3fa8] transition-all underline-offset-4 hover:underline font-medium"
              >
                hornsolution
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { WhatsAppContactDialog } from "@/components/whatsapp-contact-dialog"

export function ServicesCTA() {
  return (
    <section className="py-20 px-5 bg-gradient-to-br from-[#422f7e]/5 via-background to-[#e20613]/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance text-foreground">
            Need Custom Solutions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Can't find what you're looking for? Our team can create custom designs and handle special printing orders
            tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <WhatsAppContactDialog itemTitle="Custom Service Request" itemType="custom" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-[#422f7e] text-[#422f7e] hover:bg-[#422f7e] hover:text-white px-8 py-6 text-lg bg-transparent"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

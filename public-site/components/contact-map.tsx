"use client";

import { motion } from "framer-motion";

export function ContactMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <h2 className="text-2xl font-bold mb-6">Find Us on the Map</h2>

      <div className="relative w-full h-[450px] bg-muted rounded-lg overflow-hidden border border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.3716082481337!2d44.0605295!3d9.563199299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1628bf9f0a814d91%3A0x9c79bf6befb0aa55!2sSagal%20Jet!5e0!3m2!1sen!2sso!4v1761718640562!5m2!1sen!2sso"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Sagal Jet Location Map"
        />
      </div>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        Visit our main office in Hargeisa or any of our branch locations across
        the region.
      </p>
    </motion.div>
  );
}

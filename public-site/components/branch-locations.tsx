"use client";

import { motion } from "framer-motion";
import { Branch, branches } from "@/lib/contact-data";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function BranchLocations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Our Locations</h2>

      {/* Hargeisa Branches */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-primary">Hargeisa</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {branches
            .filter((branch) => branch.id.startsWith("hargeisa"))
            .map((branch, index) => (
              <BranchCard key={branch.id} branch={branch} index={index} />
            ))}
        </div>
      </div>

      {/* Regional Branches */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-primary">Regional Branches</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {branches
            .filter((branch) => !branch.id.startsWith("hargeisa"))
            .map((branch, index) => (
              <BranchCard key={branch.id} branch={branch} index={index} />
            ))}
        </div>
      </div>
    </motion.div>
  );
}

function BranchCard({ branch, index }: { branch: Branch; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <h4 className="text-base font-semibold mb-3">{branch.name}</h4>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{branch.address}</p>
            <p className="text-muted-foreground text-xs">{branch.city}</p>
          </div>
        </div>

        {/* Multiple Phone Numbers */}
        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {branch.phones.map((phone:any, idx:any) => (
              <a
                key={idx}
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="hover:text-primary transition-colors text-xs"
              >
                {phone}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
          <a
            href={`mailto:${branch.email}`}
            className="hover:text-primary transition-colors truncate text-xs"
          >
            {branch.email}
          </a>
        </div>

        {/* <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-muted-foreground text-xs">{branch.hours}</span>
        </div> */}
      </div>
    </motion.div>
  );
}
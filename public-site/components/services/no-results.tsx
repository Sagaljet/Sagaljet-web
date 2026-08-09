"use client"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoResultsProps {
  onClearFilters: () => void
}

export function NoResults({ onClearFilters }: NoResultsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-foreground">No designs found</h3>
      <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="border-[#422f7e] text-[#422f7e] hover:bg-[#422f7e] hover:text-white bg-transparent"
      >
        Clear Filters
      </Button>
    </motion.div>
  )
}

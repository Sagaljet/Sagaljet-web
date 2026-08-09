// src/components/order-design/no-results.tsx

"use client";

import { motion } from "framer-motion";
import { SearchX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  onClearFilters: () => void;
}

export function NoResults({ onClearFilters }: NoResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <SearchX className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No designs found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any designs matching your criteria. Try adjusting your
        filters or search terms.
      </p>
      <Button onClick={onClearFilters} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </motion.div>
  );
}
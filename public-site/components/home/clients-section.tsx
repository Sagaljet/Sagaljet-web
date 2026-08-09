// app/clients/clients-page-client.tsx (Ultra Smooth Version)
"use client";

import { useRef } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClientsQuery } from "@/lib/features/clients/clientsApi";

export default function ClientsPageClient() {
  const x = useMotionValue(0);
  const isHovering = useRef(false);

  const {
    data: clients = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetClientsQuery();

  // Create tripled array for infinite scroll
  const tripledClients =
    clients && clients.length > 0 ? [...clients, ...clients, ...clients] : [];

  // Calculate dimensions
  const itemWidth = 160; // Reduced from 240
  const totalWidth = clients.length * itemWidth;

  // Smooth continuous animation
  useAnimationFrame((t, delta) => {
    if (!isHovering.current && clients.length > 0) {
      // Move left (negative direction)
      const speed = -0.5; // Adjust speed: higher = faster
      let newX = x.get() + speed;

      // Reset when one set has scrolled
      if (newX <= -totalWidth) {
        newX = 0;
      }

      x.set(newX);
    }
  });

  const handleMouseEnter = () => {
    isHovering.current = true;
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
  };

  // Loading state
  if (isLoading) {
    return (
      <section>
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <Skeleton className="w-[100px] h-[100px] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error && "status" in error
        ? `Error ${error.status}: ${
            error.status === 404
              ? "Clients endpoint not found"
              : error.status === 500
              ? "Server error"
              : "Failed to load clients"
          }`
        : "Failed to load clients";

    return (
      <section>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                {errorMessage}
              </h2>
              {error && "data" in error && (
                <pre className="text-sm text-muted-foreground mt-4 p-4 bg-muted rounded">
                  {JSON.stringify(error.data, null, 2)}
                </pre>
              )}
            </div>
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Retrying..." : "Try Again"}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!clients || clients.length === 0) {
    return (
      <section>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <p className="text-muted-foreground text-lg">
              No clients available at the moment.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Success state
  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Sliding Logos */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6 md:gap-8 lg:gap-10 will-change-transform"
            style={{ x }}
          >
            {tripledClients.map((client, index) => (
              <motion.div
                key={`${client.id}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] rounded-xl bg-white dark:bg-muted/50 border border-border group-hover:border-primary/60 shadow-md group-hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                  <Image
                    src={client.logoUrl}
                    alt={client.description || `${client.name} logo`}
                    fill
                    className="object-contain p-3 transition-all duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, (max-width: 1024px) 120px, 140px"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background via-background/90 to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
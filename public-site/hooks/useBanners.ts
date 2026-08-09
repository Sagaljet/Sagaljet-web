// hooks/useBanners.ts
"use client";

import { Url } from "@/lib/url";
import { useEffect, useState } from "react";

export type BannerType = "projects" | "design" | "events" | "blogs" | "about" | "contact" |"banner";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  label: string;
  image: string;
  url?: string | null;
  discount?: number | null;
  discountType?: string | null;
  order: number;
  isActive: boolean;
}

interface UseBannersReturn {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBanners(type: BannerType): UseBannersReturn {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${Url}/banners/${type}/active`);

      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }

      const data = await response.json();
      setBanners(data.result || []);
    } catch (err) {
      console.error(`Error fetching ${type} banners:`, err);
      setError("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [type]);

  return { banners, isLoading, error, refetch: fetchBanners };
}
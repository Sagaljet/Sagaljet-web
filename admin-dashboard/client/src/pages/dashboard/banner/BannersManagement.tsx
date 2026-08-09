// pages/BannersManagement.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getAllBannersFn } from "@/redux/banner/getBannersSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Briefcase,
  CalendarDays,
  FileText,
  HomeIcon,
  Image,
  LayoutGrid,
  Palette,
  Phone,
  RefreshCw,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type BannerType, BANNER_TYPES } from "../../../redux/types/banner";
import BannerTable from "./BannerTable";
import CreateBannerDialog from "./CreateBannerSideCardDialog";

// Icon mapping for each banner type
const BANNER_ICONS: Record<BannerType, React.ReactNode> = {
  projects: <Briefcase className="h-4 w-4" />,
  design: <Palette className="h-4 w-4" />,
  events: <CalendarDays className="h-4 w-4" />,
  blogs: <FileText className="h-4 w-4" />,
  about: <Users className="h-4 w-4" />,
  contact: <Phone className="h-4 w-4" />,
  banner: <HomeIcon className="h-4 w-4" />,
};

// Color mapping for each banner type
const BANNER_COLORS: Record<BannerType, { bg: string; light: string; text: string }> = {
  banner: { bg: "bg-indigo-500", light: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
  projects: { bg: "bg-blue-500", light: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
  design: { bg: "bg-purple-500", light: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
  events: { bg: "bg-orange-500", light: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  blogs: { bg: "bg-green-500", light: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
  about: { bg: "bg-cyan-500", light: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" },
  contact: { bg: "bg-pink-500", light: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600 dark:text-pink-400" },
};

const BannersManagement = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<BannerType>("banner");

  const banners = useSelector((state: RootState) => state.getBanners);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch banners when tab changes
  useEffect(() => {
    dispatch(getAllBannersFn({ type: activeTab }));
  }, [dispatch, activeTab]);

  // Check for mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value as BannerType);
  };

  const handleRefresh = () => {
    dispatch(getAllBannersFn({ type: activeTab }));
  };

  const getBannerCount = () => {
    return banners.currentType === activeTab ? banners.data.length : 0;
  };

  const getActiveLabel = () => {
    return BANNER_TYPES.find((t) => t.value === activeTab)?.label || "";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Banner Management
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage banners for different pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={banners.isLoading}
              className="shrink-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${banners.isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <div className="flex-1 sm:flex-none">
              <CreateBannerDialog bannerType={activeTab} />
            </div>
          </div>
        </div>

        {/* Desktop Stats Cards (lg+) */}
        <div className="hidden lg:grid grid-cols-7 gap-3 mb-6">
          {BANNER_TYPES.map((type) => {
            const colors = BANNER_COLORS[type.value];
            const isActive = activeTab === type.value;

            return (
              <Card
                key={type.value}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 shadow-md"
                    : "hover:border-primary/50"
                )}
                onClick={() => handleTabChange(type.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-2 rounded-lg", colors.light)}>
                      <span className={colors.text}>
                        {BANNER_ICONS[type.value]}
                      </span>
                    </div>
                    {isActive && banners.currentType === type.value && (
                      <Badge variant="secondary" className="text-xs">
                        {banners.data.length}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-sm">{type.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mobile Dropdown Selector (sm) */}
        <div className="md:hidden mb-6">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full h-14 px-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    BANNER_COLORS[activeTab].bg
                  )}
                >
                  <span className="text-white">
                    {BANNER_ICONS[activeTab]}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{getActiveLabel()} Banners</span>
                  <span className="text-xs text-muted-foreground">
                    {getBannerCount()} banner{getBannerCount() !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              {BANNER_TYPES.map((type) => {
                const colors = BANNER_COLORS[type.value];
                return (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="py-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", colors.bg)}>
                        <span className="text-white">
                          {BANNER_ICONS[type.value]}
                        </span>
                      </div>
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Tablet Tabs (md screens) - IMPROVED */}
        <div className="hidden md:block lg:hidden mb-6">
          <Card className="p-2">
            <ScrollArea className="w-full">
              <div className="flex gap-2 p-1">
                {BANNER_TYPES.map((type) => {
                  const colors = BANNER_COLORS[type.value];
                  const isActive = activeTab === type.value;

                  return (
                    <button
                      key={type.value}
                      onClick={() => handleTabChange(type.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap min-w-fit",
                        isActive
                          ? `${colors.bg} text-white shadow-lg scale-[1.02]`
                          : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-foreground"
                      )}
                    >
                      <span className={isActive ? "text-white" : colors.text}>
                        {BANNER_ICONS[type.value]}
                      </span>
                      <span>{type.label}</span>
                      {isActive && banners.currentType === type.value && (
                        <Badge
                          variant="secondary"
                          className="ml-1 bg-white/20 text-white border-0 text-xs"
                        >
                          {banners.data.length}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </Card>
        </div>

        {/* Current Tab Info Card */}
        <Card className="mb-6 overflow-hidden">
          <div
            className={cn(
              "h-1",
              BANNER_COLORS[activeTab].bg
            )}
          />
          <CardContent className="py-4 px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    BANNER_COLORS[activeTab].bg
                  )}
                >
                  <span className="text-white">
                    {BANNER_ICONS[activeTab]}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    {getActiveLabel()} Banners
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {banners.isLoading
                      ? "Loading..."
                      : `${getBannerCount()} banner${getBannerCount() !== 1 ? "s" : ""} found`}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "hidden sm:flex items-center gap-1.5 px-3 py-1",
                    BANNER_COLORS[activeTab].text
                  )}
                >
                  <LayoutGrid className="h-3 w-3" />
                  {activeTab}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banner Table Content */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 md:p-6">
            <BannerTable
              banners={banners.currentType === activeTab ? banners.data : []}
              bannerType={activeTab}
              isLoading={banners.isLoading}
              isMobile={isMobile}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BannersManagement;
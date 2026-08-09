// src/pages/OrderDesign/OrderDesignPage.tsx

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, RefreshCw, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AppDispatch, RootState } from "@/redux/store";
import type { OrderDesign, PostType } from "@/redux/types/orderDesign";
import { getAllOrderDesignsFn } from "@/redux/slices/orderDesign/getAllOrderDesigns";

import CreateOrderDesignDialog from "./CreateOrderDesignDialog";
import UpdateOrderDesignDialog from "./UpdateOrderDesignDialog";
import DeleteOrderDesignDialog from "./DeleteOrderDesignDialog";
import { OrderDesignPageSkeleton } from "./OrderDesignSkeleton";

// ✅ FIX: Use "ALL" instead of empty string
const POST_TYPES: { value: PostType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Post Types" },
  { value: "FACEBOOK_POST", label: "Facebook Post" },
  { value: "INSTAGRAM_POST", label: "Instagram Post" },
  { value: "INSTAGRAM_STORY", label: "Instagram Story" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "YOUTUBE_THUMBNAIL", label: "YouTube Thumbnail" },
  { value: "TWITTER", label: "Twitter" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "OTHER", label: "Other" },
];

// Mobile Card Component
function OrderDesignCard({ orderDesign }: { orderDesign: OrderDesign }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage
                src={orderDesign.images[0] || undefined}
                alt={orderDesign.title}
              />
              <AvatarFallback className="rounded-lg">
                {orderDesign.title.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-bold text-base">{orderDesign.title}</span>
              <p className="text-sm font-semibold text-green-600">
                ${orderDesign.price.toFixed(2)}
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orderDesign.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {orderDesign.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">
            {formatPostType(orderDesign.postType)}
          </Badge>
          {orderDesign.size && (
            <Badge variant="outline">{orderDesign.size}</Badge>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <UpdateOrderDesignDialog orderDesign={orderDesign} />
          <DeleteOrderDesignDialog orderDesign={orderDesign} />
        </div>
      </CardContent>
    </Card>
  );
}

// Table Row Component
function OrderDesignTableRow({ orderDesign }: { orderDesign: OrderDesign }) {
  return (
    <TableRow>
      <TableCell>
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage
            src={orderDesign.images[0] || undefined}
            alt={orderDesign.title}
          />
          <AvatarFallback className="rounded-lg">
            {orderDesign.title.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{orderDesign.title}</p>
          {orderDesign.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
              {orderDesign.description}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="font-semibold text-green-600">
          ${orderDesign.price.toFixed(2)}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {orderDesign.size || "-"}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Badge
          variant="secondary"
          className={getPostTypeBadgeColor(orderDesign.postType)}
        >
          {formatPostType(orderDesign.postType)}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(orderDesign.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <UpdateOrderDesignDialog orderDesign={orderDesign} />
          <DeleteOrderDesignDialog orderDesign={orderDesign} />
        </div>
      </TableCell>
    </TableRow>
  );
}

// Helper functions
function formatPostType(type: PostType): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function getPostTypeBadgeColor(type: PostType): string {
  const colors: Record<PostType, string> = {
    FACEBOOK_POST: "bg-blue-100 text-blue-800",
    INSTAGRAM_POST: "bg-pink-100 text-pink-800",
    INSTAGRAM_STORY: "bg-purple-100 text-purple-800",
    TIKTOK: "bg-gray-800 text-white",
    YOUTUBE_THUMBNAIL: "bg-red-100 text-red-800",
    TWITTER: "bg-sky-100 text-sky-800",
    LINKEDIN: "bg-blue-100 text-blue-800",
    OTHER: "bg-gray-100 text-gray-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
}

export default function OrderDesignPage() {
  const [screenSize, setScreenSize] = useState("large");
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { data, isLoading, pagination } = useSelector(
    (state: RootState) => state.getAllOrderDesigns
  );

  // Filter state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // ✅ FIX: Default to "ALL" instead of empty string
  const [postTypeFilter, setPostTypeFilter] = useState<PostType | "ALL">("ALL");
  const [limit] = useState(10);

  // Fetch data
  const fetchData = useCallback(() => {
    dispatch(
      getAllOrderDesignsFn({
        page,
        limit,
        search,
        // ✅ FIX: Convert "ALL" to empty string/undefined for API
        postType: postTypeFilter === "ALL" ? undefined : postTypeFilter,
      })
    );
  }, [dispatch, page, limit, search, postTypeFilter]);

  useEffect(() => {
    fetchData();

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("small");
      } else if (window.innerWidth < 1024) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setPostTypeFilter("ALL"); // ✅ Reset to "ALL"
    setPage(1);
  };

  // Loading state
  if (isLoading && data.length === 0) {
    return <OrderDesignPageSkeleton />;
  }

  const orderDesigns = data || [];

  // ✅ Check if filters are active
  const hasActiveFilters = search || postTypeFilter !== "ALL";

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Order Designs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your design orders
            {pagination && ` (${pagination.total} total)`}
          </p>
        </div>
        <CreateOrderDesignDialog />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Post Type Filter */}
        <Select
          value={postTypeFilter}
          onValueChange={(value) => {
            setPostTypeFilter(value as PostType | "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Post Type" />
          </SelectTrigger>
          <SelectContent>
            {POST_TYPES.map((type) => (
              // ✅ FIX: All values are now non-empty strings
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          {/* ✅ FIX: Use hasActiveFilters for conditional rendering */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {orderDesigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No order designs found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first order design
          </p>
          <CreateOrderDesignDialog />
        </div>
      ) : (
        <>
          {/* Mobile: Cards */}
          {screenSize === "small" ? (
            <div className="space-y-4">
              {orderDesigns.map((orderDesign: OrderDesign) => (
                <OrderDesignCard
                  key={orderDesign.id}
                  orderDesign={orderDesign}
                />
              ))}
            </div>
          ) : (
            /* Desktop: Table */
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Post Type
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created At
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDesigns.map((orderDesign: OrderDesign) => (
                    <OrderDesignTableRow
                      key={orderDesign.id}
                      orderDesign={orderDesign}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading Overlay */}
      {isLoading && data.length > 0 && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
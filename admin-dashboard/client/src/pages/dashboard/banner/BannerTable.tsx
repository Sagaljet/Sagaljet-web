// components/banners/BannerTable.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Banner, BannerType } from "../../../redux/types/banner";
import DeleteBannerDialog from "./DeleteBannerDialog";
import ToggleBannerActiveButton from "./ToggleBannerActiveButton";
import UpdateBannerDialog from "./UpdateBannerDialog";

interface BannerTableProps {
  banners: Banner[];
  bannerType: BannerType;
  isLoading: boolean;
  isMobile: boolean;
}

const BannerTable = ({
  banners,
  bannerType,
  isLoading,
  isMobile,
}: BannerTableProps) => {
  // Mobile Card View
  const BannerMobileCard = ({ banner }: { banner: Banner }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{banner.title}</span>
          <Badge variant={banner.isActive ? "default" : "secondary"}>
            {banner.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {banner.image && (
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-32 object-cover rounded"
          />
        )}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Label:</span> {banner.label}
          </p>
          <p>
            <span className="font-semibold">Subtitle:</span> {banner.subtitle}
          </p>
          {banner.discount && (
            <p>
              <span className="font-semibold">Discount:</span>{" "}
              {banner.discountType === "percentage"
                ? `${banner.discount}%`
                : `$${banner.discount}`}
            </p>
          )}
          {banner.url && (
            <p>
              <span className="font-semibold">URL:</span>{" "}
              <a
                href={banner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {banner.url}
              </a>
            </p>
          )}
          <p>
            <span className="font-semibold">Order:</span> {banner.order}
          </p>
        </div>
        <div className="flex gap-2 pt-2 border-t flex-wrap">
          <ToggleBannerActiveButton
            bannerId={banner.id}
            isActive={banner.isActive}
            bannerType={bannerType}
          />
          <UpdateBannerDialog banner={banner} bannerType={bannerType} />
          <DeleteBannerDialog
            bannerId={banner.id}
            bannerTitle={banner.title}
            bannerType={bannerType}
          />
        </div>
      </CardContent>
    </Card>
  );

  // Skeleton Card
  const SkeletonCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  // Skeleton Table
  const SkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Subtitle</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-12 w-12" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Mobile View
  if (isMobile) {
    return (
      <div className="space-y-4 px-4">
        {isLoading ? (
          [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
        ) : banners.length > 0 ? (
          banners.map((banner) => (
            <BannerMobileCard key={banner.id} banner={banner} />
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No banners found. Create your first {bannerType} banner!
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="border rounded-lg overflow-hidden">
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length > 0 ? (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{banner.label}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {banner.subtitle}
                  </TableCell>
                  <TableCell>{banner.order}</TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <ToggleBannerActiveButton
                        bannerId={banner.id}
                        isActive={banner.isActive}
                        bannerType={bannerType}
                      />
                      <UpdateBannerDialog
                        banner={banner}
                        bannerType={bannerType}
                      />
                      <DeleteBannerDialog
                        bannerId={banner.id}
                        bannerTitle={banner.title}
                        bannerType={bannerType}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No banners found. Create your first {bannerType} banner!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BannerTable;
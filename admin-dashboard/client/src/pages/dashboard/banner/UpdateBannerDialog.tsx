// components/banners/UpdateBannerDialog.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Banner, BannerType } from "../../../redux/types/banner";
import { resetUpdateBanner, updateBannerFn } from "@/redux/banner/updateBannerSlice";
import { getAllBannersFn } from "@/redux/banner/getBannersSlice";

interface UpdateBannerDialogProps {
  banner: Banner;
  bannerType: BannerType;
}

const UpdateBannerDialog = ({ banner, bannerType }: UpdateBannerDialogProps) => {
  const updateBanner = useSelector((state: RootState) => state.updateBanner);
  const dispatch = useDispatch<AppDispatch>();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(banner.title || "");
  const [subtitle, setSubtitle] = useState(banner.subtitle || "");
  const [label, setLabel] = useState(banner.label || "");
  const [url, setUrl] = useState(banner.url || "");
  const [discount, setDiscount] = useState(banner.discount?.toString() || "");
  const [discountType, setDiscountType] = useState(
    banner.discountType || "percentage"
  );
  const [order, setOrder] = useState(banner.order?.toString() || "");
  const [isActive, setIsActive] = useState(banner.isActive ?? true);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(banner.title || "");
      setSubtitle(banner.subtitle || "");
      setLabel(banner.label || "");
      setUrl(banner.url || "");
      setDiscount(banner.discount?.toString() || "");
      setDiscountType(banner.discountType || "percentage");
      setOrder(banner.order?.toString() || "");
      setIsActive(banner.isActive ?? true);
      setNewImage(null);
      setImagePreview("");
    }
  }, [isOpen, banner]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewImage(null);
    setImagePreview("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      updateBannerFn({
        type: bannerType,
        id: banner.id,
        title,
        subtitle,
        label,
        url: url || null,
        discount: discount ? parseFloat(discount) : null,
        discountType,
        order: order ? parseInt(order) : 0,
        isActive,
        image: newImage,
      })
    );
  };

  const toastId:string="Hello"

  useEffect(() => {
    if (updateBanner?.isSuccess) {
      toast.success("Banner updated successfully!",{id:toastId});
      dispatch(resetUpdateBanner());
      dispatch(getAllBannersFn({ type: bannerType }));
      setIsOpen(false);
    }

    if (updateBanner?.isError) {
      toast.error(updateBanner?.message || "Failed to update banner");
    }
  }, [updateBanner?.isSuccess, updateBanner?.isError, dispatch, bannerType]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {bannerType} Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL Link</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
            />
          </div>

          {/* Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type</Label>
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>

          {/* Current Image */}
          <div className="space-y-2">
            <Label>Current Image</Label>
            {banner.image && (
              <img
                src={banner.image}
                alt="Current banner"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* New Image Upload */}
          <div className="space-y-2">
            <Label>Upload New Image</Label>
            {!imagePreview ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="new-image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      Click to upload new image
                    </p>
                  </div>
                  <Input
                    id="new-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="New preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Active Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateBanner?.isLoading}>
              {updateBanner?.isLoading ? "Updating..." : "Update Banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBannerDialog;
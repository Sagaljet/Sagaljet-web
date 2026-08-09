// components/banners/UpdateSideCardDialog.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { getAllDesignsFn } from "@/redux/slices/product/get-designs";
import {
  resetUpdateSideCard,
  updateSideCardFn,
} from "@/redux/banner/updateSideCardSlice";
import { getAllSideCardsFn } from "@/redux/banner/getSideCardsSlice";

export default function UpdateSideCardDialog({ sideCard }: any) {
  const updateSideCard = useSelector(
    (state: RootState) => state.updateSideCard
  );
  const designs = useSelector((state: RootState) => state.getDesigns);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState(sideCard.label || "");
  const [title, setTitle] = useState(sideCard.title || "");
  const [buttonText, setButtonText] = useState(
    sideCard.buttonText || "Order Now"
  );
  const [badge, setBadge] = useState(sideCard.badge || "");
  const [discount, setDiscount] = useState(sideCard.discount?.toString() || "");
  const [discountType, setDiscountType] = useState(
    sideCard.discountType || "percentage"
  );
  const [order, setOrder] = useState(sideCard.order?.toString() || "");
  const [isActive, setIsActive] = useState(sideCard.isActive ?? true);
  const [designId, setDesignId] = useState(
    sideCard.designId ? sideCard.designId.toString() : "none"
  );
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImage] = useState(sideCard.image || "");

  useEffect(() => {
    // @ts-ignore
    dispatch(getAllDesignsFn());
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      setLabel(sideCard.label || "");
      setTitle(sideCard.title || "");
      setButtonText(sideCard.buttonText || "Order Now");
      setBadge(sideCard.badge || "");
      setDiscount(sideCard.discount?.toString() || "");
      setDiscountType(sideCard.discountType || "percentage");
      setOrder(sideCard.order?.toString() || "");
      setIsActive(sideCard.isActive ?? true);
      setDesignId(sideCard.designId ? sideCard.designId.toString() : "none");
      setNewImage(null);
      setImagePreview("");
    }
  }, [isOpen, sideCard]);

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

    const data = {
      id: sideCard.id,
      label,
      title,
      buttonText,
      badge: badge || null,
      discount: discount ? parseFloat(discount) : null,
      discountType,
      order: order ? parseInt(order) : 0,
      isActive,
      designId: designId === "none" ? null : designId,
      image: newImage,
    };

    // @ts-ignore
    dispatch(updateSideCardFn(data));
  };

  const toastId = "update-sidecard";

  useEffect(() => {
    if (updateSideCard?.isSuccess) {
      toast.success("Side card updated successfully!", { id: toastId });
      dispatch(resetUpdateSideCard());
      // @ts-ignore
      dispatch(getAllSideCardsFn());
      setIsOpen(false);
    }

    if (updateSideCard?.isError) {
      toast.error(updateSideCard?.message || "Failed to update side card", {
        id: toastId,
      });
    }
  }, [
    updateSideCard?.isError,
    updateSideCard?.message,
    updateSideCard?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Side Card</DialogTitle>
          <DialogDescription>
            Update the side card information, image, and settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Badge (Optional)</Label>
              <Input
                id="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="design">Link to Design</Label>
              <Select value={designId} onValueChange={setDesignId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select design (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Design</SelectItem>
                  {Array.isArray(designs.data) &&
                    designs.data.map((design: any) => (
                      <SelectItem key={design.id} value={design.id.toString()}>
                        {design.title} - ${design.price}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Image</Label>
            {existingImage && (
              <img
                src={existingImage}
                alt="Current side card"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Upload New Image</Label>
            {!imagePreview ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      Click to upload new image
                    </p>
                  </div>
                  <Input
                    id="image"
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

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              disabled={updateSideCard?.isLoading}
            >
              {updateSideCard?.isLoading ? "Updating..." : "Update Side Card"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

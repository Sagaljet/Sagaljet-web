// src/pages/OrderDesign/UpdateOrderDesignDialog.tsx

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Edit, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { AppDispatch, RootState } from "@/redux/store";
import type { OrderDesign, PostType } from "@/redux/types/orderDesign";
import {
  updateOrderDesignFn,
  resetUpdateOrderDesign,
} from "@/redux/slices/orderDesign/updateOrderDesign";
import { getAllOrderDesignsFn } from "@/redux/slices/orderDesign/getAllOrderDesigns";

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "FACEBOOK_POST", label: "Facebook Post" },
  { value: "INSTAGRAM_POST", label: "Instagram Post" },
  { value: "INSTAGRAM_STORY", label: "Instagram Story" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "YOUTUBE_THUMBNAIL", label: "YouTube Thumbnail" },
  { value: "TWITTER", label: "Twitter" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "OTHER", label: "Other" },
];

const MAX_IMAGES = 10;

interface ImagePreview {
  id: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

interface UpdateOrderDesignDialogProps {
  orderDesign: OrderDesign;
}

export default function UpdateOrderDesignDialog({
  orderDesign,
}: UpdateOrderDesignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.updateOrderDesign
  );

  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [postType, setPostType] = useState<PostType>("FACEBOOK_POST");
  const [description, setDescription] = useState("");

  // Images state
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const toastId = "updateOrderDesign";

  // Populate form when dialog opens
  useEffect(() => {
    if (isOpen && orderDesign) {
      setTitle(orderDesign.title);
      setPrice(orderDesign.price.toString());
      setSize(orderDesign.size || "");
      setPostType(orderDesign.postType);
      setDescription(orderDesign.description || "");
      setNewImages([]);

      // Set existing images
      const existingImgs = orderDesign.images || [];
      setExistingImages(existingImgs);

      // Create previews for existing images
      const existingPreviews: ImagePreview[] = existingImgs.map((url, index) => ({
        id: `existing-${index}`,
        url,
        isExisting: true,
      }));
      setImagePreviews(existingPreviews);
    }
  }, [isOpen, orderDesign]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order design updated successfully!", { id: toastId });
      dispatch(resetUpdateOrderDesign());
      dispatch(getAllOrderDesignsFn({}));
      setIsOpen(false);
    }

    if (isError) {
      toast.error(message || "Failed to update order design", { id: toastId });
      dispatch(resetUpdateOrderDesign());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleMultipleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const totalCurrentImages = existingImages.length + newImages.length;
    const availableSlots = MAX_IMAGES - totalCurrentImages;

    if (availableSlots <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const filesToAdd = files.slice(0, availableSlots);

    // Validate files
    const validFiles: File[] = [];
    for (const file of filesToAdd) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10MB`);
        continue;
      }
      validFiles.push(file);
    }

    // Add new files
    setNewImages((prev) => [...prev, ...validFiles]);

    // Generate previews for new files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [
          ...prev,
          {
            id: `new-${Date.now()}-${Math.random()}`,
            url: reader.result as string,
            file: file,
            isExisting: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    const previewToRemove = imagePreviews[indexToRemove];

    if (previewToRemove.isExisting) {
      // Remove from existing images
      setExistingImages((prev) =>
        prev.filter((url) => url !== previewToRemove.url)
      );
    } else {
      // Remove from new images
      const newImageIndex = imagePreviews
        .slice(0, indexToRemove)
        .filter((p) => !p.isExisting).length;
      setNewImages((prev) => prev.filter((_, index) => index !== newImageIndex));
    }

    // Remove from previews
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!price || parseFloat(price) < 0) {
      toast.error("Valid price is required");
      return;
    }

    const data = {
      id: orderDesign.id,
      title: title.trim(),
      price: parseFloat(price),
      size: size.trim() || undefined,
      postType,
      description: description.trim() || undefined,
      images: newImages.length > 0 ? newImages : undefined,
      existingImages: existingImages,
    };

    dispatch(updateOrderDesignFn(data));
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Update
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Update Order Design</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto pr-2"
        >
          {/* ID Display */}
          <div className="bg-muted/50 px-3 py-2 rounded-md">
            <span className="text-sm text-muted-foreground">ID: </span>
            <span className="text-sm font-medium">{orderDesign.id}</span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="update-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="update-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter design title"
              required
            />
          </div>

          {/* Price and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="update-price">
                Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="update-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-size">Size</Label>
              <Input
                id="update-size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., 1080x1080"
              />
            </div>
          </div>

          {/* Post Type */}
          <div className="space-y-2">
            <Label htmlFor="update-postType">Post Type</Label>
            <Select
              value={postType}
              onValueChange={(value) => setPostType(value as PostType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                {POST_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="update-description">Description</Label>
            <Textarea
              id="update-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              rows={3}
            />
          </div>

          {/* Multiple Images Upload */}
          <div className="space-y-2">
            <Label>
              Images ({totalImages}/{MAX_IMAGES})
            </Label>
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> more
                  images
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB each (Max {MAX_IMAGES} images)
                </p>
              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImageChange}
                className="hidden"
              />

              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={preview.id} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {/* Badge for existing vs new */}
                        <Badge
                          variant={preview.isExisting ? "secondary" : "default"}
                          className="absolute bottom-2 left-2 text-xs"
                        >
                          {preview.isExisting ? "Existing" : "New"}
                        </Badge>
                      </div>
                      {preview.file && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {preview.file.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
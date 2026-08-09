import { TiptapEditor } from "@/components/tiptap-editor";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAllDesignsFn } from "@/redux/slices/product/get-designs";
import { getComponentTypesFn } from "@/redux/slices/component/getComponentTypes";
import {
  resetUpdateDesign,
  updateDesignFn,
} from "@/redux/slices/product/update-design";
import type { RootState } from "@/redux/store";
import {
  Edit,
  Upload,
  X,
  PlusCircle,
  Package,
  Info,
  DollarSign,
  Trash2,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface SelectedComponent {
  optionId: number;
  extraPrice: number;
}

interface ExistingImage {
  id?: number;
  url: string;
  isMarkedForDeletion: boolean;
}

export default function UpdateDialogProduct({ design }: any) {
  const updateDesign = useSelector((state: RootState) => state.updateDesign);
  const componentTypes = useSelector(
    (state: RootState) => state.getComponentTypes
  );
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(design.title || "");
  const [slug, setSlug] = useState(design.slug || "");
  const [price, setPrice] = useState(design.price?.toString() || "");
  const [description, setDescription] = useState(design.description || "");
  const [isPrintable, setIsPrintable] = useState(design.isPrintable ?? true);

  // Components state for extraPrice updates
  const [selectedComponents, setSelectedComponents] = useState<
    SelectedComponent[]
  >([]);

  // ✅ Enhanced Images state - track existing images with deletion status
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Fetch component types when dialog opens
  useEffect(() => {
    if (isOpen) {
      // @ts-ignore
      dispatch(getComponentTypesFn());
    }
  }, [isOpen, dispatch]);

  // Initialize form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTitle(design.title || "");
      setSlug(design.slug || "");
      setPrice(design.price?.toString() || "");
      setDescription(design.description || "");
      setIsPrintable(design.isPrintable ?? true);

      // Initialize selected components from existing design data
      if (design.components && Array.isArray(design.components)) {
        const existingComponents = design.components.map((comp: any) => ({
          optionId:
            comp.optionId ||
            comp.componentOptionId ||
            comp.componentOption?.id ||
            comp.id,
          extraPrice: parseFloat(comp.extraPrice) || 0,
        }));
        setSelectedComponents(existingComponents);
      } else if (
        design.designComponents &&
        Array.isArray(design.designComponents)
      ) {
        const existingComponents = design.designComponents.map((comp: any) => ({
          optionId: comp.componentOptionId || comp.componentOption?.id,
          extraPrice: parseFloat(comp.extraPrice) || 0,
        }));
        setSelectedComponents(existingComponents);
      } else {
        setSelectedComponents([]);
      }

      // ✅ Initialize existing images with proper structure
      if (design.images && Array.isArray(design.images)) {
        const formattedImages: ExistingImage[] = design.images.map(
          (img: any, index: number) => ({
            id: typeof img === "object" ? img.id : index,
            url: typeof img === "object" ? img.url : img,
            isMarkedForDeletion: false,
          })
        );
        setExistingImages(formattedImages);
      } else {
        setExistingImages([]);
      }

      setImagesToDelete([]);
      setNewImages([]);
      setNewImagePreviews([]);
    }
  }, [isOpen, design]);

  // Get option details for selected components
  const getOptionDetails = (optionId: number) => {
    if (!Array.isArray(componentTypes.data)) return null;
    for (const type of componentTypes.data) {
      // @ts-ignore
      const option = type.options?.find((o: any) => o.id === optionId);
      if (option) {
        // @ts-ignore
        return { option, typeName: type.name };
      }
    }
    return null;
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const updatedImages = [...newImages, ...files];
      setNewImages(updatedImages);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Toggle existing image for deletion
  const toggleExistingImageDeletion = (imageUrl: string) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.url === imageUrl
          ? { ...img, isMarkedForDeletion: !img.isMarkedForDeletion }
          : img
      )
    );

    setImagesToDelete((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((url) => url !== imageUrl);
      } else {
        return [...prev, imageUrl];
      }
    });
  };

  // ✅ Permanently remove existing image from list (soft delete before submit)
  // const removeExistingImage = (imageUrl: string) => {
  //   setExistingImages((prev) => prev.filter((img) => img.url !== imageUrl));
  //   if (!imagesToDelete.includes(imageUrl)) {
  //     setImagesToDelete((prev) => [...prev, imageUrl]);
  //   }
  // };

  // ✅ Restore marked image
  const restoreExistingImage = (imageUrl: string) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.url === imageUrl ? { ...img, isMarkedForDeletion: false } : img
      )
    );
    setImagesToDelete((prev) => prev.filter((url) => url !== imageUrl));
  };

  // Handle component selection
  const handleComponentToggle = (optionId: number, checked: boolean) => {
    if (checked) {
      setSelectedComponents([
        ...selectedComponents,
        { optionId, extraPrice: 0 },
      ]);
    } else {
      setSelectedComponents(
        selectedComponents.filter((c) => c.optionId !== optionId)
      );
    }
  };

  // Handle extraPrice change for a component
  const handleExtraPriceChange = (optionId: number, newPrice: number) => {
    setSelectedComponents(
      selectedComponents.map((c) =>
        c.optionId === optionId ? { ...c, extraPrice: newPrice } : c
      )
    );
  };

 // In UpdateDialogProduct.tsx - Update the handleSubmit function

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    toast.error("Please enter a valid price");
    return;
  }

  // ✅ Get remaining existing images (not marked for deletion)
  const remainingExistingImages = existingImages
    .filter((img) => !img.isMarkedForDeletion)
    .map((img) => img.url);

  // ✅ Properly structured data matching the slice
  const updateData = {
    id: design.id,
    title,
    slug,
    price: parseFloat(price),
    description,
    isPrintable,
    categoryDesignId: design.categoryDesignId, // Include if needed
    // ✅ Images
    existingImages: remainingExistingImages,
    newImages: newImages.length > 0 ? newImages : undefined,
    imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
    // ✅ Components
    components: selectedComponents.length > 0 ? selectedComponents : undefined,
  };

  console.log("📋 Submitting update data:", {
    ...updateData,
    newImages: updateData.newImages?.length || 0,
    existingImages: updateData.existingImages?.length || 0,
  });

  // @ts-ignore
  dispatch(updateDesignFn(updateData));
};

  const toastId = "update-design";

  useEffect(() => {
    if (updateDesign?.isSuccess) {
      toast.success("Design updated successfully!", { id: toastId });
      dispatch(resetUpdateDesign());
      //@ts-ignore
      dispatch(getAllDesignsFn());
      setIsOpen(false);
    }

    if (updateDesign?.isError) {
      toast.error(updateDesign?.message || "Failed to update design", {
        id: toastId,
      });
    }
  }, [
    updateDesign?.isError,
    updateDesign?.message,
    updateDesign?.isSuccess,
    dispatch,
  ]);

  // ✅ Count active existing images
  const activeExistingImagesCount = existingImages.filter(
    (img) => !img.isMarkedForDeletion
  ).length;

  const totalImagesCount = activeExistingImagesCount + newImages.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Products</DialogTitle>
          <DialogDescription>
            Update the design details, images, and component option prices.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 overflow-y-auto pr-2"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter design title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="pl-7"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="design-slug"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the title
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <TiptapEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter design description with rich formatting..."
            />
            {description && (
              <div className="text-xs text-muted-foreground mt-2">
                Character count: {description.replace(/<[^>]*>/g, "").length}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPrintable"
              checked={isPrintable}
              onCheckedChange={setIsPrintable}
            />
            <Label htmlFor="isPrintable">Design is printable</Label>
          </div>

          {/* ✅ Enhanced Images Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <Label>Design Images</Label>
                <Badge variant="outline" className="ml-2">
                  {totalImagesCount} total
                </Badge>
              </div>
              {imagesToDelete.length > 0 && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  {imagesToDelete.length} to delete
                </Badge>
              )}
            </div>

            {/* ✅ Existing Images with Delete Functionality */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Existing Images ({activeExistingImagesCount} active)
                  </Label>
                  {imagesToDelete.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setExistingImages((prev) =>
                          prev.map((img) => ({
                            ...img,
                            isMarkedForDeletion: false,
                          }))
                        );
                        setImagesToDelete([]);
                      }}
                      className="text-xs"
                    >
                      Restore All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        image.isMarkedForDeletion
                          ? "border-red-400 opacity-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="relative w-full h-32">
                        <img
                          src={image.url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay for marked deletion */}
                        {image.isMarkedForDeletion && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                            <div className="bg-white rounded-full p-2">
                              <Trash2 className="h-6 w-6 text-red-500" />
                            </div>
                          </div>
                        )}

                        {/* Action Overlay */}
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2">
                          {image.isMarkedForDeletion ? (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => restoreExistingImage(image.url)}
                            >
                              Restore
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() =>
                                toggleExistingImageDeletion(image.url)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant={
                            image.isMarkedForDeletion
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {image.isMarkedForDeletion ? "To Delete" : "Existing"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning if all images will be deleted */}
            {totalImagesCount === 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  No images will remain. Consider adding at least one image.
                </p>
              </div>
            )}

            {/* Add New Images */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Add New Images{" "}
                {newImages.length > 0 && `(${newImages.length} selected)`}
              </Label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        new images
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB (multiple files supported)
                      </p>
                    </div>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {newImagePreviews.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {newImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-green-200">
                            <img
                              src={preview}
                              alt={`New ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => removeNewImage(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* New Badge */}
                            <div className="absolute top-2 left-2">
                              <Badge
                                variant="default"
                                className="text-xs bg-green-500"
                              >
                                New
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {newImages[index]?.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center">
                      <label
                        htmlFor="images-add"
                        className="cursor-pointer text-sm text-primary hover:underline flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add more images
                      </label>
                      <Input
                        id="images-add"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Components Section - Update extraPrice */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <Label>Product Components - Extra Prices</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" type="button">
                    <Info className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      About Component Extra Prices
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Select component options and set their extra prices. The
                      extra price will be added when customers select this
                      option.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {componentTypes.isLoading ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  Loading component types...
                </p>
              </div>
            ) : Array.isArray(componentTypes.data) &&
              componentTypes.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {componentTypes.data.map((type: any) => (
                  <div
                    key={type.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{type.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {type.options?.length || 0} options
                      </Badge>
                    </div>

                    {type.options && type.options.length > 0 ? (
                      <div className="space-y-2">
                        {type.options.map((option: any) => {
                          const isSelected = selectedComponents.some(
                            (c) => c.optionId === option.id
                          );
                          const componentData = selectedComponents.find(
                            (c) => c.optionId === option.id
                          );

                          return (
                            <div
                              key={option.id}
                              className={`flex items-start space-x-2 p-2 rounded transition-colors ${
                                isSelected
                                  ? "bg-blue-50 border border-blue-200"
                                  : "hover:bg-muted/50"
                              }`}
                            >
                              <Checkbox
                                id={`update-option-${option.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleComponentToggle(option.id, !!checked)
                                }
                              />
                              <div className="flex-1 space-y-2">
                                <Label
                                  htmlFor={`update-option-${option.id}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {option.value}
                                </Label>

                                {isSelected && (
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      placeholder="Extra price for this option"
                                      value={componentData?.extraPrice || ""}
                                      onChange={(e) =>
                                        handleExtraPriceChange(
                                          option.id,
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No options available for this type
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border rounded-lg bg-muted/20">
                <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No component types found.
                </p>
              </div>
            )}

            {/* Selected Components Summary */}
            {selectedComponents.length > 0 && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Selected Components ({selectedComponents.length})
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedComponents.map((comp) => {
                      const details = getOptionDetails(comp.optionId);
                      return (
                        <Badge
                          key={comp.optionId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <span>
                            {details?.typeName || "Unknown"}:{" "}
                            {details?.option?.value || `ID ${comp.optionId}`}
                          </span>
                          <span className="font-bold text-green-600">
                            +${comp.extraPrice.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedComponents(
                                selectedComponents.filter(
                                  (c) => c.optionId !== comp.optionId
                                )
                              )
                            }
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateDesign?.isLoading}>
              {updateDesign?.isLoading ? "Updating..." : "Update Design"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

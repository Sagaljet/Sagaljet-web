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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDesignCategoriesFn } from "@/redux/slices/design-category/GetDesignCategories";
import type { RootState } from "@/redux/store";
import {
  PlusCircle,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Package,
  Info,
  DollarSign,
  Calculator,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  createDesignFn,
  resetCreateDesign,
} from "@/redux/slices/product/createDesign";
import { getDesignsFn } from "@/redux/slices/product/get-designs";
import { getComponentTypesFn } from "@/redux/slices/component/getComponentTypes";

interface Feature {
  name: string;
  value: string;
  extraCost: number;
}

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

interface SelectedComponent {
  optionId: number;
  extraPrice: number;
}

// ✅ Categories that don't require components and have $0 price
const SPECIAL_CATEGORIES = ["Books and Publications", "Services"];

const CreateDesignDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryDesignId, setCategoryDesignId] = useState("");
  const [isPrintable, setIsPrintable] = useState(true);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<
    SelectedComponent[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createDesign = useSelector((state: RootState) => state.createDesign);
  const categories = useSelector((state: RootState) => state.getCategoryDesign);
  const componentTypes = useSelector(
    (state: RootState) => state.getComponentTypes
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(getDesignCategoriesFn());
    // @ts-ignore
    dispatch(getComponentTypesFn());
  }, [dispatch]);

  const isSpecialCategory = useMemo(() => {
    if (!categoryDesignId || !Array.isArray(categories.data)) return false;
    const selectedCategory = categories.data.find(
      (cat: any) => cat.id.toString() === categoryDesignId
    );
    return selectedCategory
    // @ts-ignore
      ? SPECIAL_CATEGORIES.includes(selectedCategory.name)
      : false;
  }, [categoryDesignId, categories.data]);

  // ✅ Get the selected category name for display purposes
  const selectedCategoryName = useMemo(() => {
    if (!categoryDesignId || !Array.isArray(categories.data)) return "";
    const selectedCategory = categories.data.find(
      (cat: any) => cat.id.toString() === categoryDesignId
    );
    // @ts-ignore
    return selectedCategory?.name || "";
  }, [categoryDesignId, categories.data]);

  // ✅ Check specific category types for icons/styling
  const isBookCategory = selectedCategoryName === "Books and Publications";
  const isServiceCategory = selectedCategoryName === "Services";

  // ✅ Clear selected components when switching to special categories
  useEffect(() => {
    if (isSpecialCategory) {
      setSelectedComponents([]);
    }
  }, [isSpecialCategory]);

  // ✅ Calculate total price - 0 for special categories, sum of components for others
  const calculatedPrice = useMemo(() => {
    if (isSpecialCategory) {
      return 0;
    }
    return selectedComponents.reduce(
      (total, comp) => total + (comp.extraPrice || 0),
      0
    );
  }, [selectedComponents, isSpecialCategory]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      addImages(Array.from(files));
    }
  };

  const addImages = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    const newPreviews: ImagePreview[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (id: string) => {
    setImagePreviews((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // ✅ Handle category change
  const handleCategoryChange = (value: string) => {
    setCategoryDesignId(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imagePreviews.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    // ✅ Only require components if NOT a special category
    if (!isSpecialCategory && selectedComponents.length === 0) {
      toast.error("Please select at least one component option");
      return;
    }

    const data = {
      title,
      description,
      price: calculatedPrice,
      categoryDesignId,
      isPrintable,
      images: imagePreviews.map((img) => img.file),
      features: features.filter((f) => f.name && f.value),
      components: isSpecialCategory ? [] : selectedComponents, // ✅ Empty array for special categories
    };

    // @ts-ignore
    dispatch(createDesignFn(data));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategoryDesignId("");
    setIsPrintable(true);
    setFeatures([]);
    setSelectedComponents([]);
    imagePreviews.forEach((img) => URL.revokeObjectURL(img.preview));
    setImagePreviews([]);
  };

  const toastId = "createDesign";

  useEffect(() => {
    if (createDesign?.isSuccess) {
      toast.success("Design created successfully", { id: toastId });
      // @ts-ignore
      dispatch(getDesignsFn());
      setIsOpen(false);
      dispatch(resetCreateDesign());
      resetForm();
    }

    if (createDesign?.isError) {
      toast.error(createDesign?.message || "Error creating design", {
        id: toastId,
      });
    }
  }, [
    createDesign?.isError,
    createDesign?.message,
    createDesign?.isSuccess,
    dispatch,
  ]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  // ✅ Helper function to get category-specific info
  const getCategoryInfo = () => {
    if (isBookCategory) {
      return {
        icon: <BookOpen className="h-5 w-5" />,
        title: "Books and Publications",
        description:
          "This category has a default price of $0 and does not require component selection.",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        descColor: "text-blue-600",
      };
    }
    if (isServiceCategory) {
      return {
        icon: <Briefcase className="h-5 w-5" />,
        title: "Services",
        description:
          "Service products have a default price of $0 and do not require component selection. Pricing will be determined per request.",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        descColor: "text-purple-600",
      };
    }
    return null;
  };

  const categoryInfo = getCategoryInfo();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button asChild>
          <Link to="">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Product
          </Link>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new Product.
            {isSpecialCategory
              ? ` ${selectedCategoryName} products have a default price of $0.`
              : " Price is calculated from selected component options."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="category">Category *</Label>
              <Select
                value={categoryDesignId}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(categories.data) &&
                    categories.data.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ✅ Show notice for Special categories (Books or Services) */}
          {isSpecialCategory && categoryInfo && (
            <div
              className={`p-4 ${categoryInfo.bgColor} border ${categoryInfo.borderColor} rounded-lg`}
            >
              <div
                className={`flex items-center gap-2 ${categoryInfo.textColor}`}
              >
                {categoryInfo.icon}
                <p className="text-sm font-medium">
                  {categoryInfo.title} Category Selected
                </p>
              </div>
              <p className={`text-xs ${categoryInfo.descColor} mt-1`}>
                {categoryInfo.description}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter design description"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPrintable"
              checked={isPrintable}
              onCheckedChange={(checked) => setIsPrintable(!!checked)}
            />
            <Label
              htmlFor="isPrintable"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Printable
            </Label>
          </div>

          {/* Enhanced Multi-Image Upload */}
          <div className="space-y-4">
            <Label>Images *</Label>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreviews.length === 0 ? (
              <div
                onClick={openFileDialog}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold text-primary">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB (Multiple files supported)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((image) => (
                    <div
                      key={image.id}
                      className="relative group aspect-square"
                    >
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                        {image.file.name}
                      </div>
                    </div>
                  ))}

                  <div
                    onClick={openFileDialog}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-primary hover:bg-gray-50"
                    }`}
                  >
                    <Plus className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Add more</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {imagePreviews.length}{" "}
                    {imagePreviews.length === 1 ? "image" : "images"} selected
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      imagePreviews.forEach((img) =>
                        URL.revokeObjectURL(img.preview)
                      );
                      setImagePreviews([]);
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Product Components Section - HIDDEN for Special categories (Books and Services) */}
          {!isSpecialCategory && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <Label>Product Components *</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">About Components</h4>
                      <p className="text-xs text-muted-foreground">
                        Select component options and set their prices. The total
                        product price will be calculated based on the prices you
                        set for each option. Customers will see these options
                        when ordering.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {Array.isArray(componentTypes.data) &&
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
                                  id={`option-${option.id}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedComponents([
                                        ...selectedComponents,
                                        { optionId: option.id, extraPrice: 0 },
                                      ]);
                                    } else {
                                      setSelectedComponents(
                                        selectedComponents.filter(
                                          (c) => c.optionId !== option.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <div className="flex-1 space-y-2">
                                  <Label
                                    htmlFor={`option-${option.id}`}
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
                                        placeholder="Set price for this option"
                                        value={componentData?.extraPrice || ""}
                                        onChange={(e) => {
                                          const newPrice =
                                            parseFloat(e.target.value) || 0;
                                          setSelectedComponents(
                                            selectedComponents.map((c) =>
                                              c.optionId === option.id
                                                ? { ...c, extraPrice: newPrice }
                                                : c
                                            )
                                          );
                                        }}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Create component types and options first to use this
                    feature.
                  </p>
                </div>
              )}

              {/* Selected Components Summary with Price Calculation */}
              {selectedComponents.length > 0 && (
                <Card className="p-4 from-blue-50 to-green-50 border-blue-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-medium">
                        Selected Components ({selectedComponents.length})
                      </p>
                    </div>

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
                              {details?.typeName}: {details?.option?.value}
                            </span>
                            <span className="font-bold text-green-600">
                              ${comp.extraPrice.toFixed(2)}
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

                    {/* Total Price Display */}
                    <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                      <span className="text-sm font-medium text-gray-700">
                        Total Product Price:
                      </span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {calculatedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {calculatedPrice === 0 && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Set prices for selected options to calculate total
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {selectedComponents.length === 0 && (
                <p className="text-sm text-amber-600 flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                  <Info className="h-4 w-4" />
                  Please select at least one component option to create a
                  product
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            {/* ✅ Price Preview - Show different info for special categories */}
            <div className="flex items-center gap-2 text-sm">
              {!isSpecialCategory && (
                <>
                  <span className="text-gray-500">Product Price:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${calculatedPrice.toFixed(2)}
                  </span>
                </>
              )}
              {isBookCategory && (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <BookOpen className="h-3 w-3" />
                  Book (Free)
                </Badge>
              )}
              {isServiceCategory && (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200"
                >
                  <Briefcase className="h-3 w-3" />
                  Service (Price on Request)
                </Badge>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createDesign.isLoading ||
                  (!isSpecialCategory && selectedComponents.length === 0)
                }
              >
                {createDesign.isLoading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDesignDialog;
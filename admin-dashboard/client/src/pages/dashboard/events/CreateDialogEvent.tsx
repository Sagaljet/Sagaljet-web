"use client";

import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  createEventFn,
  resetCreateEvent,
} from "@/redux/slices/event/createEvent";
import { getEventsFn } from "@/redux/slices/event/get-events";
import type { AppDispatch, RootState } from "@/redux/store";
import { format } from "date-fns";
import {
  CalendarIcon,
  GripVertical,
  Link as LinkIcon,
  PlusCircle,
  Upload,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
}

// ============== COMPONENT ==============
export default function CreateEventDialog() {
  const dispatch = useDispatch<AppDispatch>();
  const createEvent = useSelector((state: RootState) => state.createEvent);

  // Form state
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [client, setClient] = useState("");
  const [startAt, setStartAt] = useState<Date | undefined>(undefined);
  const [endAt, setEndAt] = useState<Date | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);

  // Multiple images state
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // ============== IMAGE HANDLERS ==============

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const maxFiles = 10;
      const maxSize = 10 * 1024 * 1024; // 10MB

      Array.from(files).forEach((file) => {
        // Validate file count
        if (images.length >= maxFiles) {
          toast.error(`Maximum ${maxFiles} images allowed`);
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          return;
        }

        // Validate file size
        if (file.size > maxSize) {
          toast.error(`${file.name} exceeds 10MB limit`);
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: ImagePreview = {
            id: generateId(),
            file,
            preview: reader.result as string,
          };
          setImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      e.target.value = "";
    },
    [images.length]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const removeAllImages = useCallback(() => {
    setImages([]);
  }, []);

  // Drag and drop for reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // ============== URL VALIDATION ==============
  const isValidUrl = (urlString: string): boolean => {
    if (!urlString) return true;
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  // ============== FORM HANDLERS ==============

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setLocation("");
    setLink("");
    setClient("");
    setStartAt(undefined);
    setEndAt(undefined);
    setIsActive(true);
    setImages([]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    if (!startAt) {
      toast.error("Please select a start date");
      return;
    }

    if (endAt && endAt < startAt) {
      toast.error("End date must be after start date");
      return;
    }

    if (link && !isValidUrl(link)) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Prepare data
    const eventData = {
      title: title.trim(),
      description: description || undefined,
      location: location.trim() || undefined,
      link: link.trim() || undefined,
      client: client.trim() || undefined,
      startAt: startAt.toISOString(),
      endAt: endAt?.toISOString() || undefined,
      isActive,
      images: images.map((img) => img.file), // Extract File objects
    };

    console.log("Submitting event:", {
      ...eventData,
      images: `${eventData.images.length} files`,
    });

    dispatch(createEventFn(eventData));
  };

  // ============== EFFECTS ==============

  useEffect(() => {
    if (createEvent.isSuccess) {
      toast.success("Event created successfully!");
      dispatch(resetCreateEvent());
      dispatch(getEventsFn() as any);
      resetForm();
      setIsOpen(false);
    }

    if (createEvent.isError) {
      toast.error(createEvent.message || "Failed to create event");
    }
  }, [
    createEvent.isSuccess,
    createEvent.isError,
    createEvent.message,
    dispatch,
    resetForm,
  ]);

  // ============== RENDER ==============

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] md:max-w-[650px] lg:max-w-[750px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 overflow-y-auto pr-2 py-2"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
              className="h-10"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <TiptapEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter event description..."
            />
            {description && (
              <p className="text-xs text-muted-foreground">
                {description.replace(/<[^>]*>/g, "").length} characters
              </p>
            )}
          </div>

          {/* Client & Link Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="text-sm font-medium">
                Client
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Client name"
                  className="pl-10 h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm font-medium">
                Event Link
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location"
              className="h-10"
            />
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal",
                      !startAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startAt ? format(startAt, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startAt}
                    onSelect={setStartAt}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal",
                      !endAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endAt ? format(endAt, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endAt}
                    onSelect={setEndAt}
                    initialFocus
                    disabled={(date) => (startAt ? date < startAt : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Multiple Images Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Event Images</Label>
              {images.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {images.length}/10 images
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAllImages}
                    className="h-7 text-xs text-destructive hover:text-destructive"
                  >
                    Remove all
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <label
              htmlFor="images"
              className={cn(
                "flex flex-col items-center justify-center w-full h-32",
                "border-2 border-dashed rounded-lg cursor-pointer",
                "bg-muted/30 hover:bg-muted/50 transition-colors",
                "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
            >
              <div className="flex flex-col items-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB each (max 10 files)
                </p>
              </div>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "relative group aspect-square rounded-lg overflow-hidden",
                      "border-2 cursor-move transition-all",
                      draggedIndex === index
                        ? "border-primary opacity-50 scale-95"
                        : "border-transparent hover:border-primary/50"
                    )}
                  >
                    {/* Primary Badge */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1 z-10 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                        Primary
                      </div>
                    )}

                    {/* Drag Handle */}
                    <div className="absolute top-1 right-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/60 rounded p-0.5">
                        <GripVertical className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive rounded p-0.5"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>

                    {/* Image */}
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* File Name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate">
                      {image.file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reorder Hint */}
            {images.length > 1 && (
              <p className="text-xs text-muted-foreground text-center">
                💡 Drag images to reorder. First image is the primary image.
              </p>
            )}
          </div>

          {/* Active Switch */}
          <div className="flex items-center gap-3 py-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive" className="text-sm cursor-pointer">
              Event is active
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEvent.isLoading}
              className="min-w-[120px]"
            >
              {createEvent.isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

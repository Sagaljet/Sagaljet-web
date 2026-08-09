"use client";

import type React from "react";

import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { cn } from "@/lib/utils";
import {
  createProjectFn,
  resetCreateProject,
} from "@/redux/slices/projects/CreateProject";
import { getProjectFn } from "@/redux/slices/projects/GetProject";
import { Check, ChevronsUpDown, PlusCircle, X, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { TiptapEditor } from "@/components/tiptap-editor";
import type { RootState } from "@/redux/store";

export default function CreateDialogProject({ categories }: any) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const createProject = useSelector((state: RootState) => state.createProject);

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [createAt, setCreateAt] = useState("");
  const [client, setClient] = useState("");

  // Multiple images state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleMultipleImageChange = (e: any) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Limit to 10 images maximum
    const maxImages = 10;
    const currentImageCount = images.length;
    const availableSlots = maxImages - currentImageCount;

    if (availableSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToAdd = files.slice(0, availableSlots);

    // Add new files to existing images
    //@ts-ignore
    setImages((prev) => [...prev, ...filesToAdd]);

    // Generate previews for new files
    filesToAdd.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        setImagePreviews((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: reader.result,
            file: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    e.target.value = "";
  };

  const removeImage = (indexToRemove: any) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDate = dayjs(createAt).toISOString().split(".")[0] + "Z";

    const data = {
      client,
      name,
      description,
      imageUrl: images,
      industry,
      link: url,
      categoryId: selectedCategory,
      createAt: formattedDate,
    };
    //@ts-ignore
    dispatch(createProjectFn(data));
    //@ts-ignore
    dispatch(getProjectFn());
    setIsOpen(false);
  };

  const toastId = "Created Successfully...";

  const resetForm = () => {
    setImages([]);
    setImagePreviews([]);
    setClient("");
    setUrl("");
    setDescription("");
    setCreateAt("");
    setName("");
    setSelectedCategory("");
  };

  useEffect(() => {
    if (createProject?.isSuccess) {
      toast.success("Project created successfully!", { id: toastId });
      dispatch(resetCreateProject());
      //@ts-ignore
      dispatch(getProjectFn());
      resetForm();
      setIsOpen(false);
    }

    if (createProject?.isError) {
      toast.error(createProject?.message, { id: toastId });
    }
  }, [
    createProject?.isError,
    createProject?.message,
    createProject?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 overflow-y-auto pr-2"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <TiptapEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter project description with rich formatting..."
            />
            {description && (
              <div className="text-xs text-muted-foreground mt-2">
                Character count: {description.replace(/<[^>]*>/g, "").length}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images ({images.length}/10)</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>{" "}
                      multiple images
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB each (Max 10 images)
                    </p>
                  </div>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview: any, index: any) => (
                    <div key={preview.id} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                        <img
                          src={preview.url || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
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
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {/* @ts-ignore */}
                        {images[index]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Project URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="createAt">Creation Date</Label>
            <Input
              id="createAt"
              type="date"
              value={createAt}
              onChange={(e) => setCreateAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selectedCategory && "text-muted-foreground"
                  )}
                >
                  {selectedCategory
                    ? categories?.find(
                        (category: any) => category.id === selectedCategory
                      )?.name
                    : "Select Category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandList>
                    <CommandEmpty>No Category found.</CommandEmpty>
                    <CommandGroup>
                      {categories?.map((category: any) => (
                        <CommandItem
                          value={category.id}
                          key={category.name}
                          onSelect={() => setSelectedCategory(category.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              category.id === selectedCategory
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Enter industry name"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
            <Button type="submit" disabled={createProject?.isLoading}>
              {createProject?.isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

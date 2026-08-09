"use client";

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
import { createLogoFn, resetcreateLogo } from "@/redux/slices/logo/CreateLogo";
import { getLogoFn } from "@/redux/slices/logo/GetLogo";
import { PlusCircle, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function CreateLogoDialog() {
  const createLogo = useSelector((state) => state.createLogo);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ffffff"); // Default white background
  const [imageUrl, setLogoUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Predefined color options
  const colorOptions = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#10b981" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Orange", value: "#f97316" },
    { name: "Pink", value: "#ec4899" },
    { name: "Gray", value: "#6b7280" },
    { name: "Yellow", value: "#eab308" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name,
      description,
      color,
      imageUrl,
    };

    dispatch(createLogoFn(data));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor("#ffffff");
    setLogoUrl(null);
    setImagePreview(null);
  };

  const toastId = "createLogo";

  useEffect(() => {
    if (createLogo?.isSuccess) {
      toast.success("Logo created successfully!", { id: toastId });
      dispatch(getLogoFn());
      dispatch(resetcreateLogo());
      resetForm();
      setIsOpen(false);
    }

    if (createLogo?.isError) {
      toast.error(createLogo?.message || "Failed to create logo", {
        id: toastId,
      });
    }
  }, [
    createLogo?.isError,
    createLogo?.message,
    createLogo?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Logo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Logo</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new logo with background color.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Logo Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter logo name (e.g., Company Logo, Brand Mark)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the logo, its purpose, or design elements"
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Background Color</span>
            </Label>

            {/* Color Picker Input */}
            <div className="flex items-center space-x-4">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 p-1 border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>

            {/* Predefined Color Options */}
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`w-full h-10 rounded border-2 transition-all hover:scale-105 ${
                    color === colorOption.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                >
                  {color === colorOption.value && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          colorOption.value === "#ffffff" ||
                          colorOption.value === "#eab308"
                            ? "bg-black"
                            : "bg-white"
                        }`}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Logo Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              required
            />
          </div>

          {imagePreview && (
            <div className="space-y-2">
              <Label>Logo Preview</Label>
              <div className="relative w-full rounded-lg overflow-hidden border">
                {/* Preview with selected background color */}
                <div
                  className="w-full h-48 flex items-center justify-center p-4"
                  style={{ backgroundColor: color }}
                >
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Background: {color}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => {
                    setLogoUrl(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

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
            <Button
              type="submit"
              disabled={
                createLogo?.isLoading ||
                !name.trim() ||
                !description.trim() ||
                !imageUrl
              }
            >
              {createLogo?.isLoading ? "Creating..." : "Create Logo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

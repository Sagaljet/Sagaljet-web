// src/components/OrderDesign/CreateOrderDesignDialog.tsx

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";
import type { AppDispatch, RootState } from "@/redux/store";
import type { PostType } from "@/redux/types/orderDesign";
import { getPostTypesFn } from "@/redux/slices/orderDesign/getPostTypes";
import {
  createOrderDesignFn,
  resetCreateOrderDesign,
} from "@/redux/slices/orderDesign/createOrderDesign";
import { Dialog } from "@/components/ui/dialog";

interface CreateOrderDesignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormDataState {
  title: string;
  price: string;
  size: string;
  postType: PostType;
  description: string;
}

const initialFormData: FormDataState = {
  title: "",
  price: "",
  size: "",
  postType: "FACEBOOK_POST",
  description: "",
};

const CreateOrderDesignDialog: React.FC<CreateOrderDesignDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redux state
  const {
    isLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state: RootState) => state.createOrderDesign);

  const { data: postTypes } = useSelector(
    (state: RootState) => state.getPostTypes
  );

  // Form state
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch post types
  useEffect(() => {
    if (postTypes.length === 0) {
      dispatch(getPostTypesFn());
    }
  }, [dispatch, postTypes.length]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  // Handle success/error
  useEffect(() => {
    if (isSuccess) {
      toast.success(message || "Order design created successfully");
      dispatch(resetCreateOrderDesign());
      handleClose();
      onSuccess();
    }
    if (isError) {
      toast.error(message);
      dispatch(resetCreateOrderDesign());
    }
  }, [isSuccess, isError, message, dispatch, onSuccess]);

  const handleClose = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Valid price is required");
      return;
    }

    const submitData = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      size: formData.size.trim() || undefined,
      postType: formData.postType,
      description: formData.description.trim() || undefined,
      image: imageFile || undefined,
    };

    dispatch(createOrderDesignFn(submitData));
  };

  return (
    <Dialog
      // isOpen={isOpen}
      // onClose={handleClose}
      // title="Create New Order Design"
      // size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        {/* Price and Size Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="e.g., 1080x1080"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Post Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Type
          </label>
          <select
            name="postType"
            value={formData.postType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            {postTypes.length > 0 ? (
              postTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))
            ) : (
              <>
                <option value="FACEBOOK_POST">Facebook Post</option>
                <option value="INSTAGRAM_POST">Instagram Post</option>
                <option value="INSTAGRAM_STORY">Instagram Story</option>
                <option value="TIKTOK">Tiktok</option>
                <option value="YOUTUBE_THUMBNAIL">Youtube Thumbnail</option>
                <option value="TWITTER">Twitter</option>
                <option value="LINKEDIN">Linkedin</option>
                <option value="OTHER">Other</option>
              </>
            )}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description..."
            rows={3}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>

          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-xs h-48 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 min-w-[100px]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </span>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateOrderDesignDialog;
"use client";

import type React from "react";

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
import { createBlogFn, resetcreateBlog } from "@/redux/slices/blog/CreateBlog";
import { getBlogFn } from "@/redux/slices/blog/GetBlog";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import TiptapEditor from "./tiptap-editor";

export default function CreateBlogDialog() {
  const createBlog = useSelector((state: RootState) => state.createBlog);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      content,
      author,
      image,
    };

    //@ts-ignore
    dispatch(createBlogFn(data));
  };

  const resetForm = () => {
    setImagePreview(null);
    setImage(null);
    setAuthor("");
    setTitle("");
    setContent("");
  };

  const toastId = "Created Successfully...";

  useEffect(() => {
    if (createBlog?.isSuccess) {
      toast.success("Blog created successfully!", { id: toastId });
      dispatch(resetcreateBlog());
      //@ts-ignore
      dispatch(getBlogFn());
      resetForm();
      setIsOpen(false);
    }

    if (createBlog?.isError) {
      toast.error(createBlog?.message || "Failed to create blog", {
        id: toastId,
      });
    }
  }, [
    createBlog?.isError,
    createBlog?.message,
    createBlog?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[700px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Write your blog content here..."
            />
            {content && (
              <div className="text-sm text-muted-foreground">
                Word count:{" "}
                {
                  content
                    .replace(/<[^>]*>/g, "")
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          {imagePreview && (
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Blog image preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImage(null);
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
                createBlog?.isLoading ||
                !title.trim() ||
                !content.trim() ||
                !author.trim()
              }
            >
              {createBlog?.isLoading ? "Creating..." : "Create Blog"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

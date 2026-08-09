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
import { Textarea } from "@/components/ui/textarea";
import { getBlogFn } from "@/redux/slices/blog/GetBlog";
import { resetupdateBlog, updateBlogFn } from "@/redux/slices/blog/UpdateBlog";
import type { RootState } from "@/redux/store";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UpdateBlogDialog({ blog }: any) {
  const updateBlog = useSelector((state: RootState) => state.updateBlog);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [image, setImage] = useState(blog?.image || null);
  const [author, setAuthor] = useState(blog?.author || null);

  const [imagePreview, setImagePreview] = useState(blog?.imageUrl || null);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const data = {
      id: +blog.id,
      title,
      content,
      image,
      author,
    };
    //@ts-ignore
    dispatch(updateBlogFn(data));
  };

  const toastId = "toastUpdate";

  useEffect(() => {
    if (updateBlog?.isSuccess) {
      toast.success("success", { id: toastId });
      //@ts-ignore
      dispatch(getBlogFn());
      setIsOpen(false);
      dispatch(resetupdateBlog());
    }
    if (updateBlog?.isError) {
      toast.error(updateBlog?.message, { id: toastId });
    }
  }, [
    updateBlog?.isError,
    updateBlog?.message,
    updateBlog?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" asChild>
          <Link to={""}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>update Blog</DialogTitle>
          {/* <DialogDescription>
            Fill in the details to create a new blog.
          </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            {/* <Label htmlFor="name">Name</Label> */}
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>
          <div className="space-y-2">
            {/* <Label htmlFor="name">Name</Label> */}
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter blog author name"
              required
            />
          </div>
          <div className="space-y-2">
            {/* <Label htmlFor="description">Description</Label> */}
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter blog description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              //   className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="blog image preview"
                className="rounded-lg object-cover bg-center bg-no-repeat"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update blog</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

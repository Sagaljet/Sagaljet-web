import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getBlogFn } from "@/redux/slices/blog/GetBlog";
import { deleteBlogFn, deleteBlogReset } from "@/redux/slices/blog/DeleteBlog";
import type { RootState } from "@/redux/store";

export default function DeleteBlogDialog({ blog }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteBlog = useSelector((state: RootState) => state.deleteBlog);

  const dispatch = useDispatch();

  const deleteHandle = () => {
    // @ts-ignore
    dispatch(deleteBlogFn(blog));
    setIsOpen(false);
  };

  const toastId = "projectId";

  useEffect(() => {
    if (deleteBlog.isSuccess) {
      toast.success("deleted successfully...", { id: toastId });
    }
    // @ts-ignore
    dispatch(getBlogFn());
    dispatch(deleteBlogReset());
    setIsOpen(false);
  }, [
    deleteBlog?.isError,
    deleteBlog?.message,
    deleteBlog?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={deleteHandle}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

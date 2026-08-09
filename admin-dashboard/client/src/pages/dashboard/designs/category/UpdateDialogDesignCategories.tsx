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
import { getCategoryFn } from "@/redux/slices/category/GetCategory"; // Hubi in import-kan sax yahay
import {
  resetUpdateCategoryDesign,
  updateDesignCategoryFn,
} from "@/redux/slices/design-category/UpdateDesignCategories";
import type { RootState } from "@/redux/store";
import { Pencil, Loader2 } from "lucide-react"; // Waxaan ku daray Loader2 icon
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const UpdateDialogCategoryDesign = ({ category }: any) => {
  const dispatch = useDispatch();

  // State-ka Redux
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.updateCategoryDesign // Hubi in magacan 'updateCategoryDesign' uu sax ku yahay store.ts
  );

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(category.name || "");
  const [description, setDescription] = useState(category.description || "");

  // Update local state when category prop changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setName(category.name || "");
      setDescription(category.description || "");
    }
  }, [isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCategory = { id: category.id, name, description };

    //@ts-ignore
    dispatch(updateDesignCategoryFn(updatedCategory));
  };

  const toastId = "toastId";

  useEffect(() => {
    if (isSuccess) {
      toast.success("Category updated successfully", { id: toastId });
      setIsOpen(false); // Halkan ka xir marka uu guuleysto
      dispatch(resetUpdateCategoryDesign());
      //@ts-ignore
      dispatch(getCategoryFn()); // Refresh list
    }

    if (isError) {
      toast.error(message || "Something went wrong");
      dispatch(resetUpdateCategoryDesign()); // Optional: Clear error state so user can try again
    }
  }, [isSuccess, isError, message, dispatch]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details of the category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
              disabled={isLoading} // Disable when loading
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              required
              disabled={isLoading} // Disable when loading
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialogCategoryDesign;

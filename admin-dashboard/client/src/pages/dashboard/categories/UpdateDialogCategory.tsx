import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { getCategoryFn } from "@/redux/slices/category/GetCategory";
import {
  resetUpdateCategory,
  updateCategoryFn,
} from "@/redux/slices/category/UpdateCategory";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import type { RootState } from "@/redux/store";

const UpdateDialogCategory = ({ category }: any) => {
  const updateCategory = useSelector(
    (state: RootState) => state.updateCategory
  );
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(category.name || "");
  const [description, setDescription] = useState(category.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCategory = { id: category.id, name, description };
    //@ts-ignore
    dispatch(updateCategoryFn(updatedCategory));
    setIsOpen(false);
  };

  useEffect(() => {
    if (updateCategory.isSuccess) {
      toast.success("Category updated successfully");
      dispatch(resetUpdateCategory());
      //@ts-ignore
      dispatch(getCategoryFn());
    }
    if (updateCategory.isError) {
      toast.error(updateCategory.message);
    }
  }, [updateCategory, dispatch]);

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
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialogCategory;

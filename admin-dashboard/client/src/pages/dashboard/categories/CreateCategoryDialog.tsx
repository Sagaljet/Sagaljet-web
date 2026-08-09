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
  createCategoryFn,
  resetCreateCategory,
} from "@/redux/slices/category/CreateCategory";
import { getCategoryFn } from "@/redux/slices/category/GetCategory";
import type { RootState } from "@/redux/store";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CreateCategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createClient = useSelector((state: RootState) => state.createCategory);
  const dispatch = useDispatch();

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();

    const data = {
      description,
      name,
    };

    //@ts-ignore
    dispatch(createCategoryFn(data));
  };

  const toastId = "toastsingIn";

  useEffect(() => {
    if (createClient?.isSuccess) {
      toast.success("success", { id: toastId });
      //@ts-ignore
      dispatch(getCategoryFn());
      setIsOpen(false);
      dispatch(resetCreateCategory());
      setDescription("");
      setName("");
    }

    if (createClient?.isError) {
      toast.error(createClient?.message, { id: toastId });
    }
  }, [
    createClient?.isError,
    createClient?.message,
    createClient?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button asChild>
          <Link to="">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Category
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new category.
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
            <Button type="submit">Create New Category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;

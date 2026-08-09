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
import {
  createComponentTypeFn,
  resetCreateComponentType,
} from "@/redux/slices/component/createComponentType";
import { getComponentTypesFn } from "@/redux/slices/component/getComponentTypes";
import type { RootState } from "@/redux/store";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const CreateComponentTypeDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const createComponentType = useSelector(
    (state: RootState) => state.createComponentType
  );
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Component type name is required");
      return;
    }

    // @ts-ignore
    dispatch(createComponentTypeFn({ name: name.trim() }));
  };

  const resetForm = () => {
    setName("");
  };

  const toastId = "createComponentType";

  useEffect(() => {
    if (createComponentType?.isSuccess) {
      toast.success("Component type created successfully", { id: toastId });
      // @ts-ignore
      dispatch(getComponentTypesFn());
      setIsOpen(false);
      dispatch(resetCreateComponentType());
      resetForm();
    }

    if (createComponentType?.isError) {
      toast.error(
        createComponentType?.message || "Error creating component type",
        { id: toastId }
      );
    }
  }, [
    createComponentType?.isError,
    createComponentType?.message,
    createComponentType?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Component Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Component Type</DialogTitle>
          <DialogDescription>
            Add a new component type (e.g., Size, Material, Finishing)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Type Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Size, Material, Color"
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
            <Button type="submit" disabled={createComponentType.isLoading}>
              {createComponentType.isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateComponentTypeDialog;

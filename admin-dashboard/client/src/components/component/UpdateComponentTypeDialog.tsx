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
import { getComponentTypesFn } from "@/redux/slices/component/getComponentTypes";
import {
  resetUpdateComponentType,
  updateComponentTypeFn,
} from "@/redux/slices/component/updateComponentType";
import type { RootState } from "@/redux/store";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function UpdateComponentTypeDialog({ componentType }: any) {
  const updateComponentType = useSelector(
    (state: RootState) => state.updateComponentType
  );
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(componentType.name || "");

  useEffect(() => {
    if (isOpen) {
      setName(componentType.name || "");
    }
  }, [isOpen, componentType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Component type name is required");
      return;
    }

    dispatch(
      // @ts-ignore
      updateComponentTypeFn({ id: componentType.id, name: name.trim() })
    );
  };

  const toastId = "update-component-type";

  useEffect(() => {
    if (updateComponentType?.isSuccess) {
      toast.success("Component type updated successfully!", { id: toastId });
      dispatch(resetUpdateComponentType());
      // @ts-ignore
      dispatch(getComponentTypesFn());
      setIsOpen(false);
    }

    if (updateComponentType?.isError) {
      toast.error(
        updateComponentType?.message || "Failed to update component type",
        { id: toastId }
      );
    }
  }, [
    updateComponentType?.isError,
    updateComponentType?.message,
    updateComponentType?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Component Type</DialogTitle>
          <DialogDescription>Update the component type name</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Type Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter component type name"
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
            <Button type="submit" disabled={updateComponentType?.isLoading}>
              {updateComponentType?.isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

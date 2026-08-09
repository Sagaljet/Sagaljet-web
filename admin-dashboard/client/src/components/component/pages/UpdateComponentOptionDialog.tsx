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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getComponentOptionsFn } from "@/redux/slices/component/getComponentOptions.slice";
import { resetUpdateComponentOption, updateComponentOptionFn } from "@/redux/slices/component/updateComponentOption.slice";
import type { RootState } from "@/redux/store";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function UpdateComponentOptionDialog({ componentOption }: any) {
  const updateComponentOption = useSelector(
    (state: RootState) => state.updateComponentOption
  );
  const componentTypes = useSelector(
    (state: RootState) => state.getComponentTypes
  );
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(componentOption.value || "");
  const [typeId, setTypeId] = useState(
    componentOption.typeId?.toString() || ""
  );

  useEffect(() => {
    if (isOpen) {
      setValue(componentOption.value || "");
      setTypeId(componentOption.typeId?.toString() || "");
    }
  }, [isOpen, componentOption]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      toast.error("Option value is required");
      return;
    }

    dispatch(
        // @ts-ignore
      updateComponentOptionFn({
        id: componentOption.id,
        value: value.trim(),
        typeId,
      })
    );
  };

  const toastId = "update-component-option";

  useEffect(() => {
    if (updateComponentOption?.isSuccess) {
      toast.success("Component option updated successfully!", { id: toastId });
      dispatch(resetUpdateComponentOption());
      // @ts-ignore
      dispatch(getComponentOptionsFn());
      setIsOpen(false);
    }

    if (updateComponentOption?.isError) {
      toast.error(
        updateComponentOption?.message || "Failed to update component option",
        { id: toastId }
      );
    }
  }, [
    updateComponentOption?.isError,
    updateComponentOption?.message,
    updateComponentOption?.isSuccess,
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
          <DialogTitle>Edit Component Option</DialogTitle>
          <DialogDescription>Update the component option details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="typeId">Component Type *</Label>
            <Select value={typeId} onValueChange={setTypeId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select component type" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(componentTypes.data) &&
                  componentTypes.data.map((type: any) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Option Value *</Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter option value"
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
            <Button type="submit" disabled={updateComponentOption?.isLoading}>
              {updateComponentOption?.isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
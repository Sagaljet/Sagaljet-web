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
import { createComponentOptionFn, resetCreateComponentOption } from "@/redux/slices/component/createComponentOption.slice";
import { getComponentOptionsFn } from "@/redux/slices/component/getComponentOptions.slice";
import type { RootState } from "@/redux/store";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
const CreateComponentOptionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [typeId, setTypeId] = useState("");

  const createComponentOption = useSelector(
    (state: RootState) => state.createComponentOption
  );
  const componentTypes = useSelector(
    (state: RootState) => state.getComponentTypes
  );
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      toast.error("Option value is required");
      return;
    }

    if (!typeId) {
      toast.error("Please select a component type");
      return;
    }

    // @ts-ignore
    dispatch(createComponentOptionFn({ value: value.trim(), typeId }));
  };

  const resetForm = () => {
    setValue("");
    setTypeId("");
  };

  const toastId = "createComponentOption";

  useEffect(() => {
    if (createComponentOption?.isSuccess) {
      toast.success("Component option created successfully", { id: toastId });
      // @ts-ignore
      dispatch(getComponentOptionsFn());
      setIsOpen(false);
      dispatch(resetCreateComponentOption());
      resetForm();
    }

    if (createComponentOption?.isError) {
      toast.error(
        createComponentOption?.message || "Error creating component option",
        { id: toastId }
      );
    }
  }, [
    createComponentOption?.isError,
    createComponentOption?.message,
    createComponentOption?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Component Option
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Component Option</DialogTitle>
          <DialogDescription>
            Add a new option for a component type (e.g., "Small" for Size)
          </DialogDescription>
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
              placeholder="e.g., Small, Matte, Wood"
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
            <Button type="submit" disabled={createComponentOption.isLoading}>
              {createComponentOption.isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateComponentOptionDialog;
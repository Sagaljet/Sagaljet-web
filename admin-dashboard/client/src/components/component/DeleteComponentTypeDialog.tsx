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
import type { RootState } from "@/redux/store";
import {
  deleteComponentTypeFn,
  resetDeleteComponentType,
} from "@/redux/slices/component/deleteComponentType.slice";
import { getComponentTypesFn } from "@/redux/slices/component/getComponentTypes";
export default function DeleteComponentTypeDialog({
  typeId,
  typeName,
  optionsCount,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteComponentType = useSelector(
    (state: RootState) => state.deleteComponentType
  );
  const dispatch = useDispatch();

  const handleDelete = () => {
    // @ts-ignore
    dispatch(deleteComponentTypeFn(typeId));
  };

  const toastId = "delete-component-type";

  useEffect(() => {
    if (deleteComponentType.isSuccess) {
      toast.success("Component type deleted successfully", { id: toastId });
      // @ts-ignore
      dispatch(getComponentTypesFn());
      dispatch(resetDeleteComponentType());
      setIsOpen(false);
    }

    if (deleteComponentType.isError) {
      toast.error(
        deleteComponentType.message || "Failed to delete component type",
        { id: toastId }
      );
    }
  }, [
    deleteComponentType?.isError,
    deleteComponentType?.message,
    deleteComponentType?.isSuccess,
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
            Are you sure you want to delete the component type "{typeName}"?
            {optionsCount > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                ⚠️ This type has {optionsCount} option(s). Delete them first.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteComponentType.isLoading || optionsCount > 0}
          >
            {deleteComponentType.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

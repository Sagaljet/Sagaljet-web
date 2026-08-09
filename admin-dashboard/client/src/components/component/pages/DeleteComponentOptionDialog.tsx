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
import { deleteComponentOptionFn, resetDeleteComponentOption } from "@/redux/slices/component/deleteComponentOption.slice";
import { getComponentOptionsFn } from "@/redux/slices/component/getComponentOptions.slice";

export default function DeleteComponentOptionDialog({
  optionId,
  optionValue,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteComponentOption = useSelector(
    (state: RootState) => state.deleteComponentOption
  );
  const dispatch = useDispatch();

  const handleDelete = () => {
    // @ts-ignore
    dispatch(deleteComponentOptionFn(optionId));
  };

  const toastId = "delete-component-option";

  useEffect(() => {
    if (deleteComponentOption.isSuccess) {
      toast.success("Component option deleted successfully", { id: toastId });
      // @ts-ignore
      dispatch(getComponentOptionsFn());
      dispatch(resetDeleteComponentOption());
      setIsOpen(false);
    }

    if (deleteComponentOption.isError) {
      toast.error(
        deleteComponentOption.message || "Failed to delete component option",
        { id: toastId }
      );
    }
  }, [
    deleteComponentOption?.isError,
    deleteComponentOption?.message,
    deleteComponentOption?.isSuccess,
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
            Are you sure you want to delete the option "{optionValue}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteComponentOption.isLoading}
          >
            {deleteComponentOption.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
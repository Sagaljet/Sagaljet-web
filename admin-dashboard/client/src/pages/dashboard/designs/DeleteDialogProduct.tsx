// DeleteDialogDesign.tsx

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
  deleteDesignFn,
  deleteDesignReset,
} from "../../../redux/slices/product/deleteDesign";
import { getDesignsFn } from "@/redux/slices/product/get-designs";

export default function DeleteDialogDesign({ designId, designTitle }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteDesign = useSelector((state: RootState) => state.deleteDesign);
  const dispatch = useDispatch();

  const handleDelete = () => {
    //@ts-ignore
    dispatch(deleteDesignFn(designId));
  };

  const toastId = "delete-design";

  useEffect(() => {
    if (deleteDesign.isSuccess) {
      toast.success("Design deleted successfully", { id: toastId });
      // @ts-ignore
      dispatch(getDesignsFn());
      dispatch(deleteDesignReset());
      setIsOpen(false);
    }

    if (deleteDesign.isError) {
      toast.error(deleteDesign.message || "Failed to delete design", {
        id: toastId,
      });
    }
  }, [
    deleteDesign?.isError,
    deleteDesign?.message,
    deleteDesign?.isSuccess,
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
            Are you sure you want to delete the design "{designTitle}"? This
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
            disabled={deleteDesign.isLoading}
          >
            {deleteDesign.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// components/banners/DeleteSideCardDialog.tsx

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
  deleteSideCardFn,
  deleteSideCardReset,
} from "@/redux/banner/deleteSideCardSlice";
import { getAllSideCardsFn } from "@/redux/banner/getSideCardsSlice";

export default function DeleteSideCardDialog({
  sideCardId,
  sideCardTitle,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteSideCard = useSelector(
    (state: RootState) => state.deleteSideCard
  );
  const dispatch = useDispatch();

  const handleDelete = () => {
    //@ts-ignore
    dispatch(deleteSideCardFn(sideCardId));
  };

  const toastId = "delete-sidecard";

  useEffect(() => {
    if (deleteSideCard.isSuccess) {
      toast.success("Side card deleted successfully", { id: toastId });
      // @ts-ignore
      dispatch(getAllSideCardsFn());
      dispatch(deleteSideCardReset());
      setIsOpen(false);
    }

    if (deleteSideCard.isError) {
      toast.error(deleteSideCard.message || "Failed to delete side card", {
        id: toastId,
      });
    }
  }, [
    deleteSideCard?.isError,
    deleteSideCard?.message,
    deleteSideCard?.isSuccess,
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
            Are you sure you want to delete the side card "{sideCardTitle}"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSideCard.isLoading}
          >
            {deleteSideCard.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

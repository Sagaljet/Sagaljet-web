"use client";

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
import { getLogoFn } from "@/redux/slices/logo/GetLogo";
import { deleteLogoFn, deleteLogoReset } from "@/redux/slices/logo/DeleteLogo";

export default function DeleteLogoDialog({ logos }) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteLogo = useSelector((state) => state.deleteLogo);
  const dispatch = useDispatch();

  const deleteHandle = () => {
    dispatch(deleteLogoFn(logos));
  };

  const toastId = "deleteLogo";

  useEffect(() => {
    if (deleteLogo?.isSuccess) {
      toast.success("Logo deleted successfully!", { id: toastId });
      dispatch(getLogoFn());
      dispatch(deleteLogoReset());
      setIsOpen(false);
    }

    if (deleteLogo?.isError) {
      toast.error(deleteLogo?.message || "Failed to delete logo", {
        id: toastId,
      });
    }
  }, [
    deleteLogo?.isError,
    deleteLogo?.message,
    deleteLogo?.isSuccess,
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
            Confirm Logo Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the logo "
            {logos?.name || "this logo"}"? This action cannot be undone and will
            permanently remove the logo from your collection.
          </DialogDescription>
        </DialogHeader>

        {/* Logo Preview */}
        <div className="flex items-center justify-center py-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center p-2 border"
            style={{ backgroundColor: logos?.color || "#ffffff" }}
          >
            <img
              src={logos?.logoUrl || logos?.imageUrl || "/placeholder.svg"}
              alt={logos?.name || "Logo"}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={deleteLogo?.isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={deleteHandle}
            disabled={deleteLogo?.isLoading}
          >
            {deleteLogo?.isLoading ? "Deleting..." : "Delete Logo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

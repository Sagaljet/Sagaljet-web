// components/banners/DeleteBannerDialog.tsx

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
import type { AppDispatch, RootState } from "@/redux/store";
import type { BannerType } from "../../../redux/types/banner";
import { deleteBannerFn, deleteBannerReset } from "@/redux/banner/deleteBannerSlice";
import { getAllBannersFn } from "@/redux/banner/getBannersSlice";

interface DeleteBannerDialogProps {
  bannerId: number;
  bannerTitle: string;
  bannerType: BannerType;
}

const DeleteBannerDialog = ({
  bannerId,
  bannerTitle,
  bannerType,
}: DeleteBannerDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteBanner = useSelector((state: RootState) => state.deleteBanner);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    dispatch(deleteBannerFn({ type: bannerType, id: bannerId }));
  };

  useEffect(() => {
    if (deleteBanner.isSuccess) {
      toast.success("Banner deleted successfully");
      dispatch(getAllBannersFn({ type: bannerType }));
      dispatch(deleteBannerReset());
      setIsOpen(false);
    }

    if (deleteBanner.isError) {
      toast.error(deleteBanner.message || "Failed to delete banner");
    }
  }, [deleteBanner.isSuccess, deleteBanner.isError, dispatch, bannerType]);

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
            Are you sure you want to delete the banner "{bannerTitle}"? This
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
            disabled={deleteBanner.isLoading}
          >
            {deleteBanner.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBannerDialog;
// src/pages/OrderDesign/DeleteOrderDesignDialog.tsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AlertCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AppDispatch, RootState } from "@/redux/store";
import type { OrderDesign } from "@/redux/types/orderDesign";
import {
  deleteOrderDesignFn,
  resetDeleteOrderDesign,
} from "@/redux/slices/orderDesign/deleteOrderDesign";
import { getAllOrderDesignsFn } from "@/redux/slices/orderDesign/getAllOrderDesigns";

interface DeleteOrderDesignDialogProps {
  orderDesign: OrderDesign;
}

export default function DeleteOrderDesignDialog({
  orderDesign,
}: DeleteOrderDesignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.deleteOrderDesign
  );

  const toastId = "deleteOrderDesign";

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order design deleted successfully!", { id: toastId });
      dispatch(resetDeleteOrderDesign());
      dispatch(getAllOrderDesignsFn({}));
      setIsOpen(false);
    }

    if (isError) {
      toast.error(message || "Failed to delete order design", { id: toastId });
      dispatch(resetDeleteOrderDesign());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleDelete = () => {
    dispatch(deleteOrderDesignFn(orderDesign.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive">
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
            Are you sure you want to delete this order design? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Item Preview */}
        <div className="bg-muted/50 rounded-lg p-4 my-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage
                src={orderDesign.images[0] || undefined}
                alt={orderDesign.title}
              />
              <AvatarFallback className="rounded-lg">
                {orderDesign.title.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{orderDesign.title}</p>
              <p className="text-sm text-muted-foreground">
                ${orderDesign.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
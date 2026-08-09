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
import { deleteEventFn, deleteEventReset } from "@/redux/slices/event/deleteEvent";
import { getEventsFn } from "@/redux/slices/event/get-events";

export default function DeleteDialogEvent({ eventId, eventTitle }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteEvent = useSelector((state: RootState) => state.deleteEvent);
  const dispatch = useDispatch();

  const handleDelete = () => {
    //@ts-ignore
    dispatch(deleteEventFn(eventId));
  };

  const toastId = "delete-event";

  useEffect(() => {
    if (deleteEvent.isSuccess) {
      toast.success("Event deleted successfully", { id: toastId });
      // @ts-ignore
      dispatch(getEventsFn());
      dispatch(deleteEventReset());
      setIsOpen(false);
    }

    if (deleteEvent.isError) {
      toast.error(deleteEvent.message || "Failed to delete event", {
        id: toastId,
      });
    }
  }, [
    deleteEvent?.isError,
    deleteEvent?.message,
    deleteEvent?.isSuccess,
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
            Are you sure you want to delete the event "{eventTitle}"? This
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
            disabled={deleteEvent.isLoading}
          >
            {deleteEvent.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

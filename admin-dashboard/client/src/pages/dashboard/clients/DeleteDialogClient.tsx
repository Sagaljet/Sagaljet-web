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
import { deleteClientFn } from "@/redux/slices/clients/DeleteClient";
import { getClientFn } from "@/redux/slices/clients/GetClient";
import toast from "react-hot-toast";
import { resetUpdateClient } from "@/redux/slices/clients/UpdateClient";
import type { RootState } from "@/redux/store";

export default function DeleteDialogClinet({ client }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteClient = useSelector((state: RootState) => state.deleteClient);

  const dispatch = useDispatch();

  const deleteHandle = () => {
    //@ts-ignore
    dispatch(getClientFn());
    //@ts-ignore
    dispatch(deleteClientFn(+client));
    setIsOpen(false);
  };

  const toastId = "clientId";

  useEffect(() => {
    if (deleteClient.isSuccess) {
      toast.success("deleted successfully...", { id: toastId });
      dispatch(resetUpdateClient());
    }
    //@ts-ignore
    dispatch(getClientFn());
    setIsOpen(false);
  }, []);

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
            Are you sure you want to delete this ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={deleteHandle}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

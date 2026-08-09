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
import { deleteTeamFn, deleteTeamReset } from "@/redux/slices/teams/DeleteTeam";
import { getTeamFn } from "@/redux/slices/teams/GetTeam";
import toast from "react-hot-toast";
import type { RootState } from "@/redux/store";

export default function DeleteDialogTeam({ team }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteTeam = useSelector((state: RootState) => state.deleteTeam);

  const dispatch = useDispatch();

  const deleteHandle = () => {
    //@ts-ignore
    dispatch(deleteTeamFn(+team));
  };

  const toastId = "teamId";

  useEffect(() => {
    if (deleteTeam.isSuccess) {
      toast.success("Team deleted successfully...", { id: toastId });
      //@ts-ignore
      dispatch(getTeamFn());
      setIsOpen(false);
      dispatch(deleteTeamReset());
    }

    setIsOpen(false);
  }, [deleteTeam.isSuccess, dispatch]);

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
            Are you sure you want to delete this team? This action cannot be
            undone.
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

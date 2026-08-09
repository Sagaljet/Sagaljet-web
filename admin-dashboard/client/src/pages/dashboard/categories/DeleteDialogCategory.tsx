import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCategoryFn } from "@/redux/slices/category/DeleteCategory";
import { getCategoryFn } from "@/redux/slices/category/GetCategory";
import type { RootState } from "@/redux/store";
import { AlertCircle, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const DeleteDialogCategory = ({ category }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const deleteCategory = useSelector(
    (state: RootState) => state.deleteCategory
  );

  const dispatch = useDispatch();

  const deleteHandle = () => {
    //@ts-ignore
    dispatch(deleteCategoryFn(+category));
    setIsOpen(false);
  };

  const toastId = "categoryId";

  useEffect(() => {
    if (deleteCategory.isSuccess) {
      toast.success("Deleted successfully...", { id: toastId });
    }
    //@ts-ignore
    dispatch(getCategoryFn());
  }, [deleteCategory.isSuccess, dispatch]);

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
            Are you sure you want to delete this? This action cannot be undone.
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
};

DeleteDialogCategory.propTypes = {
  category: PropTypes.number.isRequired,
};

export default DeleteDialogCategory;

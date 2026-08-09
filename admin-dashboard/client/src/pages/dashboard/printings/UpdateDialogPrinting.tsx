import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrintingsFn } from "@/redux/slices/printings/getPrintingsSlice";
import {
  resetUpdatePrinting,
  updatePrintingFn,
} from "@/redux/slices/printings/updatePrintingSlice";
import type { RootState } from "@/redux/store";
import { Edit } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function UpdateDialogPrinting({ printing }: any) {
  const updatePrinting = useSelector(
    (state: RootState) => state.updatePrinting
  );
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(printing.name || "");
  const [size, setSize] = useState(printing.size || "");
  const [price, setPrice] = useState(printing.price?.toString() || "");
  const [description, setDescription] = useState(printing.description || "");

  useEffect(() => {
    if (isOpen) {
      setName(printing.name || "");
      setSize(printing.size || "");
      setPrice(printing.price?.toString() || "");
      setDescription(printing.description || "");
    }
  }, [isOpen, printing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const data = {
      id: printing.id,
      name,
      size,
      price: parseFloat(price),
      description,
    };

    // @ts-ignore
    dispatch(updatePrintingFn(data));
  };

  const toastId = "update-printing";

  useEffect(() => {
    if (updatePrinting?.isSuccess) {
      toast.success("Printing type updated successfully!", { id: toastId });
      dispatch(resetUpdatePrinting());
      //@ts-ignore
      dispatch(getPrintingsFn());
      setIsOpen(false);
    }

    if (updatePrinting?.isError) {
      toast.error(updatePrinting?.message || "Failed to update printing type", {
        id: toastId,
      });
    }
  }, [
    updatePrinting?.isError,
    updatePrinting?.message,
    updatePrinting?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Printing Type</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 overflow-y-auto pr-2"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter printing type name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g., 24x36 inches"
            />
            <p className="text-xs text-muted-foreground">
              Dimensions or size specification
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <TiptapEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter printing type description with rich formatting..."
            />
            {description && (
              <div className="text-xs text-muted-foreground mt-2">
                Character count: {description.replace(/<[^>]*>/g, "").length}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updatePrinting?.isLoading}>
              {updatePrinting?.isLoading
                ? "Updating..."
                : "Update Printing Type"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

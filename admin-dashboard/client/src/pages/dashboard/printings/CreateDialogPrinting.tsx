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
import { createPrintingFn, resetCreatePrinting } from "@/redux/slices/printings/create-printing";
import { getPrintingsFn } from "@/redux/slices/printings/getPrintingsSlice";
import type { RootState } from "@/redux/store";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function CreateDialogPrinting() {
  const createPrinting = useSelector(
    (state: RootState) => state.createPrinting
  );
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const data = {
      name,
      size,
      price: parseFloat(price),
      description,
    };

    // @ts-ignore
    dispatch(createPrintingFn(data));
  };

  const toastId = "create-printing";

  const resetForm = () => {
    setName("");
    setSize("");
    setPrice("");
    setDescription("");
  };

  useEffect(() => {
    if (createPrinting?.isSuccess) {
      toast.success("Printing type created successfully!", { id: toastId });
      dispatch(resetCreatePrinting());
      //@ts-ignore
      dispatch(getPrintingsFn());
      resetForm();
      setIsOpen(false);
    }

    if (createPrinting?.isError) {
      toast.error(createPrinting?.message || "Failed to create printing type", {
        id: toastId,
      });
    }
  }, [
    createPrinting?.isError,
    createPrinting?.message,
    createPrinting?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Printing Type
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Printing Type</DialogTitle>
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
              placeholder="e.g., Billboard, A4, Poster"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g., 24x36 inches, 8.5x11"
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
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPrinting?.isLoading}>
              {createPrinting?.isLoading
                ? "Creating..."
                : "Create Printing Type"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
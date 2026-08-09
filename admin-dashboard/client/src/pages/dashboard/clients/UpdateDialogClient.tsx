import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getClientFn } from "@/redux/slices/clients/GetClient";
import {
  resetUpdateClient,
  updateClientFn,
} from "@/redux/slices/clients/UpdateClient";
import type { RootState } from "@/redux/store";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UpdateDialogClient({ client }: any) {
  const updateClient = useSelector((state: RootState) => state.updateClient);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(client.name || "");
  const [description, setDescription] = useState(client.description || "");
  const [logoUrl, setImage] = useState(client.logoUrl || null);
  const [imagePreview, setImagePreview] = useState(client.logoUrl || null);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const data = {
      description,
      logoUrl,
      name,
      id: +client.id,
    };

    //@ts-ignore
    dispatch(updateClientFn(data));
    //@ts-ignore
    dispatch(getClientFn());
    //@ts-ignore
    isOpen(false);
  };

  const toastId = "toastUpdate";

  useEffect(() => {
    if (updateClient?.isSuccess) {
      toast.success("success", { id: toastId });
      dispatch(resetUpdateClient());
      //@ts-ignore
      dispatch(getClientFn());
      setIsOpen(false);
    }

    if (updateClient?.isError) {
      toast.error(updateClient?.message, { id: toastId });
    }
  }, [
    updateClient?.isError,
    updateClient?.message,
    updateClient?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" asChild>
          <Link to={""}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Update Client</DialogTitle>
          <DialogDescription>
            Fill in the details to update Client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Project image preview"
                className="rounded-lg"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Client</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

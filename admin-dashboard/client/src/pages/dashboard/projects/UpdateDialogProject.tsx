import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getProjectFn } from "@/redux/slices/projects/GetProject";
import {
  resetUpdateProject,
  updateProjectFn,
} from "@/redux/slices/projects/UpdateProject";
import type { RootState } from "@/redux/store";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UpdateDialogProject({
  project,
  categories,
  category,
}: any) {
  const updateProject = useSelector((state: RootState) => state.updateProject);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(category || 0);
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [logoUrl, setImage] = useState(project?.imageUrl || null);

  const [url, setUrl] = useState(project?.link || "");
  const [client, setClient] = useState(project?.client || "");

  const [imagePreview, setImagePreview] = useState(project?.imageUrl || null);

  //@ts-ignore
  function onClickCategory(event) {
    event.preventDefault();

    if (!selectedCategory) {
      alert("Please select a Category.");
      return;
    }
  }

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
      // description,
      // logoUrl,
      // name,
      id: +project.id,

      client,
      name,
      description,
      imageUrl: logoUrl,
      link: url,
      categoryId: selectedCategory,
    };
    //@ts-ignore
    dispatch(updateProjectFn(data));
    //@ts-ignore
    dispatch(getProjectFn());
    setIsOpen(false);
  };

  const toastId = "toastUpdate";

  useEffect(() => {
    if (updateProject?.isSuccess) {
      toast.success("success", { id: toastId });
      //@ts-ignore
      dispatch(getProjectFn());
      setIsOpen(false);
      dispatch(resetUpdateProject());
    }
    dispatch(resetUpdateProject());
    if (updateProject?.isError) {
      toast.error(updateProject?.message, { id: toastId });
    }
  }, [
    updateProject?.isError,
    updateProject?.message,
    updateProject?.isSuccess,
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
          <DialogTitle>Create New Project</DialogTitle>
          {/* <DialogDescription>
            Fill in the details to create a new Project.
          </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            {/* <Label htmlFor="name">Name</Label> */}
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            {/* <Label htmlFor="description">Description</Label> */}
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
              //   className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Project image preview"
                className="rounded-lg object-cover bg-center bg-no-repeat"
              />
            </div>
          )}
          <div className="space-y-2">
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Insert Project URL..."
              required
              type="url"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Client Name..."
            />
          </div>
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selectedCategory && "text-muted-foreground"
                  )}
                >
                  {selectedCategory
                    ? categories?.find(
                        (category: any) => category.id === selectedCategory
                      )?.name
                    : "Select Category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  {/* <CommandInput placeholder="Search Category..." /> */}
                  <CommandList>
                    <CommandEmpty>No Category found.</CommandEmpty>
                    <CommandGroup>
                      {categories?.map((category: any) => (
                        <CommandItem
                          value={category.id}
                          key={category.name}
                          onSelect={() => setSelectedCategory(category.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              category.id === selectedCategory
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

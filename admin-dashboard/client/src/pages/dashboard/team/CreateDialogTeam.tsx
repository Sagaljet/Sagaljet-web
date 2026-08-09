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
import { createTeamFn, resetCreateTeam } from "@/redux/slices/teams/CreateTeam";
import { getTeamFn } from "@/redux/slices/teams/GetTeam";
import type { RootState } from "@/redux/store";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CreateDialogTeam() {
  const createTeam = useSelector((state: RootState) => state.createTeam);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImage] = useState(null);
  const [skill, setSkill]: string | any = useState(null);
  const [_, setImagePreview] = useState(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      description,
      skill,
      imageUrl,
    };
    //@ts-ignore
    dispatch(createTeamFn(data));
    //@ts-ignore
    dispatch(getTeamFn());
    // setIsOpen(false)
  };

  const toastId = "toastCreateTeam";

  useEffect(() => {
    if (createTeam?.isSuccess) {
      toast.success("Team created successfully", { id: toastId });
      dispatch(resetCreateTeam());
      //@ts-ignore
      dispatch(getTeamFn());
      setIsOpen(false);
      setSkill(null);
      setDescription("");
      setName("");
      setImagePreview(null);
    }

    if (createTeam?.isError) {
      toast.error(createTeam?.message, { id: toastId });
    }
  }, [
    createTeam?.isError,
    createTeam?.message,
    createTeam?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button asChild>
          <Link to="">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Team
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter team description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill">Skill</Label>
            <Input
              id="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Enter team skill"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Team Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          {/* {imagePreview && (
            <div className="relative w-full h-18 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Team image preview"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )} */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

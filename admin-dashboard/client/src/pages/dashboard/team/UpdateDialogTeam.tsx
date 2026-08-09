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
import { getTeamFn } from "@/redux/slices/teams/GetTeam";
import { resetUpdateTeam, updateTeamFn } from "@/redux/slices/teams/UpdateTeam";
import type { RootState } from "@/redux/store";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UpdateDialogTeam({ team }: any) {
  const updateTeam = useSelector((state: RootState) => state.updateTeam);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(team.name || "");
  const [description, setDescription] = useState(team.description || "");
  const [skill, setSkill] = useState(team.skill || "");
  const [imageUrl, setImage] = useState(team.imageUrl || null);
  const [imagePreview, setImagePreview] = useState(team.imageUrl || null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      description,
      skill,
      imageUrl,
      id: +team.id,
    };

    //@ts-ignore
    dispatch(updateTeamFn(data));
    //@ts-ignore
    dispatch(getTeamFn());
    setIsOpen(false);
  };

  const toastId = "toastUpdate";

  useEffect(() => {
    if (updateTeam?.isSuccess) {
      toast.success("Team updated successfully", { id: toastId });
      dispatch(resetUpdateTeam());
      //@ts-ignore
      dispatch(getTeamFn());
      setIsOpen(false);
    }

    if (updateTeam?.isError) {
      toast.error(updateTeam?.message, { id: toastId });
    }
  }, [
    updateTeam?.isError,
    updateTeam?.message,
    updateTeam?.isSuccess,
    dispatch,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" asChild>
          <Link to={""}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Team
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Update Team</DialogTitle>
          <DialogDescription>
            Fill in the details to update the team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
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
                alt="Team image preview"
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
            <Button type="submit">Update Team</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

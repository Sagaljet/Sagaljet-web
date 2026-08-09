import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { resetSingUp, singUpFn } from "@/redux/slices/auth/SingUp";
import { getUserFn } from "@/redux/slices/users/getUser";
import type { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function CreateDialogUser() {
  const singUp = useSelector((state: RootState) => state.singup);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      password,
      userName,
      role,
    };
    //@ts-ignore
    dispatch(singUpFn(data));
  };

  const toastId = "toastsingUp";

  useEffect(() => {
    if (singUp?.isSuccess) {
      toast.success("success", { id: toastId });
      dispatch(resetSingUp());
      //@ts-ignore
      dispatch(getUserFn());
      setOpen(false);
      setRole("");
      setPassword("");
      setEmail("");
      setUserName("");
    }

    if (singUp?.isError) {
      toast.error(singUp?.message, { id: toastId });
    }
  }, [singUp?.isError, singUp?.message, singUp?.isSuccess, dispatch]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create User</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              name="userName"
              placeholder="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mb-4"
            />
            <Input
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Input
              name="password"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <Input
              name="role"
              placeholder="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mb-4"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

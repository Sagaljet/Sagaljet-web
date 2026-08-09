import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { resetSingUp, singUpFn } from "../../redux/slices/auth/SingUp";
import type { RootState } from "@/redux/store";
export default function SignUp() {
  const singIn = useSelector((state: RootState) => state.singup);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      password,
      userName,
    };

    //@ts-ignore
    dispatch(singUpFn(data));
  };

  const navigate = useNavigate();
  const toastId = "toastsingIn";

  const user = JSON.parse(localStorage.getItem("userInfo")!);

  useEffect(() => {
    if (singIn?.isSuccess) {
      toast.success("success", { id: toastId });
      navigate("/singin");
      dispatch(resetSingUp());
    }

    if (user) {
      navigate("/");
    }

    if (singIn?.isError) {
      toast.error(singIn?.message, { id: toastId });
    }
  }, [singIn?.isError, singIn?.message, singIn?.isSuccess, dispatch]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <div className="h-full w-1/2 bg-[#1F1F70] float-left"></div>
        <div className="h-full w-1/2 bg-[#CCE4FF] float-right"></div>
      </div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">somDigital</h1>
            <h2 className="text-2xl font-semibold mt-2 text-foreground">
              Welcome
            </h2>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Your Name</Label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                id="email"
                placeholder="Name"
                required
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="name"
                placeholder="Email"
                required
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Your Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                required
                type="password"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Log In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            i have an account.
            <Link className="text-primary hover:underline" to={"/singin"}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

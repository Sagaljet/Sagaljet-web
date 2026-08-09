import { ArrowRight, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { resetSingIn, singInFn } from "../../redux/slices/auth/SingIn";
import { setUser } from "../../redux/slices/auth/UserInfo";
import type { RootState } from "@/redux/store";

export default function AuthPage() {
  const singIn = useSelector((state: RootState) => state.singin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastId = "authToast";

  const [isLogin, _] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = isLogin ? { email, password } : { userName, email, password };

    if (isLogin) {
      // @ts-ignore
      dispatch(singInFn(data));
    } else {
      // @ts-ignore
      // dispatch(signUpFn(data));
      toast.success("Account created (demo only)!", { id: toastId });
    }
  };

  useEffect(() => {
    if (singIn?.isSuccess) {
      toast.success("Login successful!", { id: toastId });
      const { userName, email, token, role }: any = singIn.data;
      dispatch(setUser({ userName, email, token, role }));
      navigate("/");
      dispatch(resetSingIn());
    }

    if (user) {
      navigate("/");
    }

    if (singIn?.isError) {
      toast.error(singIn?.message || "Login failed", { id: toastId });
    }
  }, [singIn?.isError, singIn?.message, singIn?.isSuccess, dispatch, navigate]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <div className="h-full w-1/2 bg-[#1F1F70] float-left"></div>
        <div className="h-full w-1/2 bg-[#CCE4FF] float-right"></div>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">
              {isLogin ? "Welcome Back 👋" : "Create an Account ✨"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Please log in to your account"
                : "Sign up to get started"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your Name"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              disabled={singIn.isLoading}
              type="submit"
              className="w-full"
            >
              {singIn.isLoading ? (<Loader2Icon className="animate-spin"/>): "Log In"}
              {singIn.isLoading ? "" : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

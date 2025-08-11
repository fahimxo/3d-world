import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginIcon from "../assets/icons/LoginIcon";
import Input from "./input";
import { Button } from "./button";
import api from "../config/axios";
import { API_ENDPOINTS } from "../config/endpoint";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password is wrong"),
});

type LoginFormFields = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onCancel?: () => void;
}

const LoginForm = ({ onCancel }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormFields) => {
    try {
      const response: any = await api.post(API_ENDPOINTS.USER.LOGIN, {
        loginDto: {
          username: data.username,
          password: data.password,
        },
      });
      const token = response?.result?.token;
      if (token) {
        localStorage.setItem("token", token);
        if (onCancel) onCancel();
      }
    } catch (error: any) {}
  };

  return (
    <div className="flex justify-center items-center min-h-[350px] relative">
      <div className="relative">
        <LoginIcon className="w-full h-full block" />
        <form
          className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-[10%] w-4/5 flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full mb-6">
            <Input
              id="username"
              type="text"
              placeholder="Username"
              label="Username"
              autoComplete="username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="w-full mb-6">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              label="Password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="flex gap-3 w-full justify-center">
            <Button className="w-32" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="w-32" type="submit" disabled={isSubmitting}>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

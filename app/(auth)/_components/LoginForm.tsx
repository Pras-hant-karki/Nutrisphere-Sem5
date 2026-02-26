"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { LoginData, loginSchema } from "../schema";
import { setAuthToken, setUserData } from "@/lib/cookie";
import { login } from "@/lib/api/auth";
import { setAuth } from "@/lib/auth-helpers";

type FieldRowProps = {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
};

function FieldRow({ id, label, icon, children }: FieldRowProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[14px] font-semibold text-[#8B8B8B] tracking-wide ml-1">
        {label}
      </label>
      <div className="group relative flex items-center h-[56px] w-full border border-[#333333] rounded-[16px] bg-[#1A1A1A] transition-all duration-300 focus-within:border-[#D4AF37] focus-within:bg-[#222222] focus-within:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] hover:border-[#555555]">
        <div className="absolute left-4 flex flex-col justify-center items-center text-[#666666] group-focus-within:text-[#D4AF37] transition-colors duration-300 pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const submit = async (values: LoginData) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await login(values);

      if (!result || !result.token) {
        throw new Error("Invalid response from server");
      }

      const userData = result.user || result.data;

      if (!userData) {
        throw new Error("User data not found in response");
      }

      await setAuthToken(result.token);
      await setUserData(userData);

      const userId = userData._id || userData.id || "";

      setAuth(result.token, {
        id: userId,
        email: userData.email || "",
        role: userData.role || "user",
        fullName: userData.fullName || userData.name || "",
        phone: userData.phone || "",
        image: userData.image || "",
      });

      if (result.success) {
        router.push(
          userData.role === "admin" ? "/admin/dashboard" : "/user/profile"
        );
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (err: Error | any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 md:px-0">
      <div className="text-center mb-10">
        <h2 className="text-[32px] font-extrabold text-[#FFFFFF] mb-3 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-[#8B8B8B] text-[15px] font-medium leading-relaxed">
          Log in to continue your nutrition journey
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-[#EF4444]/15 border border-[#EF4444]/40 rounded-[14px] flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
            <p className="text-[#EF4444] text-[14px] font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-1.5 flex flex-col">
          <FieldRow id="email" label="Email Address" icon={<Mail className="w-[22px] h-[22px]" />}>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full h-full bg-transparent pl-[52px] pr-4 text-white placeholder:text-[#555555] outline-none text-[16px] font-medium tracking-wide rounded-[16px]"
            />
          </FieldRow>
          {errors.email && <p className="text-[13px] font-medium text-[#EF4444] pl-1 mt-1 animate-in fade-in">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5 flex flex-col">
          <FieldRow id="password" label="Password" icon={<Lock className="w-[22px] h-[22px]" />}>
            <div className="relative w-full h-full flex items-center justify-end">
              <input
                id="password"
                type={obscurePassword ? "password" : "text"}
                placeholder="Enter your password"
                {...register("password")}
                className="absolute inset-0 w-full h-full bg-transparent pl-[52px] pr-12 text-white placeholder:text-[#555555] outline-none text-[16px] font-medium tracking-wide rounded-[16px]"
              />
              <button
                type="button"
                onClick={() => setObscurePassword(!obscurePassword)}
                className="relative z-10 mr-2 p-2 text-[#666666] hover:text-[#D4AF37] transition-colors rounded-[12px] hover:bg-white/5 outline-none focus:text-[#D4AF37]"
                aria-label={obscurePassword ? "Show password" : "Hide password"}
              >
                {obscurePassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
              </button>
            </div>
          </FieldRow>
          {errors.password && <p className="text-[13px] font-medium text-[#EF4444] pl-1 mt-1 animate-in fade-in">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-[14px] pt-1">
          <label htmlFor="rememberMe" className="flex items-center gap-2.5 text-[#A5A5A5] hover:text-white transition-colors cursor-pointer group font-medium">
            <div className="relative flex items-center justify-center w-[18px] h-[18px]">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer absolute w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full rounded-[4px] border-[2px] border-[#555555] group-hover:border-[#D4AF37] peer-checked:bg-[#D4AF37] peer-checked:border-[#D4AF37] transition-all flex items-center justify-center">
                <CheckCircle2 className="w-[12px] h-[12px] text-[#1A1A1A] opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
              </div>
            </div>
            Remember me
          </label>
          <Link href="/forgotPassword" className="text-[#D4AF37] hover:text-[#F3CD55] transition-colors font-semibold">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={isLoading}
          className="group mt-6 w-full h-[56px] bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-[17px] rounded-[16px] transition-all duration-300 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2.5"
        >
          {isLoading ? (
            <>
              <div className="w-[22px] h-[22px] border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="tracking-wide">Logging in...</span>
            </>
          ) : (
            <>
              <span className="tracking-wide">Log in</span>
              <CheckCircle2 className="w-[22px] h-[22px] opacity-90 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-[15px] text-[#A5A5A5] font-medium pt-3">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[#D4AF37] hover:text-[#F3CD55] transition-colors ml-1">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

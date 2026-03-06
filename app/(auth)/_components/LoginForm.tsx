"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-action";
import { setAuth } from "@/lib/auth-helpers";
import { AlertCircle } from "lucide-react";
import { Eye, EyeOff, Lock, Mail, Check } from "lucide-react";
import { LoginData, loginSchema } from "../schema";

type FieldRowProps = {
  icon: ReactNode;
  children: ReactNode;
};

function FieldRow({ icon, children }: FieldRowProps) {
  return (
    /* HEIGHT: Using !h-[72px] to force thickness */
    <div className="flex items-center w-full border-2 border-[#FACC15] rounded-[20px] bg-[#1E1E1E] overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-[#FACC15]/10 !h-[72px]">
      <div className="flex justify-center items-center min-w-[64px] text-white border-r border-white/10">
        {icon}
      </div>
      <div className="flex-1 h-full relative">
        {children}
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [obscurePassword, setObscurePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await handleLogin(data);
      if (result.success) {
        // persist token + user in localStorage for client-side helpers
        if (result.token && result.data) {
          setAuth(result.token, result.data);
        }
        const role = result.data?.role || result.data?.user?.role;
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/home");
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto px-4">
      
      {/* 1. HEADING POSITION FIX: 
          If mb-20 didn't work, use !mb-[100px]. 
          Increase the number inside [] to move it even higher. */}
      <div className="mt-10 !mb-[60px]">
        <h2 className="!text-[64px] font-black text-[#FACC15] leading-none tracking-tight">
          Log in
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col !gap-y-5">
        
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <FieldRow icon={<Mail className="w-6 h-6" />}>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[20px] font-medium"
            />
          </FieldRow>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <FieldRow icon={<Lock className="w-6 h-6" />}>
            <div className="flex items-center h-full w-full">
              <input
                type={obscurePassword ? "password" : "text"}
                placeholder="Password"
                {...register("password")}
                className="flex-1 h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[20px] font-medium"
              />
              
              {/* 2. EYE BUTTON POSITION FIX: 
                  If pr-4 didn't work, we use !mr-8 (Margin Right). 
                  Increase the number in !mr-10, !mr-12 etc. to move it further LEFT. */}
              <button
                type="button"
                onClick={() => setObscurePassword(!obscurePassword)}
                className="!mr-8 text-gray-400 hover:text-[#FACC15] transition-colors"
              >
                {obscurePassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </FieldRow>
        </div>

        {/* Remember Me UI */}
        <div className="flex items-center justify-between text-[16px] font-semibold">
          <label className="flex items-center gap-3 text-gray-300 cursor-pointer group">
            <input
              type="checkbox"
              className="hidden"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all 
              ${rememberMe ? 'bg-black border-white' : 'bg-transparent border-white'}`}>
              {rememberMe && <Check className="text-white w-4 h-4" strokeWidth={4} />}
            </div>
            <span>Remember me</span>
          </label>
          <Link href="/forgotPassword" className="text-red-700 font-bold">Forgot password?</Link>
        </div>

        {/* 3. BUTTON TEXT SIZE FIX:
            Use !text-[24px] to force the size. 
            Increase the number to make text bigger. */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full !h-[70px] bg-[#39FF14] text-black font-black !text-[29px] rounded-full shadow-lg"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-[18px] text-white !mt-1">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[#39FF14] hover:underline ml-1">
            Register !
          </Link>
        </p>
      </form>
    </div>
  );
}
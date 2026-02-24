"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { setAuthToken, setUserData } from "@/lib/cookie";
import { login } from "@/lib/api/auth";
import { setAuth } from "@/lib/auth-helpers";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
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
    }
  };

  const inputBase =
    "w-full h-14 rounded-[20px] pl-12 pr-6 text-base text-white bg-[#1B211D] border-[1.5px] border-[#26322B] outline-none transition-all focus:border-[#D4AF37] focus:border-2 placeholder:text-[#7C8C83] placeholder:text-sm";

  return (
    <div className="w-full">
      <h2 className="text-7xl font-extrabold mb-10 text-[#D4AF37]">Log in</h2>

      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {error && (
          <div
            className="p-4 border rounded-xl text-sm font-medium"
            style={{
              backgroundColor: "#E53935",
              borderColor: "#E53935",
              color: "#FFFFFF",
            }}
          >
            {error}
          </div>
        )}
        <div className="h-20" />

        {/* EMAIL */}
        <div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/50 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              {...register("email")}
              placeholder="Email"
              className={inputBase}
            />
          </div>
          {errors.email && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="h-4" />


        {/* PASSWORD */}
        <div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/50 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className={inputBase}
            />
          </div>
          {errors.password && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="h-4" />


        {/* REMEMBER & FORGOT */}
        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 text-[#9FB3A6] cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-[#444] bg-[#2A2A2A] accent-[#D4AF37]"
            />
            Remember me
          </label>
          <Link href="/forgotPassword" className="text-[#E53935] hover:underline text-sm">
            Forgot password?
          </Link>
        </div>
        <div className="h-4" />


        {/* LOGIN BUTTON */}
        <button
          disabled={pending}
          className="w-full h-14 rounded-full font-bold text-lg disabled:opacity-50 shadow-md bg-[#4ADE80] text-[#0F1310] hover:bg-[#3ecf70] transition-colors mt-2"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
        <div className="h-4" />


        {/* REGISTER LINK */}
        <p className="text-center text-base text-[#9FB3A6] pt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#7CFC88] hover:underline">
            Register !
          </Link>
        </p>
        <div className="h-4" />

      </form>
    </div>
  );
}

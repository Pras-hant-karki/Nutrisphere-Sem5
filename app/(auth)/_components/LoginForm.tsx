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
    "w-full h-14 rounded-xl pl-12 pr-6 text-base text-white bg-[#1B211D] border-2 border-[#D4AF37] outline-none transition-all focus:border-[#F2B632]";

  return (
    <div className="w-full">
      <h2 className="text-4xl font-extrabold mb-10 text-[#D4AF37]">Log in</h2>

      <form onSubmit={handleSubmit(submit)} className="space-y-7">
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

        {/* EMAIL */}
        <div className="space-y-3">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/70 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              {...register("email")}
              placeholder="Email"
              className={inputBase}
            />
          </div>
          {errors.email && (
            <p className="text-sm" style={{ color: "#E53935" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-3">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/70 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2a2 2 0 012 2v2h-4v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 11v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2H8a2 2 0 00-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11V9a3 3 0 116 0v2" />
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
            <p className="text-sm" style={{ color: "#E53935" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* REMEMBER & FORGOT */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#9FB3A6]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-[#26322B] bg-[#1B211D] accent-[#D4AF37]"
            />
            Remember me
          </label>
          <Link href="/forgotPassword" className="text-[#D4AF37] hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
          disabled={pending}
          className="w-full h-14 rounded-full font-semibold text-lg disabled:opacity-50 shadow-md bg-[#F26B2C] text-white hover:bg-[#ff7b3d] transition-colors"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>

        {/* SOCIAL BUTTONS */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            className="w-full h-12 rounded-full border border-white/20 text-white flex items-center justify-center gap-3 bg-[#1B211D] hover:bg-[#252c27] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#ffffff" d="M21.35 11.1h-9.17v2.98h5.26c-.23 1.24-.98 2.3-2.14 3.01v2.5h3.46c2.03-1.87 3.2-4.63 3.2-7.92 0-.63-.06-1.24-.16-1.82z" />
              <path fill="#ffffff" d="M12.18 22c2.9 0 5.33-.96 7.1-2.61l-3.46-2.5c-.96.64-2.2 1.02-3.64 1.02-2.8 0-5.17-1.89-6.02-4.43H2.57v2.78C4.33 19.7 7.97 22 12.18 22z" />
              <path fill="#ffffff" d="M6.16 13.48a5.9 5.9 0 010-3.76V6.94H2.57a9.84 9.84 0 000 10.12l3.59-2.78z" />
              <path fill="#ffffff" d="M12.18 6.09c1.58 0 3.01.55 4.13 1.63l3.1-3.1C17.5 2.86 15.07 2 12.18 2 7.97 2 4.33 4.3 2.57 7.94l3.59 2.78c.85-2.54 3.22-4.63 6.02-4.63z" />
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            className="w-full h-12 rounded-full border border-white/20 text-white flex items-center justify-center gap-3 bg-[#1B211D] hover:bg-[#252c27] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#ffffff" d="M16.365 1.43c0 1.14-.46 2.27-1.24 3.1-.83.86-2.2 1.53-3.38 1.44-.16-1.2.37-2.42 1.12-3.2.82-.84 2.25-1.47 3.5-1.34zM20.86 17.55c-.28.64-.62 1.24-1.03 1.82-.56.82-1.01 1.38-1.67 2.18-.9 1.08-2.06 2.43-3.53 2.44-1.3.02-1.64-.82-3.42-.82-1.78 0-2.18.8-3.46.84-1.41.05-2.48-1.26-3.38-2.34-1.9-2.32-3.36-6.56-1.4-9.44.98-1.43 2.72-2.34 4.61-2.36 1.44-.03 2.8.92 3.42.92.62 0 2.28-1.14 3.84-.97.65.03 2.48.26 3.66 1.96-.1.06-2.19 1.28-2.17 3.81.03 3.02 2.64 4.02 2.67 4.04-.02.06-.43 1.5-1.15 2.92z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* REGISTER LINK */}
        <p className="text-center text-base text-[#9FB3A6] pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#7CFC88] hover:underline">
            Register !
          </Link>
        </p>
      </form>
    </div>
  );
}

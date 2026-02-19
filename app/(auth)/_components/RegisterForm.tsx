"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const submit = async (values: RegisterData) => {
    setError("");
    try {
      const result = await handleRegister(values);
      if (result.success) {
        startTransition(() => {
          router.push("/login");
        });
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: Error | any) {
      setError(err.message || "Registration failed");
    }
  };

  const inputBase =
    "w-full h-14 rounded-xl pl-14 pr-6 text-base text-white bg-[#2A2A2A] border border-[#D4AF37] outline-none transition-all focus:border-[#F2B632] placeholder:text-white/40 placeholder:text-sm";

  return (
    <div className="w-full">
      <h2 className="text-4xl font-extrabold mb-10 text-[#D4AF37] italic">Register</h2>

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

        {/* Full Name */}
        <div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/50 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className={inputBase}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Confirm Password */}
        <div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/50 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </span>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm password"
              className={inputBase}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Register Button */}
        <button
          disabled={pending}
          className="w-full h-14 rounded-full font-bold text-lg disabled:opacity-50 shadow-md bg-[#4ADE80] text-[#1A1008] hover:bg-[#3ecf70] transition-colors mt-4"
        >
          {pending ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}

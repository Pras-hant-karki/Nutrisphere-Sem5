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
    "w-full h-14 rounded-xl pl-12 pr-6 text-base text-white bg-[#1B211D] border-2 border-[#D4AF37] outline-none transition-all focus:border-[#F2B632]";

  return (
    <div className="w-full">
      <h2 className="text-4xl font-extrabold mb-10 text-[#D4AF37]">Register</h2>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
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

        <div className="mb-6">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/70 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

        <div className="mb-6">
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
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/70 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

        <div className="mb-6">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/70 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

        <button
          disabled={pending}
          className="w-full h-14 rounded-full font-semibold text-lg disabled:opacity-50 shadow-md bg-[#F26B2C] text-white hover:bg-[#ff7b3d] transition-colors mt-2"
        >
          {pending ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-base text-[#9FB3A6] pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#D4AF37] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

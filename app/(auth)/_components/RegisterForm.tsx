"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "@/app/lib/actions/auth-action";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string >("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const submit = async (values: RegisterData) => {
    setError("");
    try{
      const result = await handleRegister(values);
      if (result.success) {
        startTransition(() => {
          router.push("/login");
        });
      } else {
        setError(result.message || "Registration failed");
      }
    }catch(err: Error | any){
      setError(err.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 text-black"
    >
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Full name */}
      <div>
        <input
          {...register("fullName")}
          placeholder="Full name"
          className="w-full h-11 border border-gray-300 rounded-md px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full h-11 border border-gray-300 rounded-md px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full h-11 border border-gray-300 rounded-md px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm password"
          className="w-full h-11 border border-gray-300 rounded-md px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        disabled={pending}
        className="w-full h-11 rounded-md bg-orange-500 hover:bg-orange-600 transition text-white font-semibold disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-orange-500 font-semibold">
          Log in
        </Link>
      </p>
    </form>
  );
}
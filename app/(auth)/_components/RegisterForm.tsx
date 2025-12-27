"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const submit = (values: RegisterData) => {
    startTransition(() => {
      console.log(values);
      router.push("/login");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 text-black"
    >
      {/* Full name */}
      <div>
        <input
          {...register("name")}
          placeholder="Full name"
          className="w-full h-11 border border-gray-300 rounded-md px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {errors.name.message}
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
        className="w-full h-11 rounded-md bg-orange-500 hover:bg-orange-600 transition text-white font-semibold"
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

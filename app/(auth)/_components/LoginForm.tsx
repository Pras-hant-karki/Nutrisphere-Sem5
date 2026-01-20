"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { setAuthToken, setUserData } from "@/app/lib/cookie";
import { login } from "@/app/lib/api/auth";


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
    try{
      
      const result= await login(values)
      await setAuthToken( result.token );
      await setUserData( result.data );
       if (result.success) {
                router.push("/dashboard");
            } else {
                throw new Error(result.message || "Registration failed");
            }
      
    }catch(err: Error | any){
      setError(err.message || "Login failed");
    }

  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <input
        {...register("email")}
        placeholder="Email"
        className="w-full h-11 border rounded-md px-3 text-gray-900 placeholder:text-gray-400"
      />
      {errors.email && (
        <p className="text-xs text-red-500">{errors.email.message}</p>
      )}

      <input
        type="password"
        {...register("password")}
        placeholder="Password"
        className="w-full h-11 border rounded-md px-3 text-gray-900 placeholder:text-gray-400"
      />
      {errors.password && (
        <p className="text-xs text-red-500">{errors.password.message}</p>
      )}

      <div className="flex justify-end text-sm">
        <Link
          href="/forgotPassword"
          className="text-orange-500 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        disabled={pending}
        className="w-full h-11 rounded-md bg-orange-500 text-white font-semibold disabled:opacity-50"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-gray-700">
        Don't have an account?{" "}
        <Link href="/register" className="text-orange-500 font-semibold">
          Register
        </Link>
        
      </p>
    </form>
  );
}

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
    <form onSubmit={handleSubmit(submit)} className="space-y-4">

      <input {...register("name")} placeholder="Full name" className="w-full h-11 border rounded-md px-3" />
      <input {...register("email")} placeholder="Email" className="w-full h-11 border rounded-md px-3" />
      <input type="password" {...register("password")} placeholder="Password" className="w-full h-11 border rounded-md px-3" />
      <input type="password" {...register("confirmPassword")} placeholder="Confirm password" className="w-full h-11 border rounded-md px-3" />

      <button className="w-full h-11 rounded-md bg-orange-500 text-white font-semibold">
        {pending ? "Creating..." : "Create account"}
      </button>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-orange-500 font-semibold">
          Log in
        </Link>
      </p>
    </form>
  );
}

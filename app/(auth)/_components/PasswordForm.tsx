"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">
        Forgot password
      </h1>

      <p className="text-sm text-gray-600 text-center mb-6">
        Enter your email to reset your password
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full h-11 border rounded-md px-3 text-gray-900 placeholder:text-gray-400 mb-4"
      />

      <button className="w-full h-11 bg-orange-500 text-white rounded-md font-semibold">
        Reset password
      </button>

      <div className="text-center mt-4">
        <Link href="/login" className="text-orange-500 text-sm hover:underline">
          ← Back to login
        </Link>
      </div>
    </>
  );
}

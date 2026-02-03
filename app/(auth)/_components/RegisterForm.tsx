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
    "w-full h-12 border rounded-xl px-4 text-base outline-none transition-all";

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-6" style={{ color: "#D4AF37" }}>
        Create account
      </h2>

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

        <div>
          <input
            {...register("fullName")}
            placeholder="Full name"
            className={inputBase}
            style={{
              backgroundColor: "#1B211D",
              borderColor: "#26322B",
              color: "#FFFFFF",
              borderWidth: "2px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "#26322B")}
          />
          {errors.fullName && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className={inputBase}
            style={{
              backgroundColor: "#1B211D",
              borderColor: "#26322B",
              color: "#FFFFFF",
              borderWidth: "2px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "#26322B")}
          />
          {errors.email && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className={inputBase}
            style={{
              backgroundColor: "#1B211D",
              borderColor: "#26322B",
              color: "#FFFFFF",
              borderWidth: "2px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "#26322B")}
          />
          {errors.password && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
            className={inputBase}
            style={{
              backgroundColor: "#1B211D",
              borderColor: "#26322B",
              color: "#FFFFFF",
              borderWidth: "2px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "#26322B")}
          />
          {errors.confirmPassword && (
            <p className="text-sm mt-2" style={{ color: "#E53935" }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          disabled={pending}
          className="w-full h-12 rounded-xl font-bold disabled:opacity-50 shadow-md"
          style={{ backgroundColor: "#2ECC71", color: "#0F1310" }}
        >
          {pending ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-sm" style={{ color: "#9FB3A6" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#D4AF37" }} className="font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

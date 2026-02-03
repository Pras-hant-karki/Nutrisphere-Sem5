"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { setAuthToken, setUserData } from "@/app/lib/cookie";
import { login } from "@/app/lib/api/auth";
import { setAuth } from "@/app/lib/auth-helpers";

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

      console.log("Login result:", result);

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
        if (userData.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/profile");
        }
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (err: Error | any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  const inputBase =
    "w-full rounded-xl px-4 text-base outline-none transition-all";

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-6" style={{ color: "#D4AF37" }}>
        Log in
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
            {...register("email")}
            placeholder="Email"
            className={`${inputBase} h-12 border`}
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
            className={`${inputBase} h-12 border`}
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

        <div className="flex justify-end text-sm">
          <Link href="/forgotPassword" style={{ color: "#D4AF37" }} className="hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={pending}
          className="w-full h-12 rounded-xl font-bold disabled:opacity-50 shadow-md"
          style={{ backgroundColor: "#2ECC71", color: "#0F1310" }}
        >
          {pending ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm" style={{ color: "#9FB3A6" }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#D4AF37" }} className="font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

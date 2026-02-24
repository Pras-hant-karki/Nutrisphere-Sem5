"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { LoginData, loginSchema } from "../schema";
import { setAuthToken, setUserData } from "@/lib/cookie";
import { login } from "@/lib/api/auth";
import { setAuth } from "@/lib/auth-helpers";

type FieldRowProps = {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
};

function FieldRow({ id, label, icon, children }: FieldRowProps) {
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="h-[var(--input-h)] w-full border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-input)] transition-colors focus-within:border-[var(--gold)]">
        <div className="h-full w-full flex items-center">
          <div className="h-full w-12 shrink-0 flex items-center justify-center border-r border-[var(--border)] text-[var(--text-muted)]">
            {icon}
          </div>
          <div className="min-w-0 flex-1 h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Log in to continue your nutrition journey
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        {error && (
          <div className="p-3.5 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-[var(--radius-lg)] flex items-center gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 text-[var(--error)] shrink-0" />
            <p className="text-[var(--error)] text-sm font-medium">{error}</p>
          </div>
        )}

        <FieldRow id="email" label="Email Address" icon={<Mail className="w-5 h-5" />}>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="h-full w-full bg-transparent px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
        </FieldRow>
        {errors.email && <p className="text-sm text-[var(--error)] -mt-2">{errors.email.message}</p>}

        <FieldRow id="password" label="Password" icon={<Lock className="w-5 h-5" />}>
          <div className="h-full w-full flex items-center">
            <input
              id="password"
              type={obscurePassword ? "password" : "text"}
              placeholder="Enter your password"
              {...register("password")}
              className="h-full min-w-0 flex-1 bg-transparent px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
            />
            <button
              type="button"
              onClick={() => setObscurePassword(!obscurePassword)}
              className="h-full px-3 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label={obscurePassword ? "Show password" : "Hide password"}
            >
              {obscurePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </FieldRow>
        {errors.password && <p className="text-sm text-[var(--error)] -mt-2">{errors.password.message}</p>}

        <div className="flex items-center justify-between text-sm pt-1">
          <label htmlFor="rememberMe" className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border border-white bg-white appearance-none checked:bg-[var(--primary)] checked:border-[var(--primary)] checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2012%2010%22%20fill=%22none%22%3E%3Cpath%20d=%22M1%205L4.5%208.5L11%201.5%22%20stroke=%22%23111417%22%20stroke-width=%223%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3Cpath%20d=%22M1%205L4.5%208.5L11%201.5%22%20stroke=%22%23D4AF37%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:10px_10px]"
            />
            Remember me
          </label>
          <Link href="/forgotPassword" className="text-[var(--gold)] hover:opacity-80 transition-colors text-sm font-semibold">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={isLoading}
          className="group mt-2 w-full h-[var(--button-h)] bg-[var(--primary)] hover:opacity-90 text-white font-bold rounded-[var(--radius-lg)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Log in</span>
              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-[var(--text-secondary)] font-medium pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[var(--gold)] hover:opacity-80 transition-colors">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

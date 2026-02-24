"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, CheckCircle } from "lucide-react";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscureConfirmPassword, setObscureConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Validations
  const validateFullName = (value: string) => {
    if (!value) return "Full name is required";
    if (value.length < 2) return "Full name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Full name can only contain letters and spaces";
    return null;
  };

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return null;
  };

  const handleSignup = async () => {
    if (!agreedToTerms) {
      setError("Please agree to Terms & Conditions");
      return;
    }

    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(confirmPassword);

    if (fullNameError || emailError || passwordError || confirmError) {
      setError(fullNameError || emailError || passwordError || confirmError || "");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await handleRegister({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
          Create Account
        </h2>
        <p className="text-[var(--text-secondary)] font-medium text-base">
          Get started with your free account
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-[var(--radius-lg)]">
          <p className="text-[var(--error)] text-sm font-medium flex items-center gap-2">
            ⚠️ {error}
          </p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-9">
        {/* Full Name */}
        <div className="space-y-2 mb-5">
          {/* <label htmlFor="fullName" className="block text-sm font-bold text-[var(--text-secondary)] ml-1">
            Full Name
          </label> */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <User className="h-5 w-5 transition-colors text-[var(--text-muted)] group-focus-within:text-[var(--gold)]" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-[var(--input-h)] pl-14 pr-4 border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              placeholder="Full Name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 mb-5">
          {/* <label htmlFor="email" className="block text-sm font-bold text-[var(--text-secondary)] ml-1">
          </label> */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 transition-colors text-[var(--text-muted)] group-focus-within:text-[var(--gold)]" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[var(--input-h)] pl-14 pr-4 border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2 mb-5">
          {/* <label htmlFor="password" className="block text-sm font-bold text-[var(--text-secondary)] ml-1">
            Password
          </label> */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 transition-colors text-[var(--text-muted)] group-focus-within:text-[var(--gold)]" />
            </div>
            <input
              id="password"
              name="password"
              type={obscurePassword ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[var(--input-h)] pl-14 pr-4 border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              placeholder="Password"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2 mb-5">
          {/* <label htmlFor="confirmPassword" className="block text-sm font-bold text-[var(--text-secondary)] ml-1">
            Confirm Password
          </label> */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 transition-colors text-[var(--text-muted)] group-focus-within:text-[var(--gold)]" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={obscureConfirmPassword ? "password" : "text"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[var(--input-h)] pl-14 pr-4 border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-input)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        {/* Terms & Show Passwords row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 accent-[var(--gold)] border-[var(--border)] rounded cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-[var(--text-secondary)] font-medium">
              I agree to the Terms & Conditions
            </label>
          </div>
          <button
            type="button"
            onClick={() => { setObscurePassword(!obscurePassword); setObscureConfirmPassword(!obscureConfirmPassword); }}
            className="text-xs font-semibold text-[var(--gold)] hover:opacity-80 transition-colors"
          >
            {obscurePassword ? "Show" : "Hide"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full h-[var(--button-h)] bg-[var(--primary)] hover:opacity-90 text-white font-bold rounded-[var(--radius-lg)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 mt-4"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-8 text-center text-[var(--text-secondary)] font-medium">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[var(--gold)] hover:opacity-80 transition-colors ml-1">
          Log in
        </Link>
      </p>
    </div>
  );
}

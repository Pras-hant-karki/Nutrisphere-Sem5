"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, CheckCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { handleRegister } from "@/lib/actions/auth-action";

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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">
          Join NutriSphere
        </h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Create your account to start your nutrition journey
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-[var(--radius-lg)] flex items-center gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 text-[var(--error)] shrink-0" />
          <p className="text-[var(--error)] text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-4">
        <FieldRow id="fullName" label="Full Name" icon={<User className="w-5 h-5" />}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-full w-full bg-transparent px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
        </FieldRow>

        <FieldRow id="email" label="Email Address" icon={<Mail className="w-5 h-5" />}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-full w-full bg-transparent px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
        </FieldRow>

        <FieldRow id="password" label="Password" icon={<Lock className="w-5 h-5" />}>
          <div className="h-full w-full flex items-center">
            <input
              id="password"
              name="password"
              type={obscurePassword ? "password" : "text"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <FieldRow id="confirmPassword" label="Confirm Password" icon={<Lock className="w-5 h-5" />}>
          <div className="h-full w-full flex items-center">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={obscureConfirmPassword ? "password" : "text"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
            />
            <button
              type="button"
              onClick={() => setObscureConfirmPassword(!obscureConfirmPassword)}
              className="h-full px-3 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label={obscureConfirmPassword ? "Show password" : "Hide password"}
            >
              {obscureConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </FieldRow>

        <div className="pt-1 flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 cursor-pointer rounded border border-white bg-white appearance-none checked:bg-[var(--primary)] checked:border-[var(--primary)] checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2012%2010%22%20fill=%22none%22%3E%3Cpath%20d=%22M1%205L4.5%208.5L11%201.5%22%20stroke=%22%23111417%22%20stroke-width=%223%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3Cpath%20d=%22M1%205L4.5%208.5L11%201.5%22%20stroke=%22%23D4AF37%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:10px_10px]"
          />
          <label htmlFor="terms" className="text-sm text-[var(--text-secondary)] leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-[var(--gold)] hover:underline font-medium">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[var(--gold)] hover:underline font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group mt-2 w-full h-[var(--button-h)] bg-[var(--primary)] hover:opacity-90 text-white font-bold rounded-[var(--radius-lg)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[var(--text-secondary)] text-sm font-medium">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[var(--gold)] hover:opacity-80 transition-colors">
          Sign in here
        </Link>
      </p>
    </div>
  );
}

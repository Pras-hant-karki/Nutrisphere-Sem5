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
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[14px] font-semibold text-[#8B8B8B] tracking-wide ml-1 select-none">
        {label}
      </label>
      <div className="group relative flex items-center h-[56px] w-full border border-[#333333] rounded-[16px] bg-[#1A1A1A] transition-all duration-300 focus-within:border-[#D4AF37] focus-within:bg-[#222222] focus-within:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] hover:border-[#555555]">
        <div className="absolute left-4 flex flex-col justify-center items-center text-[#666666] group-focus-within:text-[#D4AF37] transition-colors duration-300 pointer-events-none">
          {icon}
        </div>
        {children}
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
    <div className="w-full max-w-[420px] mx-auto px-4 md:px-0">
      <div className="text-center mb-10">
        <h2 className="text-[32px] font-extrabold text-[#FFFFFF] mb-3 tracking-tight">
          Join NutriSphere
        </h2>
        <p className="text-[#8B8B8B] text-[15px] font-medium leading-relaxed">
          Create your account to start your nutrition journey
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#EF4444]/15 border border-[#EF4444]/40 rounded-[14px] flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
          <p className="text-[#EF4444] text-[14px] font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-5">
        <div className="flex flex-col">
          <FieldRow id="fullName" label="Full Name" icon={<User className="w-[22px] h-[22px]" />}>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-full bg-transparent pl-[52px] pr-4 text-white placeholder:text-[#555555] outline-none text-[16px] font-medium tracking-wide rounded-[16px]"
            />
          </FieldRow>
        </div>

        <div className="flex flex-col">
          <FieldRow id="email" label="Email Address" icon={<Mail className="w-[22px] h-[22px]" />}>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full bg-transparent pl-[52px] pr-4 text-white placeholder:text-[#555555] outline-none text-[16px] font-medium tracking-wide rounded-[16px]"
            />
          </FieldRow>
        </div>

        <div className="flex flex-col">
          <FieldRow id="password" label="Password" icon={<Lock className="w-[22px] h-[22px]" />}>
            <div className="relative w-full h-full flex items-center justify-end">
              <input
                id="password"
                name="password"
                type={obscurePassword ? "password" : "text"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent pl-[52px] pr-12 text-white placeholder:text-[#555555] outline-none text-[16px] font-medium tracking-wide rounded-[16px]"
              />
              <button
                type="button"
                onClick={() => setObscurePassword(!obscurePassword)}
                className="relative z-10 mr-2 p-2 text-[#666666] hover:text-[#D4AF37] transition-colors rounded-[12px] hover:bg-white/5 outline-none focus:text-[#D4AF37]"
                aria-label={obscurePassword ? "Show password" : "Hide password"}
              >
                {obscurePassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
              </button>
            </div>
          </FieldRow>
        </div>

        <div className="flex flex-col">
          <FieldRow id="confirmPassword" label="Confirm Password" icon={<Lock className="w-[22px] h-[22px]" />}>
            <div className="relative w-full h-full flex items-center justify-end">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={obscureConfirmPassword ? "password" : "text"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent pl-[52px] pr-12 text-white placeholder:text-[#555555] outline-none text-[16px] font-medium tracking-wide rounded-[16px]"
              />
              <button
                type="button"
                onClick={() => setObscureConfirmPassword(!obscureConfirmPassword)}
                className="relative z-10 mr-2 p-2 text-[#666666] hover:text-[#D4AF37] transition-colors rounded-[12px] hover:bg-white/5 outline-none focus:text-[#D4AF37]"
                aria-label={obscureConfirmPassword ? "Show password" : "Hide password"}
              >
                {obscureConfirmPassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
              </button>
            </div>
          </FieldRow>
        </div>

        <div className="pt-2 flex items-start gap-3 pl-1">
          <div className="relative flex items-center justify-center w-[20px] h-[20px] mt-0.5 shrink-0">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="peer absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full h-full rounded-[4px] border-[2px] border-[#555555] peer-hover:border-[#D4AF37] peer-checked:bg-[#D4AF37] peer-checked:border-[#D4AF37] transition-all flex items-center justify-center pointer-events-none">
              <CheckCircle className="w-[14px] h-[14px] text-[#1A1A1A] opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
            </div>
          </div>
          <label htmlFor="terms" className="text-[14px] text-[#A5A5A5] leading-relaxed select-none cursor-pointer">
            I agree to the{" "}
            <Link href="/terms" className="text-[#D4AF37] hover:text-[#F3CD55] font-semibold transition-colors" onClick={(e) => e.stopPropagation()}>
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#D4AF37] hover:text-[#F3CD55] font-semibold transition-colors" onClick={(e) => e.stopPropagation()}>
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group mt-6 w-full h-[56px] bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-[17px] rounded-[16px] transition-all duration-300 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2.5"
        >
          {isLoading ? (
            <>
              <div className="w-[22px] h-[22px] border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="tracking-wide">Creating account...</span>
            </>
          ) : (
            <>
              <span className="tracking-wide">Create Account</span>
              <CheckCircle className="w-[22px] h-[22px] opacity-90 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-[#A5A5A5] text-[15px] font-medium">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#D4AF37] hover:text-[#F3CD55] transition-colors ml-1">
          Sign in here
        </Link>
      </p>
    </div>
  );
}

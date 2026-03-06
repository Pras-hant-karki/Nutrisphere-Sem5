"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { handleRegister } from "@/lib/actions/auth-action";
import { setAuth } from "@/lib/auth-helpers";

type FieldRowProps = {
  icon: ReactNode;
  children: ReactNode;
};

function FieldRow({ icon, children }: FieldRowProps) {
  return (
    /* HEIGHT: Change !h-[72px] to increase/decrease row thickness */
    <div className="flex items-center w-full border-2 border-[#FACC15] rounded-[20px] bg-[#1E1E1E] overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-[#FACC15]/10 !h-[72px]">
      {/* ICON GUTTER: Fixed width ensures icons never overlap with typing text */}
      <div className="flex justify-center items-center min-w-[64px] text-white border-r border-white/10">
        {icon}
      </div>
      <div className="flex-1 h-full relative">
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

  const handleSignup = async () => {
    if (!agreedToTerms) {
      setError("Please agree to Terms & Conditions");
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
        // persist token + user in localStorage for client-side helpers
        if (result.token && result.data) {
          setAuth(result.token, result.data);
        }
        const role = result.data?.role || result.data?.user?.role;
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/home");
        }
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
    <div className="w-full max-w-[480px] mx-auto px-4">
      {/* HEADING POSITION: Increase !mb-[100px] to push the form further down from the title */}
      <div className="mt-6 !mb-[80px]">
        {/* TEXT SIZE: Change !text-[64px] for title scale */}
        <h2 className="!text-[64px] font-black text-[#FACC15] leading-none tracking-tight">
          Register
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* FORM SPACING: Change !gap-y-6 to adjust space between input rows */}
      <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="flex flex-col !gap-y-6">
        
        {/* Full Name */}
        <FieldRow icon={<User className="w-6 h-6" />}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            /* TEXT SIZE: Change !text-[18px] for input font size */
            className="w-full h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[18px] font-medium"
          />
        </FieldRow>

        {/* Email */}
        <FieldRow icon={<Mail className="w-6 h-6" />}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[18px] font-medium"
          />
        </FieldRow>

        {/* Password */}
        <FieldRow icon={<Lock className="w-6 h-6" />}>
          <div className="flex items-center h-full w-full">
            <input
              type={obscurePassword ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[18px] font-medium"
            />
            {/* EYE POSITION: Increase !mr-8 to move icon further LEFT from the border */}
            <button
              type="button"
              onClick={() => setObscurePassword(!obscurePassword)}
              className="!mr-6 text-gray-400 hover:text-[#FACC15] transition-colors"
            >
              {obscurePassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </FieldRow>

        {/* Confirm Password */}
        <FieldRow icon={<Lock className="w-6 h-6" />}>
          <div className="flex items-center h-full w-full">
            <input
              type={obscureConfirmPassword ? "password" : "text"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[18px] font-medium"
            />
            <button
              type="button"
              onClick={() => setObscureConfirmPassword(!obscureConfirmPassword)}
              className="!mr-6 text-gray-400 hover:text-[#FACC15] transition-colors"
            >
              {obscureConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </FieldRow>

        {/* Terms & Conditions Checkbox */}
        <div className="pt-2 flex items-start gap-3 pl-1">
          <label className="relative flex items-center justify-center w-6 h-6 mt-0.5 shrink-0 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="hidden"
            />
            {/* Custom UI: Transparent with white border, turns black on check */}
            <div className={`w-full h-full rounded border-2 transition-all flex items-center justify-center 
              ${agreedToTerms ? 'bg-black border-white' : 'bg-transparent border-white'}`}>
              {agreedToTerms && <Check className="text-white w-4 h-4" strokeWidth={4} />}
            </div>
          </label>
          <p className="text-[14px] text-gray-400 font-medium">
            I agree to the <Link href="/terms" className="text-[#FACC15] font-bold">Terms & Conditions</Link> and <Link href="/privacy" className="text-[#FACC15] font-bold">Privacy Policy</Link>
          </p>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          /* SPACING: mt-4 controls the gap between the checkbox above and this button */
          className="w-full !h-[70px] bg-[#39FF14] hover:bg-[#2edb10] text-black font-black !text-[24px] rounded-full transition-all shadow-[0_10px_20px_rgba(57,255,20,0.2)] mt-4"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* GAP FIX: Change !mt-10 to !mt-20, !mt-24, or !mt-32 
          This increases the vertical space between the Register button and this text.
      */}
      <p className="!mt-6 text-center text-white text-[18px]">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#FACC15] hover:underline ml-1">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
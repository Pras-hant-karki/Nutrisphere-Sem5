"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/auth-action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { AlertCircle, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

type FieldRowProps = {
  icon: ReactNode;
  children: ReactNode;
};

function FieldRow({ icon, children }: FieldRowProps) {
  return (
    <div className="flex items-center w-full border-2 border-[#FF0000] rounded-[20px] bg-[#1E1E1E] overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-[#FF0000]/20 !h-[72px]">
      <div className="flex justify-center items-center min-w-[64px] text-white border-r border-white/10">
        {icon}
      </div>
      <div className="flex-1 h-full relative">{children}</div>
    </div>
  );
}

export default function ResetPasswordForm({ token }: { token: string }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const router = useRouter();
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscureConfirmPassword, setObscureConfirmPassword] = useState(true);
  const [serverMessage, setServerMessage] = useState<string>("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const onSubmit = async (data: ResetPasswordDTO) => {
    const response = await handleResetPassword(token, data.password);
    setServerMessage(response.message);
    setIsErrorMessage(!response.success);

    if (response.success) {
      router.replace("/login");
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto px-4">
      <div className="mt-10 !mb-[60px]">
        <h2 className="!text-[58px] font-black text-[#FF0000] leading-none tracking-tight">
          Reset Password
        </h2>
      </div>

      {!token && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-500 text-sm font-medium">Reset token is missing.</p>
        </div>
      )}

      {serverMessage && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${isErrorMessage ? "bg-red-500/10 border border-red-500/50" : "bg-red-500/10 border border-red-500/40"}`}>
          <AlertCircle className={`w-5 h-5 ${isErrorMessage ? "text-red-500" : "text-red-400"}`} />
          <p className={`text-sm font-medium ${isErrorMessage ? "text-red-500" : "text-red-300"}`}>
            {serverMessage}
          </p>
        </div>
      )}

      <form className="flex flex-col !gap-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FieldRow icon={<Lock className="w-6 h-6" />}>
            <div className="flex items-center h-full w-full">
              <input
                type={obscurePassword ? "password" : "text"}
                id="password"
                placeholder="New password"
                {...register("password")}
                className="flex-1 h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[20px] font-medium"
              />
              <button
                type="button"
                onClick={() => setObscurePassword(!obscurePassword)}
                className="!mr-8 text-gray-400 hover:text-[#FF0000] transition-colors"
              >
                {obscurePassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </FieldRow>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <FieldRow icon={<Lock className="w-6 h-6" />}>
            <div className="flex items-center h-full w-full">
              <input
                type={obscureConfirmPassword ? "password" : "text"}
                id="confirmPassword"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="flex-1 h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[20px] font-medium"
              />
              <button
                type="button"
                onClick={() => setObscureConfirmPassword(!obscureConfirmPassword)}
                className="!mr-8 text-gray-400 hover:text-[#FF0000] transition-colors"
              >
                {obscureConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </FieldRow>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full !h-[70px] bg-[#FF0000] hover:bg-[#CC0000] text-white font-black !text-[28px] rounded-full shadow-lg disabled:opacity-60"
          disabled={isSubmitting || !token}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>

        <div className="flex items-center justify-between text-[16px] font-semibold">
          <Link href="/login" className="flex items-center gap-2 text-gray-300 hover:text-[#FF0000] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <Link href="/forgotPassword" className="text-[#FF0000] hover:underline">
            Request another reset email
          </Link>
        </div>
      </form>
    </div>
  );
}

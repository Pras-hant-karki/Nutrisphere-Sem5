"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4" style={{ color: '#D4AF37' }}>
        Forgot password
      </h1>

      <p className="text-sm text-center mb-6" style={{ color: '#9FB3A6' }}>
        Enter your email to reset your password
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full h-11 border rounded-md px-3 mb-4"
        style={{ 
          backgroundColor: '#1B211D',
          borderColor: '#26322B',
          color: '#FFFFFF',
          borderWidth: '2px'
        }}
        onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
        onBlur={(e) => e.target.style.borderColor = '#26322B'}
      />

      <button className="w-full h-11 rounded-md font-semibold" style={{ backgroundColor: '#2ECC71', color: '#0F1310' }}>
        Reset password
      </button>

      <div className="text-center mt-4">
        <Link href="/login" className="text-sm hover:underline" style={{ color: '#D4AF37' }}>
          ← Back to login
        </Link>
      </div>
    </div>
  );
}

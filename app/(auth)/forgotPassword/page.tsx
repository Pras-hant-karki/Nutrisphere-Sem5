"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-center mb-3" style={{ color: "#D4AF37" }}>
        Forgot password
      </h1>

      <p className="text-sm text-center mb-8" style={{ color: "#9FB3A6" }}>
        Enter your email to reset your password
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full h-12 border rounded-xl px-4 mb-5 text-base outline-none transition-all"
        style={{
          backgroundColor: "#1B211D",
          borderColor: "#26322B",
          color: "#FFFFFF",
          borderWidth: "2px",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
        onBlur={(e) => (e.target.style.borderColor = "#26322B")}
      />

      <button
        className="w-full h-12 rounded-xl font-bold shadow-md"
        style={{ backgroundColor: "#2ECC71", color: "#0F1310" }}
      >
        Reset password
      </button>

      <div className="text-center mt-6">
        <Link href="/login" className="text-sm hover:underline" style={{ color: "#D4AF37" }}>
          ← Back to login
        </Link>
      </div>
    </div>
  );
}

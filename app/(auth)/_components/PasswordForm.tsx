import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">
          Forgot Password
        </h1>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Enter your email and we will send reset instructions
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2.5">
          <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-secondary)]">
            Email Address
          </label>
          <div className="h-[var(--input-h)] w-full border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-input)] transition-colors focus-within:border-[var(--gold)]">
            <div className="h-full w-full flex items-center">
              <div className="h-full w-12 shrink-0 flex items-center justify-center border-r border-[var(--border)] text-[var(--text-muted)]">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 h-full">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-full w-full bg-transparent px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <button className="group mt-2 w-full h-[var(--button-h)] bg-[var(--primary)] hover:opacity-90 text-white font-bold rounded-[var(--radius-lg)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/40 active:scale-[0.98]">
          Send Reset Link
        </button>

        <div className="flex items-center gap-2 pt-2">
          <ArrowLeft className="w-4 h-4 text-[var(--text-secondary)]" />
          <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:opacity-80 transition-colors font-medium">
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}

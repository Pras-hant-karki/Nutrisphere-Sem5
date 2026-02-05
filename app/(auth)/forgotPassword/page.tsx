import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full">
      <h1 className="text-4xl font-extrabold mb-10 text-[#D4AF37]">
        Forgot Password
      </h1>

      <div className="space-y-8">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-white/70 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-14 rounded-xl pl-12 pr-6 text-base text-white bg-[#1B211D] border-2 border-[#E53935] outline-none transition-all focus:border-[#ff5252]"
          />
        </div>

        <button className="w-full h-14 rounded-full font-semibold text-white text-lg bg-[#E53935] hover:bg-[#ff5252] transition-colors">
          Reset password
        </button>

        <div className="text-left pt-2">
          <Link href="/login" className="text-base text-[#9FB3A6] hover:underline">
            ← Go back
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full">
      <h1 className="text-4xl font-extrabold mb-10 text-[#D4AF37] italic">
        Forgot Password
      </h1>

      <div className="space-y-6">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-white/50 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </span>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-14 rounded-xl pl-14 pr-6 text-base text-white bg-[#2A2A2A] border border-[#E53935] outline-none transition-all focus:border-[#ff5252] placeholder:text-white/40 placeholder:text-sm"
          />
        </div>

        <button className="w-full h-14 rounded-full font-bold text-white text-lg bg-[#E53935] hover:bg-[#ff5252] transition-colors">
          Reset password
        </button>

        <div className="flex items-center gap-2 pt-2">
          <svg className="w-4 h-4 text-[#9FB3A6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <Link href="/login" className="text-base text-[#9FB3A6] hover:underline">
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}

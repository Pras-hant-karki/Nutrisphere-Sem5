import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriSphere - Train Together, Grow Together",
  description:
    "Your personal fitness companion for training, tracking, and growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#170306]`}
      >
        {/* ═══════════════ NAVBAR ═══════════════ */}
        <header className="sticky top-0 z-50 w-full h-14 px-4 md:px-8 grid grid-cols-3 items-center bg-[#170306]/95 backdrop-blur-sm">
          {/* Left – spacer */}
          <div />

          {/* Center – nav links */}
          <nav className="flex items-center justify-center gap-5">
            <Link
              href="/"
              className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white transition-colors"
            >
              {/* Home icon */}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                />
              </svg>
              <span className="text-[10px] leading-none font-medium">Home</span>
            </Link>

            <Link
              href="/about"
              className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white transition-colors"
            >
              {/* About Us icon */}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-[10px] leading-none font-medium">
                About Us
              </span>
            </Link>
          </nav>

          {/* Right – CTA buttons */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/login">
              <button className="h-9 px-6 bg-[#d9d3d3] text-black border border-black/50 rounded-[2px] text-xs font-semibold tracking-wide shadow-[0_3px_0_rgba(0,0,0,0.5)] hover:bg-[#ece7e7] active:shadow-none active:translate-y-[2px] transition-all cursor-pointer">
                Get Started
              </button>
            </Link>
            <Link href="/register">
              <button className="h-9 px-6 bg-[#5e4a4a] text-[#f2e400] border border-[#7a5f5f] rounded-[2px] text-xs font-semibold tracking-wide hover:bg-[#6a5454] transition-all cursor-pointer">
                Create new account
              </button>
            </Link>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}

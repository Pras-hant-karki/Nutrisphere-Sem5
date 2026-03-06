"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

type FieldRowProps = {
  icon: ReactNode;
  children: ReactNode;
};

function FieldRow({ icon, children }: FieldRowProps) {
  return (
    /* HEIGHT: Using !h-[72px] to match the thickness of Login/Register inputs */
    <div className="flex items-center w-full border-2 border-[#FF0000] rounded-[20px] bg-[#1E1E1E] overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-[#FF0000]/10 !h-[72px]">
      {/* ICON GUTTER: Fixed width to prevent icon/text overlap */}
      <div className="flex justify-center items-center min-w-[64px] text-white border-r border-white/10">
        {icon}
      </div>
      <div className="flex-1 h-full relative">
        {children}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[480px] mx-auto px-4">
      
      {/* 1. HEADING POSITION: Added !mb-[80px] to move title high above the form */}
      <div className="mt-6 !mb-[80px]">
        {/* Figma color for this page is Red (#FF0000) */}
        <h1 className="!text-[64px] font-black text-[#FF0000] leading-none tracking-tight">
          Forgot Password
        </h1>
      </div>

      <div className="flex flex-col !gap-y-10">
        
        {/* Email Field Row */}
        <FieldRow icon={<Mail className="w-6 h-6" />}>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            /* !text-[18px] ensures clear visibility */
            className="w-full h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[18px] font-medium"
          />
        </FieldRow>

        {/* 2. ACTION BUTTON: 
            - !h-[70px]: Matches height of previous form buttons
            - bg-[#FF0000]: Red theme for the Reset page
        */}
        <button className="w-full !h-[70px] bg-[#FF0000] hover:bg-[#cc0000] text-white font-black !text-[24px] rounded-full transition-all shadow-[0_10px_20px_rgba(255,0,0,0.2)] mt-2">
          Reset password
        </button>

        {/* 3. GO BACK LINK:
            - mt-12: Increases space between the button and this link
            - Added cursor-pointer and hover:underline for better UX
        */}
        <div className="flex items-center gap-2 !mt-12 group cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <Link 
            href="/login" 
            className="text-[18px] text-gray-400 group-hover:text-white transition-colors font-bold"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
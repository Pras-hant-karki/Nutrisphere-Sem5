"use client";

import Link from "next/link";
import { getUser } from "@/lib/auth-helpers";
import { useState } from "react";

export default function AdminDashboard() {
  const [user] = useState(getUser());

  return (
    <div className="max-w-3xl mx-auto">
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold text-[#D4AF37] text-center mb-10">
        Welcome to Dashboard!
      </h1>

      {/* Dashboard Cards */}
      <div className="space-y-4">
        {/* Manage Sessions */}
        <Link href="/admin/appointments">
          <div className="group bg-[#171C18] border border-[#26322B] rounded-2xl p-5 hover:border-[#D4AF37]/60 hover:bg-[#1B211D] transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⏰</span>
                </div>
                <div>
                  <h3 className="text-[#D4AF37] text-lg font-semibold">Manage Sessions</h3>
                  <p className="text-[#9FB3A6] text-sm mt-0.5">Default workout · Starts at 8 AM</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-[#7C8C83] group-hover:text-[#D4AF37] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Workout Records */}
        <Link href="/admin/fitness-content">
          <div className="group bg-[#171C18] border border-[#26322B] rounded-2xl p-5 hover:border-[#D4AF37]/60 hover:bg-[#1B211D] transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✏️</span>
                </div>
                <div>
                  <h3 className="text-[#D4AF37] text-lg font-semibold">Fitness Content</h3>
                  <p className="text-[#9FB3A6] text-sm mt-0.5">Manage workout plans and content</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-[#7C8C83] group-hover:text-[#D4AF37] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Manage Users */}
        <Link href="/admin/users">
          <div className="group bg-[#171C18] border border-[#26322B] rounded-2xl p-5 hover:border-[#D4AF37]/60 hover:bg-[#1B211D] transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h3 className="text-[#D4AF37] text-lg font-semibold">Manage Users</h3>
                  <p className="text-[#9FB3A6] text-sm mt-0.5">View and manage all users</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-[#7C8C83] group-hover:text-[#D4AF37] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

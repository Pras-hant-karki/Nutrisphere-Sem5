"use client";

import Link from "next/link";
import { getUser } from "../../lib/auth-helpers";
import { useState } from "react";

export default function AdminDashboard() {
  const [user] = useState(getUser());

  return (
    // IMPORTANT FIX: dashboard was going behind sidebar

    <div className="min-h-screen bg-[#0F1310] px-4 py-6 md:py-10 md:pl-[280px] md:pr-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#D4AF37] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-[#9FB3A6] text-base">
            Welcome back, {user?.fullName}! 
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-[#26322B] bg-[#171C18] p-6 hover:bg-[#1B211D] hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9FB3A6] text-sm font-semibold">Total Users</p>
                <p className="text-4xl font-bold text-[#2ECC71] mt-2">--</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-[#2ECC71]/20 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#26322B] bg-[#171C18] p-6 hover:bg-[#1B211D] hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9FB3A6] text-sm font-semibold">Fitness Content</p>
                <p className="text-4xl font-bold text-[#2ECC71] mt-2">--</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-[#2ECC71]/20 flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#26322B] bg-[#171C18] p-6 hover:bg-[#1B211D] hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#9FB3A6] text-sm font-semibold">Admin Users</p>
                <p className="text-4xl font-bold text-[#2ECC71] mt-2">--</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[#26322B] bg-[#171C18] p-6 shadow-lg">
          <h2 className="text-xl font-bold text-[#D4AF37] mb-5">
             Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-5 rounded-2xl border border-[#26322B] bg-[#1B211D] hover:bg-[#242A26] hover:border-[#D4AF37] transition-all"
            >
              <div>
                <p className="font-semibold text-[#D4AF37]"> Manage Users</p>
                <p className="text-sm text-[#9FB3A6] mt-1">
                  View and manage all users
                </p>
              </div>
              <span className="text-xl text-[#C0C0C0]">→</span>
            </Link>

            <Link
              href="/admin/users/create"
              className="flex items-center justify-between p-5 rounded-2xl border border-[#26322B] bg-[#1B211D] hover:bg-[#242A26] hover:border-[#D4AF37] transition-all"
            >
              <div>
                <p className="font-semibold text-[#D4AF37]"> Create User</p>
                <p className="text-sm text-[#9FB3A6] mt-1">
                  Add a new user to system
                </p>
              </div>
              <span className="text-xl text-[#C0C0C0]">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
          <p className="text-sm font-semibold">
             More analytics and features coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}

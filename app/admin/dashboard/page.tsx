"use client";

import Link from "next/link";
import { getUser } from "@/lib/auth-helpers";
import { useState } from "react";

export default function AdminDashboard() {
  const [user] = useState(getUser());

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-12">
          <h2 className="text-white text-lg mb-1">
            Welcome, <span className="font-semibold">{user?.fullName || "Admin"}</span>
          </h2>
          <p className="text-gray-400 text-sm">User</p>
        </div>

        {/* Welcome to Dashboard Title */}
        <h1 className="text-[#D4AF37] text-4xl md:text-5xl font-bold text-center mb-16">
          Welcome to Dashboard !
        </h1>

        {/* Dashboard Cards */}
        <div className="space-y-6">
          {/* Manage Sessions */}
          <Link href="/admin/appointments">
            <div className="group relative border border-gray-700 rounded-2xl p-6 hover:border-[#D4AF37] transition-all cursor-pointer bg-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] text-xl font-semibold mb-1">
                      Manage Sessions
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Default workout
                      <br />
                      (Starts at 8 AM, 11/23/025)
                    </p>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Workout Records */}
          <Link href="/admin/fitness-content">
            <div className="group relative border border-gray-700 rounded-2xl p-6 hover:border-[#D4AF37] transition-all cursor-pointer bg-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl">✏️</span>
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] text-xl font-semibold mb-1">
                      Workout Records
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Track your workouts here everyday
                    </p>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Manage Users */}
          <Link href="/admin/users">
            <div className="group relative border border-gray-700 rounded-2xl p-6 hover:border-[#D4AF37] transition-all cursor-pointer bg-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] text-xl font-semibold mb-1">
                      Manage Users
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Know your Trainer !
                    </p>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Settings Button - Bottom Left */}
        <div className="fixed bottom-8 left-8">
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm">Settings</span>
          </Link>
        </div>

        {/* Notification Icon - Top Right */}
        <div className="fixed top-8 right-8">
          <button className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

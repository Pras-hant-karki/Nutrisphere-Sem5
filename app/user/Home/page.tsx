"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#D4AF37] mb-8 text-center">
        Welcome to Dashboard !
      </h1>

      {/* Cards */}
      <div className="space-y-4">
        {/* Sessions Card */}
        <Link href="/user/Home/sessions" className="block">
          <div className="bg-[#171C18] border border-[#26322B] rounded-2xl p-6 flex items-center justify-between hover:border-[#D4AF37] transition-all duration-300 cursor-pointer group shadow-lg">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-[#D4AF37]/10 rounded-xl">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[#D4AF37] font-bold text-xl mb-1">
                  Sessions
                </h2>
                <p className="text-[#9FB3A6] text-sm">Circuit workout</p>
                <p className="text-[#9FB3A6] text-xs mt-0.5">
                  (Starts at 8 AM, 11/23/2025)
                </p>
              </div>
            </div>

            <div className="text-white group-hover:text-[#D4AF37] transition-colors flex-shrink-0 ml-4">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Workout Records Card */}
        <Link href="/user/Home/workout-records" className="block">
          <div className="bg-[#171C18] border border-[#26322B] rounded-2xl p-6 flex items-center justify-between hover:border-[#D4AF37] transition-all duration-300 cursor-pointer group shadow-lg">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-[#D4AF37]/10 rounded-xl">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[#D4AF37] font-bold text-xl mb-1">
                  Workout Records
                </h2>
                <p className="text-[#9FB3A6] text-sm">
                  Track your workouts here everyday
                </p>
              </div>
            </div>

            <div className="text-white group-hover:text-[#D4AF37] transition-colors flex-shrink-0 ml-4">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Trainer Details Card */}
        <Link href="/user/Home/trainer-details" className="block">
          <div className="bg-[#171C18] border border-[#26322B] rounded-2xl p-6 flex items-center justify-between hover:border-[#D4AF37] transition-all duration-300 cursor-pointer group shadow-lg">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-[#D4AF37]/10 rounded-xl">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[#D4AF37] font-bold text-xl mb-1">
                  Trainer Details
                </h2>
                <p className="text-[#9FB3A6] text-sm">Know your Trainer !</p>
              </div>
            </div>

            <div className="text-white group-hover:text-[#D4AF37] transition-colors flex-shrink-0 ml-4">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

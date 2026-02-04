"use client";

import { useState } from "react";

export default function WorkoutRecordsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const workoutRecords = [
    {
      id: 1,
      name: "Morning Circuit",
      date: "Nov 22, 2025",
      duration: "45 min",
      calories: 380,
      type: "Circuit",
      exercises: 12,
    },
    {
      id: 2,
      name: "Upper Body Strength",
      date: "Nov 21, 2025",
      duration: "60 min",
      calories: 420,
      type: "Strength",
      exercises: 8,
    },
    {
      id: 3,
      name: "Evening Cardio",
      date: "Nov 20, 2025",
      duration: "30 min",
      calories: 290,
      type: "Cardio",
      exercises: 6,
    },
    {
      id: 4,
      name: "Full Body HIIT",
      date: "Nov 19, 2025",
      duration: "40 min",
      calories: 450,
      type: "HIIT",
      exercises: 10,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Workout Records</h1>
        <p className="text-[#9FB3A6]">Track your workouts here everyday</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#171C18] to-[#0F1310] border border-white/20 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-[#9FB3A6] text-sm">Total Workouts</span>
          </div>
          <p className="text-white text-3xl font-bold">24</p>
          <p className="text-[#00c853] text-xs mt-1">+3 this week</p>
        </div>

        <div className="bg-gradient-to-br from-[#171C18] to-[#0F1310] border border-white/20 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[#9FB3A6] text-sm">Total Hours</span>
          </div>
          <p className="text-white text-3xl font-bold">18.5</p>
          <p className="text-[#00c853] text-xs mt-1">+5.5 this week</p>
        </div>

        <div className="bg-gradient-to-br from-[#171C18] to-[#0F1310] border border-white/20 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <span className="text-[#9FB3A6] text-sm">Calories Burned</span>
          </div>
          <p className="text-white text-3xl font-bold">8,420</p>
          <p className="text-[#00c853] text-xs mt-1">+1,540 this week</p>
        </div>

        <div className="bg-gradient-to-br from-[#171C18] to-[#0F1310] border border-white/20 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-[#9FB3A6] text-sm">Avg Duration</span>
          </div>
          <p className="text-white text-3xl font-bold">46</p>
          <p className="text-[#9FB3A6] text-xs mt-1">minutes</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "strength", "cardio", "hiit", "circuit"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              selectedFilter === filter
                ? "bg-[#D4AF37] text-black"
                : "bg-[#171C18] text-[#9FB3A6] border border-white/20 hover:border-[#D4AF37]/50"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Workout Records List */}
      <div className="space-y-4">
        {workoutRecords.map((record) => (
          <div
            key={record.id}
            className="bg-[#171C18] border border-white/20 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Section - Workout Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{record.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-[#9FB3A6]">{record.date}</span>
                    <span className="text-[#7C8C83]">•</span>
                    <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full">
                      {record.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - Stats */}
              <div className="grid grid-cols-3 gap-6 md:gap-8">
                <div className="text-center">
                  <p className="text-[#9FB3A6] text-xs mb-1">Duration</p>
                  <p className="text-white font-bold">{record.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-[#9FB3A6] text-xs mb-1">Calories</p>
                  <p className="text-white font-bold">{record.calories}</p>
                </div>
                <div className="text-center">
                  <p className="text-[#9FB3A6] text-xs mb-1">Exercises</p>
                  <p className="text-white font-bold">{record.exercises}</p>
                </div>
              </div>

              {/* View Details Button */}
              <button className="md:ml-4 px-6 py-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full font-semibold transition-all duration-300 text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Workout Button */}
      <div className="mt-8 flex justify-center">
        <button className="px-8 py-3 bg-[#D4AF37] hover:bg-[#c9a227] text-black font-bold rounded-full transition-all duration-300 shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log New Workout
        </button>
      </div>
    </div>
  );
}

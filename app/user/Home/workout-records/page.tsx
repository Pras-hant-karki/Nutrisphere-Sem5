"use client";

import { useState } from "react";

export default function WorkoutRecordsPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-6 text-center">
        Workout Records
      </h1>

      {/* Notepad Area */}
      <div className="bg-[#171C18] border border-[#26322B] rounded-xl p-5 flex-1 min-h-[350px]">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your workout notes here...

Example:
- Monday: 30 min cardio, 20 min strength
- Tuesday: Rest day
- Wednesday: Full body workout 45 min
- Thursday: Yoga 30 min
- Friday: HIIT 25 min

Track your daily progress, sets, reps, and personal records!"
          className="w-full h-full bg-transparent text-white/90 placeholder:text-[#7C8C83] outline-none resize-none text-base leading-relaxed"
        />
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button className="px-8 py-2.5 bg-[#00c853] hover:bg-[#00b347] text-white font-bold rounded-full transition-all duration-300 shadow-lg">
          Save Notes
        </button>
      </div>
    </div>
  );
}

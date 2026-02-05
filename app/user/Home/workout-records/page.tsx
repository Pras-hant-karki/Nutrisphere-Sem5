"use client";

import { useState } from "react";

export default function WorkoutRecordsPage() {
  const [notes, setNotes] = useState("");

  return (
    <div className="w-full">
      {/* Page Header */}
      <h1 className="text-4xl font-bold italic text-[#D4AF37] mb-10 text-center">
        Workout Records
      </h1>

      {/* Notepad Area */}
      <div className="bg-[#1B211D] border-2 border-[#26322B] rounded-2xl p-6 min-h-[400px]">
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
          className="w-full h-[350px] bg-transparent text-white/90 placeholder:text-[#7C8C83] outline-none resize-none text-base leading-relaxed"
        />
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="px-8 py-3 bg-[#00c853] hover:bg-[#00b347] text-white font-bold rounded-full transition-all duration-300 shadow-lg">
          Save Notes
        </button>
      </div>
    </div>
  );
}

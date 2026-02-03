"use client";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#0F1310]">
      <div className="max-w-7xl">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Progress Tracking</h1>
        <p className="text-[#9FB3A6] mb-8">Track your fitness journey</p>

        <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 shadow-lg">
          <div className="text-center py-12">
            <p className="text-[#9FB3A6] text-lg">📊 Your progress will be displayed here</p>
            <p className="text-[#7C8C83] text-sm mt-2">Monitor your fitness achievements and milestones!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

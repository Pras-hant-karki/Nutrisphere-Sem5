"use client";

// Sample weekly schedule data - this would come from backend in real app
const weeklySchedule = [
  {
    day: "Sunday",
    sessions: [
      { time: "7:00 - 8:30 AM", highlighted: true },
      { time: "5:00 - 6:30 AM", highlighted: false },
    ],
  },
  {
    day: "Monday",
    sessions: [
      { time: "7:00 - 8:30 AM", highlighted: true },
      { time: "9:00 - 10:30 AM", highlighted: false },
      { time: "7:00 - 8:30 AM", highlighted: false },
    ],
  },
  {
    day: "Tuesday",
    sessions: [],
  },
  {
    day: "Wednesday",
    sessions: [],
  },
  {
    day: "Thursday",
    sessions: [],
  },
  {
    day: "Friday",
    sessions: [],
  },
  {
    day: "Saturday",
    sessions: [],
  },
];

export default function SessionsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-6 text-center">
        Workout Sessions
      </h1>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        {weeklySchedule.map((daySchedule, idx) => (
          <div key={idx} className="bg-[#171C18] border border-[#26322B] rounded-xl p-4">
            <h2 className="text-white font-semibold text-sm mb-3">{daySchedule.day}</h2>
            {daySchedule.sessions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {daySchedule.sessions.map((session, sessionIdx) => (
                  <div
                    key={sessionIdx}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      session.highlighted
                        ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]"
                        : "bg-[#1B211D] border border-[#26322B] text-[#9FB3A6]"
                    }`}
                  >
                    {session.time}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#7C8C83] text-sm">No sessions scheduled</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <div className="w-full">
      {/* Page Header */}
      <h1 className="text-4xl font-bold italic text-[#D4AF37] mb-10 text-center">
        Workout Sessions
      </h1>

      {/* Weekly Schedule */}
      <div className="space-y-8">
        {weeklySchedule.map((daySchedule, idx) => (
          <div key={idx}>
            {/* Day Label */}
            <h2 className="text-white font-bold text-lg mb-4">{daySchedule.day}</h2>
            
            {/* Time Slots */}
            {daySchedule.sessions.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {daySchedule.sessions.map((session, sessionIdx) => (
                  <div
                    key={sessionIdx}
                    className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all ${
                      session.highlighted
                        ? "bg-[#26322B] border-[#D4AF37] text-white"
                        : "bg-[#1B211D] border-[#26322B] text-[#9FB3A6]"
                    }`}
                  >
                    {session.time}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#7C8C83] text-sm">No sessions scheduled</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

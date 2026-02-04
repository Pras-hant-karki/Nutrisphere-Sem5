"use client";

export default function SessionsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Sessions</h1>
        <p className="text-[#9FB3A6]">View and manage your workout sessions</p>
      </div>

      {/* Current Session Card */}
      <div className="bg-[#171C18] border border-white/20 rounded-2xl p-8 mb-6 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold rounded-full mb-3">
              Active Session
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">Circuit Workout</h2>
            <p className="text-[#9FB3A6] mb-1">High-intensity interval training</p>
          </div>
          <div className="text-right">
            <div className="text-[#D4AF37] text-sm font-semibold mb-1">Duration</div>
            <div className="text-white text-2xl font-bold">45 min</div>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0F1310] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[#9FB3A6] text-sm">Date</span>
            </div>
            <p className="text-white font-semibold">November 23, 2025</p>
          </div>

          <div className="bg-[#0F1310] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[#9FB3A6] text-sm">Time</span>
            </div>
            <p className="text-white font-semibold">8:00 AM</p>
          </div>

          <div className="bg-[#0F1310] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[#9FB3A6] text-sm">Location</span>
            </div>
            <p className="text-white font-semibold">Gym Floor A</p>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-[#D4AF37] hover:bg-[#c9a227] text-black font-semibold py-3 rounded-full transition-all duration-300">
          Start Session
        </button>
      </div>

      {/* Upcoming Sessions */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Upcoming Sessions</h3>
        <div className="space-y-4">
          {[
            { name: "Strength Training", date: "Nov 24, 2025", time: "9:00 AM", type: "Upper Body" },
            { name: "Cardio Blast", date: "Nov 25, 2025", time: "7:00 AM", type: "HIIT" },
            { name: "Yoga & Stretch", date: "Nov 26, 2025", time: "6:00 PM", type: "Recovery" },
          ].map((session, idx) => (
            <div
              key={idx}
              className="bg-[#171C18] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{session.name}</h4>
                  <p className="text-[#9FB3A6] text-sm">{session.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-semibold">{session.date}</p>
                <p className="text-[#9FB3A6] text-sm">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

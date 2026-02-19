"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Users, MapPin, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  day: string;
  date: string;
  sessions: {
    id: string;
    time: string;
    title: string;
    trainer: string;
    capacity: number;
    booked: number;
    location: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    registered: boolean;
  }[];
}

export default function SessionsPage() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const weeklySchedule: Session[] = [
    {
      id: "sun",
      day: "Sunday",
      date: "Feb 23",
      sessions: [
        {
          id: "1",
          time: "7:00 - 8:30 AM",
          title: "Circuit Workout",
          trainer: "John Smith",
          capacity: 15,
          booked: 12,
          location: "Studio A",
          level: "Intermediate",
          registered: true,
        },
        {
          id: "2",
          time: "5:00 - 6:30 PM",
          title: "Strength Training",
          trainer: "Mike Davis",
          capacity: 10,
          booked: 8,
          location: "Studio B",
          level: "Advanced",
          registered: false,
        },
      ],
    },
    {
      id: "mon",
      day: "Monday",
      date: "Feb 24",
      sessions: [
        {
          id: "3",
          time: "6:00 - 7:00 AM",
          title: "Yoga & Stretching",
          trainer: "Sarah Johnson",
          capacity: 20,
          booked: 15,
          location: "Studio C",
          level: "Beginner",
          registered: true,
        },
      ],
    },
    {
      id: "tue",
      day: "Tuesday",
      date: "Feb 25",
      sessions: [
        {
          id: "4",
          time: "7:00 - 8:30 AM",
          title: "HIIT Workout",
          trainer: "John Smith",
          capacity: 12,
          booked: 12,
          location: "Studio A",
          level: "Advanced",
          registered: true,
        },
      ],
    },
    {
      id: "wed",
      day: "Wednesday",
      date: "Feb 26",
      sessions: [
        {
          id: "5",
          time: "5:00 - 6:00 PM",
          title: "Cardio Blast",
          trainer: "Emma Wilson",
          capacity: 18,
          booked: 14,
          location: "Studio A",
          level: "Intermediate",
          registered: false,
        },
        {
          id: "6",
          time: "6:30 - 8:00 PM",
          title: "Weight Lifting",
          trainer: "Mike Davis",
          capacity: 10,
          booked: 7,
          location: "Studio B",
          level: "Advanced",
          registered: false,
        },
      ],
    },
    {
      id: "thu",
      day: "Thursday",
      date: "Feb 27",
      sessions: [],
    },
    {
      id: "fri",
      day: "Friday",
      date: "Feb 28",
      sessions: [
        {
          id: "7",
          time: "7:00 - 8:00 AM",
          title: "Pilates Core",
          trainer: "Sarah Johnson",
          capacity: 16,
          booked: 13,
          location: "Studio C",
          level: "Beginner",
          registered: true,
        },
        {
          id: "8",
          time: "6:00 - 7:30 PM",
          title: "CrossFit",
          trainer: "John Smith",
          capacity: 14,
          booked: 11,
          location: "Studio A",
          level: "Advanced",
          registered: true,
        },
      ],
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#1A1008]/50 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-[#D4AF37]" />
        </button>
        <h1 className="text-4xl font-bold text-white">Weekly Schedule</h1>
      </div>

      <div className="space-y-4">
        {weeklySchedule.map((day) => (
          <div
            key={day.id}
            className="bg-[#161B17] border border-[#2A3630] rounded-xl overflow-hidden hover:border-[#D4AF37]/40 transition-colors"
          >
            <button
              onClick={() =>
                setSelectedSession(selectedSession === day.id ? null : day.id)
              }
              className="w-full p-4 flex items-center justify-between hover:bg-[#1A1008]/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-[#D4AF37]" />
                <div className="text-left">
                  <p className="text-lg font-semibold text-white">{day.day}</p>
                  <p className="text-sm text-[#7C8C83]">{day.date}</p>
                </div>
              </div>
              <span className="text-[#7C8C83]">
                {day.sessions.length} session{day.sessions.length !== 1 ? "s" : ""}
              </span>
            </button>

            {selectedSession === day.id && (
              <div className="border-t border-[#2A3630] p-4 bg-[#0F1310]/50 space-y-3">
                {day.sessions.length > 0 ? (
                  day.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-[#161B17] border border-[#2A3630] rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">
                            {session.title}
                          </h3>
                          <div className="space-y-1 text-sm text-[#9FB3A6]">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-[#D4AF37]" />
                              <span>{session.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-[#D4AF37]" />
                              <span>{session.trainer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-[#D4AF37]" />
                              <span>{session.location}</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.level === "Beginner"
                              ? "bg-blue-500/20 text-blue-400"
                              : session.level === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {session.level}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#7C8C83]">Capacity</span>
                          <span className="text-[#9FB3A6]">
                            {session.booked} / {session.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-[#0F1310] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#D4AF37] to-[#E5C158] h-full rounded-full"
                            style={{
                              width: `${(session.booked / session.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <button className="w-full py-2 bg-[#D4AF37] hover:bg-[#c4a032] text-[#1A1008] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                        {session.registered ? (
                          <>
                            <CheckCircle size={18} />
                            Booked
                          </>
                        ) : (
                          <>
                            <Calendar size={18} />
                            Book Now
                          </>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[#7C8C83] text-sm">No sessions scheduled</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, Clock, Dumbbell, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-helpers";
import { buildApiUrl } from "@/lib/api/base-url";

type SessionItem = {
  _id: string;
  day: string;
  sessionName: string;
  timeRange: string;
  location: string;
  workoutTitle: string;
  exercises: string[];
  isActive: boolean;
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SessionsPage() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, SessionItem[]> = {};
    for (const day of daysOfWeek) map[day] = [];
    for (const session of sessions) {
      if (!map[session.day]) map[session.day] = [];
      map[session.day].push(session);
    }
    return map;
  }, [sessions]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/sessions"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-[#110104] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 px-4 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.push("/user/home")}
              className="inline-flex items-center gap-2 rounded-md border border-[#FFD600]/35 bg-[#1D1D1D]/70 px-3 py-2 text-sm font-medium text-[#FFD600] transition hover:bg-[#2A2A2A]"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <h1 className="text-center text-5xl font-bold tracking-tight text-[#FFD600]">
              Workout Sessions
            </h1>
            <div className="w-[78px]" />
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-[#E53935]/30 bg-[#E53935]/10 p-4 text-[#ff8c8c]">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-lg border border-[#3C3C3C] bg-[#1D1D1D]/80 p-5 text-[#D7D7D7]">
              Loading sessions...
            </div>
          ) : (
            <div className="space-y-8">
              {daysOfWeek.map((day) => (
                <section key={day}>
                  <h2 className="mb-3 text-[32px] font-semibold text-white sm:text-[34px]">{day}</h2>

                  {grouped[day]?.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {grouped[day].map((session) => (
                        <button
                          key={session._id}
                          onClick={() => setSelectedSession(session)}
                          className="h-14 rounded-sm border border-[#3C3C3C] bg-[#2A2A2A]/80 px-4 text-base font-medium text-[#D7D7D7] transition hover:border-[#FFD600]/50 hover:text-white"
                        >
                          {session.timeRange}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedSession && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-6 backdrop-blur-[1px]">
          <div className="w-full max-w-2xl rounded-lg border border-[#3A3A3A] bg-[#171717] p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#FFD600]">
                  {selectedSession.sessionName}
                </h3>
                <p className="mt-1 text-sm text-[#BBBBBB]">Session details</p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="rounded-md p-2 text-[#BEBEBE] transition hover:bg-[#2A2A2A] hover:text-white"
                aria-label="Close session details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#D2D2D2]">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-[#FFD600]" />
                <span>{selectedSession.day}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#FFD600]" />
                <span>{selectedSession.timeRange}</span>
              </div>
              {selectedSession.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#FFD600]" />
                  <span>{selectedSession.location}</span>
                </div>
              )}
              {selectedSession.workoutTitle && (
                <div className="flex items-center gap-3">
                  <Dumbbell size={16} className="text-[#FFD600]" />
                  <span>{selectedSession.workoutTitle}</span>
                </div>
              )}
            </div>

            {selectedSession.exercises.length > 0 && (
              <div className="mt-5 rounded-md border border-[#2E2E2E] bg-[#101010] p-4">
                <p className="mb-2 text-sm font-semibold text-[#FFD600]">Exercises</p>
                <div className="space-y-1 text-sm text-[#C3C3C3]">
                  {selectedSession.exercises.map((exercise, idx) => (
                    <p key={`${exercise}-${idx}`}>- {exercise}</p>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedSession(null)}
              className="mt-6 w-full rounded-md bg-[#FFD600] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#E8C500]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


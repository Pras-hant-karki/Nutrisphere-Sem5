"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { ChevronLeft, X, Clock, MapPin, Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-helpers";
import { buildApiUrl } from "@/lib/api/base-url";
import NotificationBell from "@/app/components/notification-bell";

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

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export default function SessionsPage() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/sessions"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const groupedSessions = useMemo(() => {
    const map: Record<string, SessionItem[]> = {};
    DAYS_OF_WEEK.forEach(day => map[day] = []);
    sessions.forEach(session => {
      if (map[session.day]) map[session.day].push(session);
    });
    return map;
  }, [sessions]);

  return (
    <div className="relative min-h-screen w-full bg-[#0A0705] text-white font-sans overflow-x-hidden">
      
      {/* NOTIFICATION BELL */}
      <NotificationBell className="absolute top-8 right-10 z-50" />

      {/* MAIN CONTENT WRAPPER 
          - !ml-[320px]: This creates the explicit 2-space gap from your sidebar.
          - pl-10: Extra padding to ensure text never touches the sidebar line.
      */}
      <div className="relative z-10 !ml-[40px] pl-10 pr-12">
        <div className="mx-auto w-full max-w-5xl">
          
          {/* HEADER SECTION: Aligned with the new margin */}
          <div className="flex items-center justify-between !pt-20 !mb-16">
            <button
              onClick={() => router.push("/user/home")}
              className="text-[#FACC15] hover:scale-110 transition-transform"
            >
              <ChevronLeft size={48} strokeWidth={3} />
            </button>

            <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
              Workout Sessions
            </h1>
            <div className="w-12" /> 
          </div>

          {loading ? (
            <div className="text-center text-[#FACC15] text-xl mt-20 font-bold">Loading schedule...</div>
          ) : (
            <div className="space-y-14">
              {DAYS_OF_WEEK.map((day) => (
                <section key={day} className="flex flex-col gap-2">
                  
                  {/* DAY HEADER: text-[28px] as per Figma design */}
                  <h2 className="text-[28px] font-bold text-white tracking-wide">
                    {day}
                  </h2>

                  {/* SESSIONS GRID: Placed directly below the day name */}
                  <div className="flex flex-wrap gap-10">
                    {groupedSessions[day]?.length > 0 ? (
                      groupedSessions[day].map((session) => (
                        <button
                          key={session._id}
                          onClick={() => setSelectedSession(session)}
                          className="h-[60px] min-w-[200px] px-8 rounded-xl bg-[#1E1E1E] border-2 border-transparent text-[#FACC15] font-bold text-[18px] transition-all hover:border-white hover:bg-[#252525] flex items-center justify-center shadow-lg"
                        >
                          {session.timeRange}
                        </button>
                      ))
                    ) : (
                      <div className="h-[60px] min-w-[200px] border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
                        <span className="text-white/20 font-medium italic text-[14px]">No sessions</span>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={() => setSelectedSession(null)}>
          <div 
            className="w-full max-w-md bg-[#1E1E1E] border-2 border-[#FACC15] rounded-[32px] p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedSession(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
            <h3 className="text-[32px] font-black text-[#FACC15] mb-6">{selectedSession.sessionName}</h3>
            <div className="space-y-5 text-gray-200 font-bold text-lg">
              <div className="flex items-center gap-4"><Clock size={22} className="text-[#FACC15]"/> {selectedSession.timeRange}</div>
              <div className="flex items-center gap-4"><Dumbbell size={22} className="text-[#FACC15]"/> {selectedSession.workoutTitle}</div>
              <div className="flex items-center gap-4"><MapPin size={22} className="text-[#FACC15]"/> {selectedSession.location}</div>
            </div>
            <button
              onClick={() => setSelectedSession(null)}
              className="mt-10 w-full !h-[60px] bg-[#FACC15] text-black font-black text-[20px] rounded-full transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
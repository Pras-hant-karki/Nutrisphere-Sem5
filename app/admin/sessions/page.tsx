"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarClock, Check, ChevronDown, ChevronLeft, Pencil, Plus, Power, Trash2, X } from "lucide-react";
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

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type FormState = {
  day: string;
  location: string;
  timeRange: string;
  details: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  day: daysOfWeek[0],
  location: "",
  timeRange: "",
  details: "",
  isActive: true,
};

export default function AdminSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<SessionItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  const [formDayDropdownOpen, setFormDayDropdownOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("08:30");
  const [deleteTarget, setDeleteTarget] = useState<SessionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatTime = (t: string) => {
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr);
    const m = mStr;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const applyTimeRange = () => {
    setForm((prev) => ({ ...prev, timeRange: `${formatTime(startTime)} – ${formatTime(endTime)}` }));
    setTimePickerOpen(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  const groupedSessions = useMemo(() => {
    const map: Record<string, SessionItem[]> = {};
    for (const day of daysOfWeek) map[day] = [];
    for (const item of sessions) {
      if (!map[item.day]) map[item.day] = [];
      map[item.day].push(item);
    }
    return map;
  }, [sessions]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/sessions/admin"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (session: SessionItem) => {
    setEditing(session);
    setForm({
      day: session.day,
      location: session.location,
      timeRange: session.timeRange,
      details: [
        session.sessionName,
        session.workoutTitle,
        ...session.exercises,
      ]
        .filter(Boolean)
        .join("\n"),
      isActive: session.isActive,
    });
    setIsModalOpen(true);
  };

  const parseDetails = (details: string) => {
    const lines = details
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return {
      sessionName: lines[0] || "Group Workout",
      workoutTitle: lines[1] || "",
      exercises: lines.length > 2 ? lines.slice(2) : [],
    };
  };

  const saveSession = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      const isCreating = !editing;
      const token = getToken();
      const parsed = parseDetails(form.details);
      const payload = {
        day: form.day,
        location: form.location,
        timeRange: form.timeRange,
        sessionName: parsed.sessionName,
        workoutTitle: parsed.workoutTitle,
        exercises: parsed.exercises,
        isActive: form.isActive,
      };

      if (editing) {
        await axios.put(buildApiUrl(`/api/sessions/admin/${editing._id}`), payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(buildApiUrl("/api/sessions/admin"), payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setIsModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await fetchSessions();
      if (isCreating) {
        setSuccessMessage("Session added sucessfully");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const token = getToken();
      await axios.delete(buildApiUrl(`/api/sessions/admin/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteTarget(null);
      await fetchSessions();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to delete session");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const token = getToken();
      await axios.patch(
        buildApiUrl(`/api/sessions/admin/${id}/toggle`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSessions();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to toggle session");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A0705] text-white font-sans overflow-x-hidden">

      {/* NOTIFICATION BELL */}
      <NotificationBell className="absolute top-8 right-10 z-50" />

      <div className="relative z-10 !ml-[40px] pl-10 pr-12">
        <div className="mx-auto w-full max-w-5xl">

          {successMessage && (
            <div className="mb-4 flex justify-center">
              <div className="inline-flex min-h-[56px] min-w-[360px] items-center justify-center gap-2 rounded-[20px] border border-[#15803D] bg-[#4ADE80] px-6 py-4 text-[18px] font-normal text-black shadow-lg">
                <Check size={18} className="text-black" strokeWidth={2.25} />
                <span className="font-normal text-black">{successMessage}</span>
              </div>
            </div>
          )}

          {/* HEADER */}
          <div className="flex items-center justify-between !pt-20 !mb-6">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="text-[#FACC15] hover:scale-110 transition-transform"
            >
              <ChevronLeft size={48} strokeWidth={3} />
            </button>
            <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
              Manage Sessions
            </h1>
            <div className="w-12" />
          </div>

          {/* ADD SESSION BUTTON + DAY FILTER */}
          <div className="flex items-center justify-between !mb-10">
            {/* CUSTOM DAY DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setDayDropdownOpen((o) => !o)}
                className="inline-flex min-w-[170px] justify-between items-center gap-2 h-[46px] px-7 rounded-[14px] bg-[#3B82F6]/12 text-[#93C5FD] border border-[#60A5FA]/35 text-base font-bold hover:bg-[#3B82F6]/20 transition-all outline-none"
              >
                <span>{selectedDay === "All" ? "All Days" : selectedDay}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={3}
                  className={`text-[#93C5FD] transition-transform duration-200 ${dayDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {dayDropdownOpen && (
                <div className="absolute top-[44px] left-0 z-50 min-w-full rounded-xl border-2 border-[#FACC15]/40 bg-[#1E1E1E] shadow-2xl overflow-hidden">
                  {["All", ...daysOfWeek].map((d) => (
                    <button
                      key={d}
                      onClick={() => { setSelectedDay(d); setDayDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[14px] font-bold transition-all hover:bg-[#FACC15]/10 hover:text-[#FACC15] ${
                        selectedDay === d ? "text-[#FACC15] bg-[#FACC15]/10" : "text-white/70"
                      }`}
                    >
                      {d === "All" ? "All Days" : d}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={openCreate}
              className="inline-flex min-w-[170px] justify-center items-center gap-2 h-[46px] px-7 rounded-[14px] bg-[#3B82F6]/12 text-[#93C5FD] border border-[#60A5FA]/35 text-base font-bold hover:bg-[#3B82F6]/20 transition-all"
            >
              <Plus size={18} />
              Add Session
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
            <div className="text-center text-[#FACC15] text-xl mt-20 font-bold">Loading schedule...</div>
          ) : (
            <div className="space-y-14">
              {(selectedDay === "All" ? daysOfWeek : [selectedDay]).map((day) => (
                <section key={day} className="flex flex-col gap-2">
                  <h2 className="text-[28px] font-bold text-white tracking-wide">{day}</h2>

                  <div className="flex flex-col gap-3 w-full">
                    {groupedSessions[day]?.length > 0 ? (
                      groupedSessions[day].map((session) => (
                        <div
                          key={session._id}
                          className="flex items-center w-full bg-[#1E1E1E] border-2 border-[#FACC15]/30 rounded-2xl hover:border-[#FACC15]/70 transition-all overflow-hidden"
                        >
                          {/* LEFT: Clock icon section */}
                          <div className="flex items-center justify-center w-[72px] min-w-[72px] h-[72px] bg-[#252525]">
                            <CalendarClock size={26} className="text-[#FACC15]/70" />
                          </div>

                          {/* VERTICAL DIVIDER */}
                          <div className="w-[2px] self-stretch bg-[#FACC15]/15 mx-0" />

                          {/* MIDDLE: Time + Name/Location */}
                          <div className="flex flex-col justify-center px-5 py-3 flex-1 min-w-0 gap-0.5">
                            <span className="text-[#FACC15] font-black text-[15px] tracking-tight leading-tight">
                              {session.timeRange}
                            </span>
                            <span className="text-white font-bold text-[13px] truncate leading-tight">
                              {session.sessionName}
                            </span>
                            {session.location && (
                              <span className="text-white/35 text-[12px] truncate leading-tight">{session.location}</span>
                            )}
                          </div>

                          {/* RIGHT: Status + Actions */}
                          <div className="flex items-center gap-2 px-5 flex-shrink-0">
                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-wide ${
                              session.isActive
                                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                                : "bg-white/10 text-white/30 border border-white/15"
                            }`}>
                              {session.isActive ? "Active" : "Off"}
                            </span>
                            <div className="w-[1px] self-stretch bg-white/10 mx-1" />
                            <button onClick={() => handleToggle(session._id)} title="Toggle active"
                              className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-white/40 hover:text-[#FACC15] hover:bg-[#FACC15]/10 transition-all">
                              <Power size={14} />
                            </button>
                            <button onClick={() => openEdit(session)} title="Edit"
                              className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-white/40 hover:text-[#FACC15] hover:bg-[#FACC15]/10 transition-all">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleteTarget(session)} title="Delete"
                              className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-[60px] w-full border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
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

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-10"
          onClick={() => setIsModalOpen(false)}
        >
          {/* CARD OUTER — golden border shell, drag bottom-right corner to resize width */}
          <div
            style={{ width: 580, minWidth: 520, maxWidth: "92vw", resize: "horizontal", overflow: "hidden" }}
            className="bg-[#161616] border-2 border-[#FACC15] rounded-[28px] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
          {/* INNER SCROLL — independent fixed-width group, centered inside outer */}
          <div className="w-full overflow-y-auto max-h-[90vh]">
            {/* HEADER — spans full outer width */}
            <div className="h-[72px] bg-[#1E1E1E] border-b border-[#FACC15]/20 relative flex items-center justify-center mx-0">
              <h3 className="text-[26px] font-black text-[#FACC15] tracking-tight text-center">
                {editing ? "Edit Session" : "Add Session"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY — fixed 500px centered, independent of outer card width */}
            <div className="w-[565px] mx-auto my-6 flex flex-col gap-6">

              {/* ROW 1: Day + Time Range */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 w-[200px]">
                  <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Day</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setFormDayDropdownOpen((o) => !o)}
                      className="w-full h-[48px] rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-4 text-white text-[15px] font-semibold flex items-center justify-between hover:border-[#FACC15] transition-all outline-none"
                    >
                      <span>{form.day}</span>
                      <ChevronDown
                        size={16}
                        strokeWidth={3}
                        className={`text-[#FACC15] transition-transform duration-200 ${formDayDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {formDayDropdownOpen && (
                      <div className="absolute top-[52px] left-0 z-50 w-full rounded-xl border-2 border-[#FACC15]/30 bg-[#1E1E1E] shadow-2xl overflow-hidden">
                        {daysOfWeek.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => { setForm((prev) => ({ ...prev, day })); setFormDayDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-[14px] font-bold transition-all hover:bg-[#FACC15]/10 hover:text-[#FACC15] ${
                              form.day === day ? "text-[#FACC15] bg-[#FACC15]/10" : "text-white/70"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Time Range</span>
                  <div className="relative w-full">
                    <input
                      value={form.timeRange}
                      onChange={(e) => setForm((prev) => ({ ...prev, timeRange: e.target.value }))}
                      placeholder="7:00 AM – 8:30 AM"
                      className="w-full h-[48px] rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-4 pr-10 text-white outline-none focus:border-[#FACC15] text-[15px] font-semibold placeholder:text-white/20"
                    />
                    {/* CALENDAR CLOCK — click to open time picker */}
                    <button
                      type="button"
                      onClick={() => setTimePickerOpen((o) => !o)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FACC15]/60 hover:text-[#FACC15] transition-colors"
                    >
                      <CalendarClock size={18} />
                    </button>

                    {/* TIME PICKER POPOVER */}
                    {timePickerOpen && (
                      <div className="absolute top-[52px] right-0 z-50 w-[260px] rounded-2xl border-2 border-[#FACC15]/40 bg-[#1E1E1E] shadow-2xl p-4 flex flex-col gap-4">
                        <p className="text-[11px] font-black text-[#FACC15]/60 uppercase tracking-widest">Set Time Range</p>
                        <div className="flex flex-col gap-2">
                          <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Start</label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full h-[40px] rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-3 text-white outline-none focus:border-[#FACC15] text-[14px] font-semibold [color-scheme:dark]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">End</label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full h-[40px] rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-3 text-white outline-none focus:border-[#FACC15] text-[14px] font-semibold [color-scheme:dark]"
                          />
                        </div>
                        <button
                          onClick={applyTimeRange}
                          className="w-full h-[38px] rounded-full bg-[#FACC15] text-black font-black text-[14px] hover:bg-yellow-300 transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* ROW 2: Location */}
              <label className="flex flex-col gap-1 w-full">
                <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Location</span>
                <input
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Gym Hall A"
                  className="w-full h-[48px] rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-4 text-white outline-none focus:border-[#FACC15] text-[15px] font-semibold placeholder:text-white/20"
                />
              </label>

              {/* ROW 3: Session Details */}
              <label className="flex flex-col gap-1 w-full">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">Session Details</span>
                  <span className="text-[11px] text-white/20">line 1: name · line 2: workout · rest: exercises</span>
                </div>
                <textarea
                  value={form.details}
                  onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
                  className="w-full h-[160px] rounded-xl border-2 border-[#FACC15]/25 bg-[#111] px-4 py-3 text-white outline-none focus:border-[#FACC15] text-[15px] font-semibold resize-none placeholder:text-white/20 leading-relaxed"
                  placeholder={"Bootcamp/HIIT"}
                />
              </label>

              {/* ROW 4: Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                <div className="relative w-[44px] h-[24px] flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-full h-full rounded-full bg-white/10 peer-checked:bg-[#FACC15] transition-all border-2 border-white/10 peer-checked:border-[#FACC15]" />
                  <div className="absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-full bg-white/40 peer-checked:bg-black peer-checked:translate-x-[20px] transition-all" />
                </div>
                <span className="text-[14px] font-bold text-white/50 peer-checked:text-white">Active session</span>
              </label>

            </div>

            {/* FOOTER — fixed 500px centered, independent of outer card width */}
            <div className="bg-[#1E1E1E] border-t border-[#FACC15]/20">
              <div className="w-[500px] mx-auto h-[80px] flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-[130px] h-[46px] rounded-full border-2 border-white/15 text-white/50 hover:text-white hover:border-white/40 font-bold text-[15px] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSession}
                  disabled={saving}
                  className="w-[160px] h-[46px] rounded-full bg-[#FACC15] text-black font-black text-[15px] hover:bg-yellow-300 transition-all disabled:opacity-50 shadow-lg shadow-[#FACC15]/20"
                >
                  {saving ? "Saving..." : "Save Session"}
                </button>
              </div>
            </div>

          </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] p- min-h-[170px] rounded-2xl max-w-sm w-full text-center border border-white/10 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="text-gray-400 mb-7 font-normal">You want to delete this session?</p>
            <div className="flex items-center justify-center gap-4 mt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="w-[100px] py-2.5 rounded-[8px] bg-white/5 hover:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget._id)}
                disabled={isDeleting}
                className="w-[100px] py-2.5 rounded-[8px] bg-red-600 hover:bg-red-700 font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarClock, Pencil, Plus, Power, Trash2, X } from "lucide-react";
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
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<SessionItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

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
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;

    try {
      const token = getToken();
      await axios.delete(buildApiUrl(`/api/sessions/admin/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSessions();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to delete session");
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
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#D4AF37]">Manage Sessions</h1>
          <p className="mt-1 text-sm text-[#9FB3A6]">
            Create and manage sessions visible on web and mobile apps
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-[#0F1310] transition hover:bg-[#c4a032]"
        >
          <Plus size={16} />
          Add Session
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#E53935]/30 bg-[#E53935]/10 p-3 text-sm text-[#ff8c8c]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#26322B] bg-[#171C18] p-6 text-[#9FB3A6]">
          Loading sessions...
        </div>
      ) : (
        <div className="space-y-6">
          {daysOfWeek.map((day) => (
            <section key={day}>
              <h2 className="mb-2 text-xl font-semibold text-white">{day}</h2>
              {groupedSessions[day].length === 0 ? null : (
                <div className="space-y-2">
                  {groupedSessions[day].map((session) => (
                    <div
                      key={session._id}
                      className="flex items-center justify-between rounded-xl border border-[#26322B] bg-[#171C18] p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{session.sessionName}</p>
                        <p className="mt-1 text-sm text-[#9FB3A6]">{session.timeRange}</p>
                        {session.workoutTitle && (
                          <p className="mt-1 text-xs text-[#7C8C83]">{session.workoutTitle}</p>
                        )}
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            session.isActive
                              ? "border border-[#2ECC71]/40 bg-[#2ECC71]/15 text-[#2ECC71]"
                              : "border border-[#7C8C83]/40 bg-[#7C8C83]/15 text-[#9FB3A6]"
                          }`}
                        >
                          {session.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => handleToggle(session._id)}
                          className="rounded-md border border-[#2A3530] p-2 text-[#9FB3A6] hover:text-white"
                          title="Toggle active"
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(session)}
                          className="rounded-md border border-[#2A3530] p-2 text-[#9FB3A6] hover:text-white"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(session._id)}
                          className="rounded-md border border-[#E53935]/30 p-2 text-[#E53935] hover:bg-[#E53935]/10"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-[#26322B] bg-[#171C18] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#D4AF37]">
                {editing ? "Edit Session" : "Add Session"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1 text-[#9FB3A6] hover:bg-[#2A3530] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm text-[#9FB3A6]">Day</span>
                <select
                  value={form.day}
                  onChange={(e) => setForm((prev) => ({ ...prev, day: e.target.value }))}
                  className="w-full rounded-md border border-[#2A3530] bg-[#0F1310] px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-[#9FB3A6]">Location</span>
                <input
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-md border border-[#2A3530] bg-[#0F1310] px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-[#9FB3A6]">Time Range</span>
                <div className="relative">
                  <input
                    value={form.timeRange}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, timeRange: e.target.value }))
                    }
                    placeholder="7:00 AM - 8:30 AM"
                    className="w-full rounded-md border border-[#2A3530] bg-[#0F1310] px-3 py-2 pr-10 text-white outline-none focus:border-[#D4AF37]"
                  />
                  <CalendarClock
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8C83]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-[#9FB3A6]">
                  Session Details (line 1: name, line 2: workout, rest: exercises)
                </span>
                <textarea
                  rows={7}
                  value={form.details}
                  onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
                  className="w-full rounded-md border border-[#2A3530] bg-[#0F1310] px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-[#9FB3A6]">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
                Active session
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-[#2A3530] px-4 py-2 text-sm text-[#9FB3A6] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveSession}
                disabled={saving}
                className="rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0F1310] hover:bg-[#c4a032] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


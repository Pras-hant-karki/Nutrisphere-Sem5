"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, CheckCircle2, Clock3, MapPin, PenLine, XCircle } from "lucide-react";
import { getToken } from "@/lib/auth-helpers";
import { buildApiUrl } from "@/lib/api/base-url";

type Appointment = {
  _id: string;
  userId?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  trainingType: string;
  goal: string;
  preferredDate: string;
  preferredTime: string;
  country?: string;
  status: "pending" | "approved" | "rescheduled" | "cancelled";
  specialRequest?: string;
  createdAt: string;
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [editStatus, setEditStatus] = useState<"approved" | "rescheduled" | "rejected">("approved");
  const [editMessage, setEditMessage] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/appointments/admin"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (id: string) => {
    try {
      setActingId(id);
      setError(null);
      const token = getToken();
      await axios.put(
        buildApiUrl(`/api/appointments/admin/${id}/approve`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to approve appointment");
    } finally {
      setActingId(null);
    }
  };

  const cancelAppointment = async (id: string, reason: string) => {
    try {
      setActingId(id);
      setError(null);
      const token = getToken();
      await axios.put(
        buildApiUrl(`/api/appointments/admin/${id}/cancel`),
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to cancel appointment");
    } finally {
      setActingId(null);
    }
  };

  const rescheduleAppointment = async (id: string, message: string, newDate: string, newTime: string) => {
    try {
      setActingId(id);
      setError(null);
      const token = getToken();
      await axios.put(
        buildApiUrl(`/api/appointments/admin/${id}/reschedule`),
        { message, newDate, newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to reschedule appointment");
    } finally {
      setActingId(null);
    }
  };

  const openEditModal = (item: Appointment) => {
    setEditTarget(item);
    setEditStatus(item.status === "cancelled" ? "rejected" : item.status === "rescheduled" ? "rescheduled" : "approved");
    setEditMessage("");
    setEditDate("");
    setEditTime("");
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditStatus("approved");
    setEditMessage("");
    setEditDate("");
    setEditTime("");
  };

  const submitEdit = async () => {
    if (!editTarget) return;

    if (editStatus === "approved") {
      await approveAppointment(editTarget._id);
      closeEditModal();
      return;
    }

    if (editStatus === "rejected") {
      const reason = editMessage.trim();
      if (!reason) {
        setError("Rejection message is required.");
        return;
      }
      await cancelAppointment(editTarget._id, reason);
      closeEditModal();
      return;
    }

    const message = editMessage.trim();
    if (!message) {
      setError("Reschedule message is required.");
      return;
    }
    if (!editDate || !editTime) {
      setError("New date and time are required for rescheduling.");
      return;
    }

    await rescheduleAppointment(editTarget._id, message, editDate, editTime);
    closeEditModal();
  };

  const getStatusClasses = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37]";
      case "approved":
        return "border-[#2ECC71]/40 bg-[#2ECC71]/15 text-[#2ECC71]";
      case "rescheduled":
        return "border-[#4FC3F7]/40 bg-[#4FC3F7]/15 text-[#4FC3F7]";
      case "cancelled":
        return "border-[#E57373]/40 bg-[#E57373]/15 text-[#E57373]";
      default:
        return "border-[#7C8C83]/40 bg-[#7C8C83]/15 text-[#9FB3A6]";
    }
  };

  return (
    <div className="relative z-10 !ml-[40px] pl-10 pr-12 pt-10 pb-12 bg-[#0A0705] min-h-screen">
      <div className="mx-auto w-full max-w-5xl">
        <div className="min-h-[118px] flex flex-col md:flex-row md:items-end md:justify-between border-b border-[#26322B] pb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#D4AF37]">Appointments</h1>
            <p className="text-[#9FB3A6] mt-2 text-sm">Manage appointment requests from users</p>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-[#9FB3A6] font-medium uppercase tracking-widest">
            Total Requests: <span className="text-[#D4AF37]">{appointments.length}</span>
          </div>
        </div>

        <div className="h-10" />

        {error && (
          <div className="mb-6 rounded-lg border border-[#E53935]/30 bg-[#E53935]/10 p-4 text-[#ff8c8c]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-[#26322B] bg-[#171C18] p-6 text-[#9FB3A6]">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-xl border border-[#26322B] bg-[#171C18] p-10 text-center text-[#9FB3A6]">
            No appointment requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-[#26322B] bg-[#171C18] p-5 hover:border-[#D4AF37]/30 transition-colors"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2 min-w-0">
                    <p className="text-lg font-semibold text-white truncate">
                      {item.userId?.fullName || "Unknown User"}
                    </p>
                    <p className="text-sm text-[#9FB3A6]">{item.userId?.email || "No email"}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#9FB3A6]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={14} className="text-[#D4AF37]" />
                        {item.preferredDate}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={14} className="text-[#D4AF37]" />
                        {item.preferredTime}
                      </span>
                      {item.country && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} className="text-[#D4AF37]" />
                          {item.country}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#C8D2CC]">Training: {item.trainingType}</p>
                    <p className="text-sm text-[#C8D2CC]">Goal: {item.goal}</p>
                    {item.specialRequest && (
                      <p className="text-sm text-[#9FB3A6]">Request: {item.specialRequest}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <span
                      className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide border capitalize ${getStatusClasses(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>

                    {item.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveAppointment(item._id)}
                          disabled={actingId === item._id}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#2ECC71] px-3 py-2 text-sm font-semibold text-[#0F1310] hover:bg-[#26c969] disabled:opacity-60"
                        >
                          <CheckCircle2 size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = window.prompt("Enter cancellation reason:");
                            if (!reason || reason.trim().length === 0) return;
                            void cancelAppointment(item._id, reason.trim());
                          }}
                          disabled={actingId === item._id}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#E53935] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d12d2d] disabled:opacity-60"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => openEditModal(item)}
                      disabled={actingId === item._id}
                      className="inline-flex items-center justify-center rounded-xl border border-[#2ECC71]/40 bg-[#2ECC71]/18 p-2.5 text-[#7FF2AF] hover:bg-[#2ECC71]/28 hover:border-[#2ECC71]/70 transition-all disabled:opacity-50 lg:mr-1"
                      aria-label="Edit appointment"
                      title="Edit appointment"
                    >
                      <PenLine size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editTarget && (
          <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4">
            <div className="bg-[#1B1B1B] p-7 rounded-3xl max-w-2xl w-full border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
              <div className="mb-6 text-center">
                <h3 className="text-[34px] leading-none font-bold tracking-tight mb-2">Edit Appointment</h3>
                <p className="text-[#A8B0B8] text-[16px] leading-snug">Update appointment status and message.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] text-[#9FB3A6] mb-2">Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditStatus("approved")}
                      className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all border ${
                        editStatus === "approved"
                          ? "bg-[#2ECC71] text-[#0F1310] border-[#2ECC71]"
                          : "bg-white/5 text-[#9FB3A6] border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus("rescheduled")}
                      className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all border ${
                        editStatus === "rescheduled"
                          ? "bg-[#4FC3F7] text-[#0F1310] border-[#4FC3F7]"
                          : "bg-white/5 text-[#9FB3A6] border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus("rejected")}
                      className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all border ${
                        editStatus === "rejected"
                          ? "bg-[#E53935] text-white border-[#E53935]"
                          : "bg-white/5 text-[#9FB3A6] border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {editStatus === "rescheduled" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.16em] text-[#9FB3A6] mb-2">New Date</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full h-12 rounded-xl bg-[#111] border border-white/12 px-4 text-base outline-none focus:border-[#4FC3F7]/70"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.16em] text-[#9FB3A6] mb-2">New Time</label>
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="w-full h-12 rounded-xl bg-[#111] border border-white/12 px-4 text-base outline-none focus:border-[#4FC3F7]/70"
                      />
                    </div>
                  </div>
                )}

                {editStatus !== "approved" && (
                  <div>
                    <label className="block text-xs uppercase tracking-[0.16em] text-[#9FB3A6] mb-2">
                      {editStatus === "rescheduled" ? "Reschedule Message" : "Rejection Message"}
                    </label>
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows={4}
                      placeholder={editStatus === "rescheduled" ? "Explain reschedule details..." : "Write rejection reason..."}
                      className="w-full rounded-xl bg-[#111] border border-white/12 px-4 py-3 text-sm outline-none focus:border-[#E53935]/70 resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={closeEditModal}
                  disabled={actingId === editTarget._id}
                  className="w-[140px] h-11 rounded-xl bg-white/8 hover:bg-white/12 text-lg transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={submitEdit}
                  disabled={actingId === editTarget._id}
                  className="w-[140px] h-11 rounded-xl bg-[#2ECC71] hover:bg-[#26c969] text-[#0F1310] text-lg font-bold transition-all disabled:opacity-60"
                >
                  {actingId === editTarget._id ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

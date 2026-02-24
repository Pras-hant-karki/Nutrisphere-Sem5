"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, CheckCircle2, Clock3, MapPin, XCircle } from "lucide-react";
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

  const cancelAppointment = async (id: string) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

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

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#D4AF37]">Appointments</h1>
        <p className="text-[#9FB3A6] mt-2">Manage appointment requests from users</p>
      </div>

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
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${
                      item.status === "pending"
                        ? "border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37]"
                        : item.status === "approved"
                        ? "border-[#2ECC71]/40 bg-[#2ECC71]/15 text-[#2ECC71]"
                        : "border-[#7C8C83]/40 bg-[#7C8C83]/15 text-[#9FB3A6]"
                    }`}
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
                        onClick={() => cancelAppointment(item._id)}
                        disabled={actingId === item._id}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#E53935] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d12d2d] disabled:opacity-60"
                      >
                        <XCircle size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-helpers";
import { buildApiUrl } from "@/lib/api/base-url";

type AppointmentStatus = "pending" | "approved" | "rescheduled" | "cancelled";

type AppointmentItem = {
  _id: string;
  preferredDate: string;
  preferredTime: string;
  status: AppointmentStatus;
  createdAt: string;
  adminResponse?: {
    message?: string;
    respondedAt?: string;
  };
};

export default function BookPTPage() {
  const router = useRouter();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [job, setJob] = useState("");
  const [trainingType, setTrainingType] = useState<"Online" | "In-Person">("Online");
  const [goal, setGoal] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [country, setCountry] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    if (dateOnly.getTime() === todayDate.getTime()) return `Today on ${time}`;
    if (dateOnly.getTime() === yesterdayDate.getTime()) return `Yesterday on ${time}`;

    return date.toLocaleString();
  };

  const loadAppointments = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(buildApiUrl("/api/appointments/my-appointments"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data?.data || []);
    } catch {
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!height.trim() || !weight.trim() || !goal.trim() || !preferredDate || !preferredTime) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      setMessage({ type: "error", text: "Please log in again" });
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        buildApiUrl("/api/appointments"),
        {
          height,
          weight,
          job,
          trainingType,
          goal,
          preferredDate,
          preferredTime,
          country,
          specialRequest,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHeight("");
      setWeight("");
      setJob("");
      setTrainingType("Online");
      setGoal("");
      setPreferredDate("");
      setPreferredTime("");
      setCountry("");
      setSpecialRequest("");
      setMessage({ type: "success", text: "Appointment requested successfully" });
      loadAppointments();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to book appointment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-[#D4AF37]">PT Appointment</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
          className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
          />
          <input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Job"
            className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div>
          <p className="text-white text-sm mb-2">Training Type</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-[#D9E5DC]">
              <input
                type="radio"
                checked={trainingType === "Online"}
                onChange={() => setTrainingType("Online")}
                className="accent-[#D4AF37]"
              />
              Online
            </label>
            <label className="flex items-center gap-2 text-[#D9E5DC]">
              <input
                type="radio"
                checked={trainingType === "In-Person"}
                onChange={() => setTrainingType("In-Person")}
                className="accent-[#D4AF37]"
              />
              In-Person
            </label>
          </div>
        </div>

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Your Goal"
          className="w-full h-24 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8C83]" />
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={today}
              className="w-full pl-10 pr-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="relative">
            <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8C83]" />
            <input
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="w-full px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none"
        />

        <textarea
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          placeholder="Any special request or suggestions ?"
          className="w-full h-24 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-2xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#D4AF37] text-[#1A1008] rounded-lg font-semibold hover:bg-[#c4a032] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Booking..." : "Book"}
        </button>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white">My Appointments</h2>
        <div className="mt-5 space-y-4">
          {isLoading ? (
            <div className="text-[#9FB3A6]">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-[#9FB3A6]">No appointments booked yet</div>
          ) : (
            appointments.map((appointment) => {
              const statusColor =
                appointment.status === "approved"
                  ? "text-green-400 bg-green-500/10"
                  : appointment.status === "rescheduled"
                  ? "text-blue-400 bg-blue-500/10"
                  : appointment.status === "cancelled"
                  ? "text-red-400 bg-red-500/10"
                  : "text-amber-400 bg-amber-500/10";

              const respondedAt = appointment.adminResponse?.respondedAt;
              const stamp = respondedAt ? formatTimestamp(respondedAt) : formatTimestamp(appointment.createdAt);

              return (
                <div key={appointment._id} className="rounded-xl border border-[#2A3630] bg-[#161B17] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-white font-semibold">PT Appointment</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#9FB3A6]">{stamp}</p>
                  <p className="mt-1 text-sm text-[#C0CCC4]">
                    Date: {appointment.preferredDate} | Time: {appointment.preferredTime}
                  </p>
                  {!!appointment.adminResponse?.message && appointment.status !== "approved" && (
                    <p className="mt-2 text-sm text-[#9FB3A6]">Reason: {appointment.adminResponse.message}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

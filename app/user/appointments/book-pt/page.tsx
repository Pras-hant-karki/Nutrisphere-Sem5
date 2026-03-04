"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, Check, Clock } from "lucide-react";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dateInputRef, setDateInputRef] = useState<HTMLInputElement | null>(null);
  const [timeInputRef, setTimeInputRef] = useState<HTMLInputElement | null>(null);

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSuccessMessage(null);

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
      setSuccessMessage("Appointment requested sucessfully");
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

  const inputClasses =
    "w-full h-14 px-4 bg-[#14110F] border border-[#2F2921] rounded-xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10 transition-all";
  const textareaClasses =
    "w-full px-4 py-3 bg-[#14110F] border border-[#2F2921] rounded-xl text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10 resize-none transition-all";
  const iconFieldClasses =
    "flex items-center w-full h-14 bg-[#14110F] border border-[#2F2921] rounded-xl overflow-hidden focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/10 transition-all";

  const openNativePicker = (inputEl: HTMLInputElement | null) => {
    if (!inputEl) {
      return;
    }

    if (typeof inputEl.showPicker === "function") {
      inputEl.showPicker();
      return;
    }

    inputEl.focus();
    inputEl.click();
  };

  const OptionRadio = ({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) => (
    <label className="inline-flex items-center gap-2.5 text-[#D9E5DC] cursor-pointer select-none">
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
          checked ? "border-[#D4AF37] bg-[#D4AF37]" : "border-[#9FB3A6] bg-transparent"
        }`}
      >
        {checked && <Check size={10} className="text-black" strokeWidth={3.25} />}
      </span>
      {label}
    </label>
  );

  return (
    <div className="bg-[#0A0705] min-h-screen">
      <div className="!ml-[40px] pl-8 pr-8 sm:pl-10 sm:pr-12 lg:pr-16 pt-10 pb-12">
        <div className="w-full max-w-6xl space-y-8">
          {successMessage && (
            <div className="mb-4 flex justify-center">
              <div className="inline-flex min-h-[56px] min-w-[360px] items-center justify-center gap-2 rounded-[20px] border border-[#15803D] bg-[#4ADE80] px-6 py-4 text-[18px] font-normal text-black shadow-lg">
                <Check size={18} className="text-black" strokeWidth={2.25} />
                <span className="font-normal text-black">{successMessage}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between !pt-16 !mb-6">
            <button
              onClick={() => router.back()}
              className="text-[#FACC15] hover:scale-110 transition-transform"
            >
              <ArrowLeft size={40} strokeWidth={3} />
            </button>
            <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
              PT Appointment
            </h1>
            <div className="w-10" />
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-3xl border border-[#2A3630] bg-[#12100E] px-5 py-6 sm:px-8 sm:py-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                className={inputClasses}
              />
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
                className={inputClasses}
              />
              <input
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Job"
                className={inputClasses}
              />
            </div>

            <div className="space-y-3">
              <p className="text-white text-sm">Training Type</p>
              <div className="flex items-center gap-6">
                <OptionRadio checked={trainingType === "Online"} onChange={() => setTrainingType("Online")} label="Online" />
                <OptionRadio
                  checked={trainingType === "In-Person"}
                  onChange={() => setTrainingType("In-Person")}
                  label="In-Person"
                />
              </div>
            </div>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Your Goal"
              className={`${textareaClasses} h-28`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={iconFieldClasses}>
                <button
                  type="button"
                  onClick={() => openNativePicker(dateInputRef)}
                  className="flex items-center justify-center min-w-[52px] h-full border-r border-[#2F2921] text-[#7C8C83] hover:text-[#D4AF37] transition-colors"
                >
                  <Calendar size={18} />
                </button>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={today}
                  ref={setDateInputRef}
                  className="w-full h-full px-4 bg-transparent text-white focus:outline-none"
                />
              </div>
              <div className={iconFieldClasses}>
                <button
                  type="button"
                  onClick={() => openNativePicker(timeInputRef)}
                  className="flex items-center justify-center min-w-[52px] h-full border-r border-[#2F2921] text-[#7C8C83] hover:text-[#D4AF37] transition-colors"
                >
                  <Clock size={18} />
                </button>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  ref={setTimeInputRef}
                  className="w-full h-full px-4 bg-transparent text-white focus:outline-none"
                />
              </div>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className={inputClasses}
              />
            </div>

            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Any special request or suggestions ?"
              className={`${textareaClasses} h-28`}
            />

            <div className="w-full flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[170px] h-[46px] rounded-full bg-[#FACC15] text-black font-black text-[15px] hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FACC15]/20"
              >
                {isSubmitting ? "Booking..." : "Book"}
              </button>
            </div>

            {message && message.type === "error" && (
              <div
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
              >
                {message.text}
              </div>
            )}
          </form>

          <div className="rounded-3xl border border-[#2A3630] bg-[#12100E] p-5 sm:p-8">
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
      </div>
    </div>
  );
}

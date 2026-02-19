"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { useRouter } from "next/navigation";

const bookAppointmentSchema = z.object({
  trainerId: z.string().min(1, "Please select a trainer"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  sessionType: z.enum(["personal", "group"]).refine(val => val, {
    message: "Please select session type",
  }),
  notes: z.string().optional(),
});

type BookAppointmentData = z.infer<typeof bookAppointmentSchema>;

export default function BookPTPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookAppointmentData>({
    resolver: zodResolver(bookAppointmentSchema),
  });

  // Mock trainers data
  const trainers = [
    { id: "1", name: "John Smith", specialty: "Strength Training", rating: 4.8 },
    { id: "2", name: "Sarah Johnson", specialty: "HIIT & Cardio", rating: 4.9 },
    { id: "3", name: "Mike Davis", specialty: "Weight Loss", rating: 4.7 },
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const onSubmit = async (data: BookAppointmentData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Here you would make an API call to book the appointment
      console.log("Booking appointment:", data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage({
        type: "success",
        text: "Your personal training appointment has been booked successfully! You'll receive a confirmation email shortly.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to book appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37]">Book PT Appointment</h1>
          <p className="text-[#9FB3A6] text-sm">Schedule a session with our expert trainers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Trainer Selection */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Select Trainer *
          </label>
          <div className="space-y-3">
            {trainers.map((trainer) => (
              <label key={trainer.id} className="block">
                <input
                  type="radio"
                  value={trainer.id}
                  {...register("trainerId")}
                  className="sr-only peer"
                />
                <div className="p-4 bg-[#161B17] border border-[#2A3630] rounded-lg cursor-pointer peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37]/5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                        <User size={18} className="text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{trainer.name}</h3>
                        <p className="text-[#9FB3A6] text-sm">{trainer.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#D4AF37] font-semibold">★ {trainer.rating}</div>
                      <div className="text-[#7C8C83] text-xs">Rating</div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.trainerId && (
            <p className="text-red-400 text-sm mt-1">{errors.trainerId.message}</p>
          )}
        </div>

        {/* Session Type */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Session Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "personal", label: "Personal Training" },
              { value: "group", label: "Group Session" },
            ].map((type) => (
              <label key={type.value} className="relative">
                <input
                  type="radio"
                  value={type.value}
                  {...register("sessionType")}
                  className="sr-only peer"
                />
                <div className="p-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-center text-sm text-[#9FB3A6] peer-checked:border-[#D4AF37] peer-checked:text-[#D4AF37] cursor-pointer transition-colors">
                  {type.label}
                </div>
              </label>
            ))}
          </div>
          {errors.sessionType && (
            <p className="text-red-400 text-sm mt-1">{errors.sessionType.message}</p>
          )}
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Select Date *
          </label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C8C83]" />
            <input
              type="date"
              {...register("date")}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          {errors.date && (
            <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Select Time *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <label key={time} className="relative">
                <input
                  type="radio"
                  value={time}
                  {...register("time")}
                  className="sr-only peer"
                />
                <div className="p-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-center text-sm text-[#9FB3A6] peer-checked:border-[#D4AF37] peer-checked:text-[#D4AF37] cursor-pointer transition-colors flex items-center justify-center gap-1">
                  <Clock size={14} />
                  {time}
                </div>
              </label>
            ))}
          </div>
          {errors.time && (
            <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register("notes")}
            placeholder="Any specific goals or concerns for this session..."
            className="w-full h-20 px-4 py-3 bg-[#161B17] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#D4AF37] text-[#1A1008] rounded-lg font-semibold hover:bg-[#c4a032] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#1A1008] border-t-transparent rounded-full animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <Calendar size={18} />
              Book Appointment
            </>
          )}
        </button>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
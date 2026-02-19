"use client";

import { FileText, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
  const router = useRouter();

  const appointmentOptions = [
    {
      title: "Request Diet & Workout Plan",
      description: "Get personalized diet and workout plans tailored to your goals",
      icon: FileText,
      href: "/user/appointments/request-plan",
    },
    {
      title: "Book PT Appointment",
      description: "Schedule a personal training session with our expert trainers",
      icon: Calendar,
      href: "/user/appointments/book-pt",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Appointments</h1>
      <p className="text-[#9FB3A6] mb-8 text-sm">Choose any service below!</p>

      <div className="space-y-4">
        {appointmentOptions.map((option) => (
          <div
            key={option.title}
            onClick={() => router.push(option.href)}
            className="group bg-[#161B17] border border-[#2A3630] rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">
                <option.icon size={24} className="text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-lg font-semibold mb-1">{option.title}</h2>
                <p className="text-[#9FB3A6] text-sm">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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
    <div className="max-w-4xl mx-auto text-center py-2">
      <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4">Appointments</h1>
      <p className="text-[#9FB3A6] mb-12 text-lg">Choose any service below!</p>

      <div className="space-y-8">
        {appointmentOptions.map((option) => (
          <div
            key={option.title}
            onClick={() => router.push(option.href)}
            className="group bg-[#161B17] border border-[#2A3630] rounded-2xl p-8 md:p-10 cursor-pointer transition-all duration-200 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)]"
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">
                <option.icon size={28} className="text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-2xl font-semibold mb-3">{option.title}</h2>
                <p className="text-[#9FB3A6] text-base">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { Calendar, BarChart3, Users, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const dashboardCards = [
    {
      title: "Sessions",
      description: "Circuit workout",
      subtitle: "Starts at 8 AM, 11/23/025",
      icon: Calendar,
      href: "/user/home/sessions",
    },
    {
      title: "Workout Records",
      description: "Track your workouts here everyday",
      subtitle: "",
      icon: BarChart3,
      href: "/user/home/workout-records",
    },
    {
      title: "Trainer Details",
      description: "Know your Trainer!",
      subtitle: "",
      icon: Users,
      href: "/user/home/trainer-details",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto pt-4">
      <h1 className="text-3xl font-bold text-[#D4AF37] text-center mb-10">
        Welcome to Dashboard!
      </h1>

      <div className="space-y-4">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.href)}
            className="group bg-[#161B17] border border-[#2A3630] rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">
                <card.icon size={22} className="text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-white text-base font-semibold">{card.title}</h2>
                <p className="text-[#9FB3A6] text-sm mt-0.5">
                  {card.description}
                  {card.subtitle && (
                    <span className="text-[#7C8C83] ml-1">({card.subtitle})</span>
                  )}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#4A5A50] group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

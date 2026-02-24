"use client";

import { Calendar, BarChart3, Users, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const dashboardCards = [
    {
      title: "Sessions",
      subtitle: "Explore available sessions",
      icon: Calendar,
      href: "/user/home/sessions",
    },
    {
      title: "Workout Records",
      subtitle: "Track your workouts here",
      icon: BarChart3,
      href: "/user/home/workout-records",
    },
    {
      title: "Trainer Details",
      subtitle: "Know your Trainer!",
      icon: Users,
      href: "/user/home/trainer-details",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full text-center mb-10">
        <h1 className="text-4xl font-bold text-[#D4AF37]">
          Welcome to Dashboard !
        </h1>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-8">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => router.push(card.href)}
              className="flex items-center justify-between h-36 px-10 bg-gradient-to-r from-[#1a1f1e] to-[#151a19] border border-[#2a3530] rounded-2xl shadow-lg cursor-pointer transition-all duration-200 hover:border-[#D4AF37]/50 hover:shadow-xl"
            >
              <div className="flex items-center gap-8 flex-1 min-w-0">
                <IconComponent size={28} strokeWidth={1.5} className="text-[#D4AF37] flex-shrink-0" />
                <div className="flex flex-col justify-center min-w-0">
                  <h2 className="text-xl font-semibold text-[#D4AF37] leading-tight">
                    {card.title}
                  </h2>
                  <p className="text-sm text-[#9FB3A6] mt-2 leading-tight line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={32}
                strokeWidth={1.5}
                className="text-[#7C8C83] hover:text-[#D4AF37] transition-colors ml-6 flex-shrink-0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

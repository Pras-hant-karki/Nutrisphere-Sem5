"use client";

import { Calendar, BarChart3, Users, ChevronRight, Bell } from "lucide-react";
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
    /* 1) BACKGROUND COLOR: Matches your Login/Profile design #0A0705 */
    <div className="min-h-screen bg-[#0A0705] text-white flex flex-col relative font-sans overflow-x-hidden">
      
      {/* 6) NOTIFICATION BELL: Styled exactly like the Profile Page */}
      <div className="absolute top-8 right-10 z-50">
        <div className="relative bg-white !p-4 rounded-full shadow-2xl cursor-pointer hover:scale-105 transition-all">
          <Bell className="text-black w-7 h-7" />
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[12px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-black">1</span>
        </div>
      </div>

      {/* 2) HEADING POSITION: Brought down using !pt-24 and !mb-20 */}
      <div className="w-full text-center !pt-24 !mb-20">
        <h1 className="!text-[64px] font-black text-[#FACC15] tracking-tight leading-none">
          Welcome to Dashboard !
        </h1>
      </div>

      {/* 4) PLACEMENT & SIZE: Centered container for cards */}
      <div className="flex-1 flex flex-col items-center gap-y-8 w-full max-w-6xl mx-auto px-10 pb-20">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => router.push(card.href)}
              /* 3) CONTAINER SHADE & OUTLINE: bg-[#1E1E1E] with #FACC15 border */
              /* 4) HEIGHT: Set to !h-[120px] for a sleek figma look */
              className="group flex items-center w-full max-w-[800px] !h-[120px] bg-[#1E1E1E] border-2 border-[#FACC15] rounded-[24px] overflow-hidden transition-all duration-300 hover:ring-4 hover:ring-[#FACC15]/10 cursor-pointer"
            >
              {/* 5) ICON GUTTER: Defines a specific zone (min-w-[100px]) so icons never overlap text */}
              <div className="flex justify-center items-center min-w-[100px] text-white border-r border-white/10 h-full">
                <IconComponent size={32} strokeWidth={2} />
              </div>

              {/* 5) TEXT GAPPINGS: px-8 for internal breathing room */}
              <div className="flex-1 flex flex-col justify-center px-8 min-w-0">
                <h2 className="!text-[24px] font-bold text-[#FACC15] leading-tight">
                  {card.title}
                </h2>
                <p className="text-[16px] text-gray-400 mt-1 font-medium line-clamp-1">
                  {card.subtitle}
                </p>
              </div>

              {/* CHEVRON: Positioned to the right with margin */}
              <div className="pr-10">
                <ChevronRight
                  size={32}
                  strokeWidth={2.5}
                  className="text-gray-500 group-hover:text-white transition-colors"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
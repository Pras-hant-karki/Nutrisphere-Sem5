"use client";

import { Calendar, ChevronRight, Users, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/notification-bell";

export default function AdminDashboard() {
  const router = useRouter();

  const dashboardCards = [
    {
      title: "Manage Sessions",
      subtitle: "Create and update workout sessions",
      icon: Calendar,
      href: "/admin/sessions",
    },
    {
      title: "User Management",
      subtitle: "View, edit and control user accounts",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "My Bio",
      subtitle: "Manage your trainer bio and profile",
      icon: UserCircle,
      href: "/admin/my_bio",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0705] text-white flex flex-col relative font-sans overflow-x-hidden">

      {/* NOTIFICATION BELL */}
      <NotificationBell className="absolute top-8 right-10 z-50" />

      {/* HEADING */}
      <div className="w-full text-center !pt-24 !mb-20">
        <h1 className="!text-[64px] font-black text-[#FACC15] tracking-tight leading-none">
          Welcome to Admin Dashboard !
        </h1>
      </div>

      {/* CARDS */}
      <div className="flex-1 flex flex-col items-center gap-y-8 w-full max-w-6xl mx-auto px-10 pb-20">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => router.push(card.href)}
              className="group flex items-center w-full max-w-[800px] !h-[120px] bg-[#1E1E1E] border-2 border-[#FACC15] rounded-[24px] overflow-hidden transition-all duration-300 hover:ring-4 hover:ring-[#FACC15]/10 cursor-pointer"
            >
              {/* ICON GUTTER */}
              <div className="flex justify-center items-center min-w-[100px] text-white border-r border-white/10 h-full">
                <IconComponent size={32} strokeWidth={2} />
              </div>

              {/* TEXT */}
              <div className="flex-1 flex flex-col justify-center px-8 min-w-0">
                <h2 className="!text-[24px] font-bold text-[#FACC15] leading-tight">
                  {card.title}
                </h2>
                <p className="text-[16px] text-gray-400 mt-1 font-medium line-clamp-1">
                  {card.subtitle}
                </p>
              </div>

              {/* CHEVRON */}
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

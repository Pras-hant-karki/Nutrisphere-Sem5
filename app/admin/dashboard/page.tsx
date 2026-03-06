"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Users, UserCircle } from "lucide-react";

export default function AdminDashboard() {
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
      href: "/admin/profile",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full text-center mb-20">
        <h1 className="text-4xl font-bold text-[#D4AF37]">Welcome to Admin Dashboard !</h1>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-8">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="flex items-center justify-between h-36 px-10 bg-gradient-to-r from-[#1a1f1e] to-[#151a19] border border-[#2a3530] rounded-2xl shadow-lg cursor-pointer transition-all duration-200 hover:border-[#D4AF37]/50 hover:shadow-xl"
            >
              <div className="flex items-center gap-8 flex-1 min-w-0">
                <IconComponent size={28} strokeWidth={1.5} className="text-[#D4AF37] flex-shrink-0" />
                <div className="flex flex-col justify-center min-w-0">
                  <h2 className="text-xl font-semibold text-[#D4AF37] leading-tight">{card.title}</h2>
                  <p className="text-sm text-[#9FB3A6] mt-2 leading-tight line-clamp-1">{card.subtitle}</p>
                </div>
              </div>
              <ChevronRight
                size={32}
                strokeWidth={1.5}
                className="text-[#7C8C83] hover:text-[#D4AF37] transition-colors ml-6 flex-shrink-0"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

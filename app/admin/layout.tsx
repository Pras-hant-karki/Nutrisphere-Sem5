"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, isAdmin } from "@/lib/auth-helpers";
import { Calendar, ChevronLeft, Dumbbell, Home, User } from "lucide-react";

const adminNavItems = [
  {
    name: "Home",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    name: "Fitness",
    href: "/admin/fitness-content",
    icon: Dumbbell,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: User,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Check if user has admin role
    if (!isAdmin()) {
      router.push("/user/home");
      return;
    }
  }, [router]);

  // Don't render until auth check is complete
  if (!mounted || !isAuthenticated() || !isAdmin()) {
    return null;
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen flex bg-[#0a0f0d]">
      <aside
        className={`sticky top-0 h-screen border-r border-[#1f3a2d] bg-[#0f2419] z-30 flex flex-col transition-all duration-300 overflow-visible ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`pt-8 pb-8 border-b border-[#1f3a2d] ${
            isCollapsed ? "px-4" : "px-8"
          }`}
        >
          {!isCollapsed && (
            <>
              <p className="text-[#D4AF37] text-sm font-bold leading-tight">Admin Dashboard</p>
              <p className="text-[#7C8C83] text-xs mt-2">NutriSphere</p>
            </>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-4 w-full h-12 rounded-lg px-4 text-sm font-medium transition-all duration-200 justify-start ${
                isActive(item.href)
                  ? "bg-[#1f3a2d]/60 text-[#D4AF37] border border-[#D4AF37]/40"
                  : "text-[#9FB3A6] hover:bg-[#1f3a2d]/40 hover:text-white border border-transparent"
              }`}
            >
              <item.icon
                size={20}
                strokeWidth={1.8}
                className={`flex-shrink-0 ${
                  isActive(item.href) ? "text-[#D4AF37]" : "text-[#7C8C83]"
                }`}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-[#2a3530] bg-[#0f2419] text-[#9FB3A6] hover:text-white hover:border-[#D4AF37]/40 transition-all duration-200 flex items-center justify-center"
          title={isCollapsed ? "Expand" : "Collapse"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={18}
            strokeWidth={1.8}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </aside>

      <div className="flex-1 flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto p-10 bg-[#0a0f0d]">
          {children}
        </main>
      </div>
    </div>
  );
}

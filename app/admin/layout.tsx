"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, isAdmin, getUser } from "@/lib/auth-helpers";
import { Calendar, ChevronLeft, Dumbbell, Home, User, Settings } from "lucide-react";

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
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

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

    setUser(getUser());
  }, [router]);

  // Don't render until auth check is complete
  if (!mounted || !isAuthenticated() || !isAdmin()) {
    return null;
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen flex bg-[#2B0000]">
      <aside className={`sticky top-0 h-screen border-r border-[#1f0a0a] bg-[#0A0505] z-30 flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-[260px]"}`}>
        <div className={`pt-[46px] pb-[32px] flex items-center justify-start ${isCollapsed ? "px-4" : "px-[24px]"}`}>
          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="text-[16px] font-bold leading-tight flex items-center gap-[4px] tracking-wide">
                <span className="text-[#FFD000]">Welcome, {user?.fullName?.split(" ")[0] || "Admin"}</span>
              </p>
              <p className="text-[#969696] text-[13px] font-[300] mt-1.5 tracking-wider">Admin</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-[24px] py-2 flex flex-col gap-[8px]">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-[20px] w-full h-[46px] rounded-md px-4 text-[14.5px] font-[400] transition-all duration-200 justify-start ${
                isActive(item.href)
                  ? "bg-[#252525] text-[#FFFFFF] border border-[#FFCC00] shadow-[0_0_8px_rgba(255,204,0,0.15)]"
                  : "bg-[#252525] text-[#A0A0A0] hover:text-[#FFFFFF] border border-transparent"
              }`}
            >
              <item.icon
                size={19}
                strokeWidth={2.5}
                className={`flex-shrink-0 ${isActive(item.href) ? "text-[#FFFFFF]" : "text-[#A0A0A0]"}`}
              />
              {!isCollapsed && <span className="tracking-wide">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#333333] px-[24px] py-6">
          <Link
            href="/admin/profile"
            title={isCollapsed ? "Settings" : ""}
            className={`flex items-center gap-[20px] w-full h-[46px] rounded-md px-4 text-[14.5px] font-[400] transition-all duration-200 justify-start ${
              isActive("/admin/profile")
                ? "bg-transparent text-[#FFFFFF]"
                : "bg-transparent text-[#A0A0A0] hover:text-[#FFFFFF] border border-transparent"
            }`}
          >
            <Settings size={19} strokeWidth={2.5} className="flex-shrink-0 text-[#FFFFFF]" />
            {!isCollapsed && <span className="tracking-wide">Settings</span>}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft
              size={20}
              strokeWidth={1.8}
              className={`flex-shrink-0 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto bg-[#0A0705]">
          {children}
        </main>
      </div>
    </div>
  );
}

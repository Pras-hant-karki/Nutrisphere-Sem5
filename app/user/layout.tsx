"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getUser } from "@/lib/auth-helpers";
import { Home, FileText, Calendar, User, Settings, ChevronLeft } from "lucide-react";

const navItems = [
  { name: "Home", href: "/user/home", icon: Home },
  { name: "Fitness Post", href: "/user/fitness-posts", icon: FileText },
  { name: "Appointment", href: "/user/appointments", icon: Calendar },
  { name: "Profile", href: "/user/profile", icon: User },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setUser(getUser());
    }
  }, [router]);

  if (!mounted) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen flex bg-[#2B0000]">
      <aside className={`sticky top-0 h-screen border-r border-[#1f0a0a] bg-[#0A0505] z-30 flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-[260px]"
        }`}>
        <div className={`pt-[46px] pb-[32px] flex items-center justify-start ${isCollapsed ? "px-4" : "px-[24px]"
          }`}>
          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="text-[16px] font-bold leading-tight flex items-center gap-[4px] tracking-wide">
                <span className="text-[#FFD000]">Welcome, Prashant</span>
              </p>
              <p className="text-[#969696] text-[13px] font-[300] mt-1.5 tracking-wider">User</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-[24px] py-2 flex flex-col gap-[8px]">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-[20px] w-full h-[46px] rounded-md px-4 text-[14.5px] font-[400] transition-all duration-200 justify-start ${isActive(item.href)
                ? "bg-[#252525] text-[#FFFFFF] border border-[#FFCC00] shadow-[0_0_8px_rgba(255,204,0,0.15)]"
                : "bg-[#252525] text-[#A0A0A0] hover:text-[#FFFFFF] border border-transparent"
                }`}
            >
              <item.icon size={19} strokeWidth={2.5} className={`flex-shrink-0 ${isActive(item.href) ? "text-[#FFFFFF]" : "text-[#A0A0A0]"
                }`} />
              {!isCollapsed && <span className="tracking-wide">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#333333] px-[24px] py-6">
          <Link
            href="/user/profile"
            title={isCollapsed ? "Settings" : ""}
            className={`flex items-center gap-[20px] w-full h-[46px] rounded-md px-4 text-[14.5px] font-[400] transition-all duration-200 justify-start ${isActive("/user/profile") // Note: The previous navItem is "Profile", settings links to it too in this template.
              ? "bg-transparent text-[#FFFFFF]"
              : "bg-transparent text-[#A0A0A0] hover:text-[#FFFFFF] border border-transparent"
              }`}
          >
            <Settings size={19} strokeWidth={2.5} className="flex-shrink-0 text-[#FFFFFF]" />
            {!isCollapsed && <span className="tracking-wide">Settings</span>}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full h-10 gap-2 mt-4 rounded-lg text-[#606060] hover:text-white transition-all duration-200 opacity-0 pointer-events-none hidden" // hidden toggle as not in spec, preserved functionality just hidden visually to respect spec
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft size={20} strokeWidth={1.8} className={`flex-shrink-0 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
              }`} />
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

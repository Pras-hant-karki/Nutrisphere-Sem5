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
    <div className="min-h-screen flex bg-[#0a0f0d]">
      <aside className={`sticky top-0 h-screen border-r border-[#1f3a2d] bg-[#0f2419] z-30 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}>
        <div className={`pt-8 pb-8 border-b border-[#1f3a2d] flex items-center justify-between ${
          isCollapsed ? "px-4" : "px-8"
        }`}>
          {!isCollapsed && (
            <div>
              <p className="text-[#D4AF37] text-sm font-bold leading-tight">
                Welcome, {user?.fullName?.split(" ")[0] || "User"}
              </p>
              <p className="text-[#7C8C83] text-xs capitalize mt-2">{user?.role || "user"}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map(item => (
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
              <item.icon size={20} strokeWidth={1.8} className={`flex-shrink-0 ${
                isActive(item.href) ? "text-[#D4AF37]" : "text-[#7C8C83]"
              }`} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#1f3a2d] px-4 py-8">
          <Link
            href="/user/profile"
            title={isCollapsed ? "Settings" : ""}
            className={`flex items-center gap-4 w-full h-12 rounded-lg px-4 text-sm font-medium transition-all duration-200 justify-start ${
              isActive("/user/profile")
                ? "bg-[#1f3a2d]/60 text-[#D4AF37] border border-[#D4AF37]/40"
                : "text-[#9FB3A6] hover:bg-[#1f3a2d]/40 hover:text-white border border-transparent"
            }`}
          >
            <Settings size={20} strokeWidth={1.8} className={`flex-shrink-0 ${
              isActive("/user/profile") ? "text-[#D4AF37]" : "text-[#7C8C83]"
            }`} />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full h-12 gapped-2 mt-4 rounded-lg text-[#9FB3A6] hover:bg-[#1f3a2d]/40 hover:text-white border border-transparent transition-all duration-200"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft size={20} strokeWidth={1.8} className={`flex-shrink-0 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto p-10 bg-[#0a0f0d]">
          {children}
        </main>
      </div>
    </div>
  );
}

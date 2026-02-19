"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getUser, logout } from "@/lib/auth-helpers";
import { Home, FileText, Calendar, User, Settings, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/user/home", icon: Home },
  { name: "Fitness Posts", href: "/user/fitness-posts", icon: FileText },
  { name: "Appointment", href: "/user/appointments", icon: Calendar },
  { name: "Profile", href: "/user/profile", icon: User },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setUser(getUser());
    }
  }, [router]);

  if (!mounted) return null;

 const isActive = (href: string) => pathname === href;

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1310] flex">
      
      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-screen border-r border-[#26322B] bg-[#111613] z-20 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-[220px]`}>
        {/* App Branding */}
        <div className="px-5 pt-6 pb-4 border-b border-[#26322B]">
          <h1 className="text-xl font-bold text-[#D4AF37] tracking-tight">NutriSphere</h1>
          <p className="text-[#7C8C83] text-xs mt-1">
            Welcome, {user?.fullName?.split(" ")[0] || "User"}
          </p>
        </div>

        <nav className="px-3 py-4 space-y-1 flex-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 w-full h-[42px] rounded-xl px-3 text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30"
                  : "text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white border border-transparent"
              }`}
            >
              <item.icon size={18} className={isActive(item.href) ? "text-[#D4AF37]" : "text-[#7C8C83]"} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#26322B] px-3 py-3">
          <button
            onClick={() => router.push("/user/profile")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white transition-all duration-200"
          >
            <Settings size={18} className="text-[#7C8C83]" />
            Settings
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center px-6 h-14 flex-shrink-0 border-b border-[#26322B]/40 bg-[#0F1310]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-[#9FB3A6] hover:bg-[#1A201C] hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#1B211D] border border-[#26322B] flex items-center justify-center text-sm text-[#9FB3A6] font-semibold">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EE5F4A] text-[10px] flex items-center justify-center rounded-full text-white font-bold">
              1
            </span>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="relative flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getUser, logout } from "@/lib/auth-helpers";

const userNavItems = [
  {
    name: "Home",
    href: "/user/Home",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    name: "Fitness Posts",
    href: "/user/fitness-posts",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: "Appointment",
    href: "/user/appointments",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: "Profile",
    href: "/user/profile",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
  }, [router]);

  if (!isAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/user") {
      return pathname === "/user";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0F1310]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#171C18] border-b border-[#26322B] flex items-center justify-between px-4 z-50">
        <div>
          <p className="text-[#D4AF37] font-medium">Welcome, {user?.fullName?.split(' ')[0] || "User"}</p>
          <p className="text-gray-500 text-xs capitalize">{user?.role || "User"}</p>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#171C18] flex flex-col transition-transform duration-300 z-40 border-r border-[#26322B]/50 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header - Welcome Section */}
        <div className="px-5 py-6 border-b border-[#26322B]/30">
          <p className="text-[#D4AF37] font-bold text-base">Welcome, {user?.fullName?.split(' ')[0] || "User"}</p>
          <p className="text-[#7C8C83] text-sm capitalize">{user?.role || "User"}</p>
        </div>

        {/* Hamburger Menu Icon */}
        <div className="px-5 py-4">
          <div className="text-[#9FB3A6]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {userNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-transparent border border-[#D4AF37] text-white"
                  : "text-[#9FB3A6] hover:bg-[#26322B] hover:text-white border border-transparent"
              }`}
            >
              <span className={`${isActive(item.href) ? "text-white" : "text-[#9FB3A6]"}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="px-3 pb-6 mt-auto border-t border-[#26322B]/50 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[#9FB3A6] hover:bg-[#26322B] hover:text-white transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Header with Notification Bell */}
        <header className="flex justify-end items-center px-4 lg:px-8 py-6 pt-20 lg:pt-6">
          <div className="relative cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#E0E0E0] flex items-center justify-center hover:bg-white transition-colors">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#E53935] rounded-full flex items-center justify-center border-2 border-[#0F1310]">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 lg:px-8 pb-8">{children}</main>
      </div>
    </div>
  );
}
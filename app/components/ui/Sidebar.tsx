"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout, getUser } from "@/lib/auth-helpers";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  description: string;
}

interface SidebarProps {
  navItems: NavItem[];
  title: string;
  onLogout?: () => void;
}

export function Sidebar({ navItems, title, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push("/login");
    onLogout?.();
  };

  const handleSettings = () => {
    router.push("/user/profile");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-4 z-50">
        <div>
          <h1 className="text-lg font-bold text-[var(--gold)]">{title}</h1>
          <p className="text-xs text-[#9FB3A6]">{user?.fullName}</p>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-[var(--gold)] text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[var(--bg-card)] border-r border-[var(--border)] pt-8 transition-transform duration-300 z-40 md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-6 pb-8 border-b border-[var(--border)]">
          <h1 className="text-2xl font-bold text-[var(--gold)] mb-1">
            Nutrisphere
          </h1>
          <p className="text-sm text-[#9FB3A6]">
            Welcome, {user?.fullName || "User"}
          </p>
          <div className="text-xs text-[#7C8C83] mt-2 capitalize">
            {user?.role === "admin" ? " Administrator" : " Member"}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`block w-full p-3.5 rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                  : "hover:bg-[#1B211D] text-[#9FB3A6] hover:text-[var(--gold)] border border-transparent hover:border-[var(--border)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs opacity-60">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 py-4 border-t border-[var(--border)] space-y-2">
          <button
            onClick={handleSettings}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--gold)]/40 hover:bg-[#1B211D] text-[#9FB3A6] hover:text-[var(--gold)] font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 rounded-lg bg-[#E53935]/10 hover:bg-[#E53935]/20 text-[#E53935] font-medium transition-all duration-200 text-sm border border-[#E53935]/20 hover:border-[#E53935]/40"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

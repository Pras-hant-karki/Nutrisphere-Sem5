"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout, getUser } from "../lib/auth-helpers";

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

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#171C18] border-b border-[#26322B] flex items-center justify-between px-4 z-50">
        <div>
          <h1 className="text-lg font-bold text-[#D4AF37]">{title}</h1>
          <p className="text-xs text-[#9FB3A6]">{user?.fullName}</p>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-[#D4AF37] text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#171C18] border-r border-[#26322B] pt-8 transition-transform duration-300 z-40 md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-6 pb-8 border-b border-[#26322B]">
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-1">Nutrisphere</h1>
          <p className="text-sm text-[#9FB3A6]">
            Welcome, {user?.fullName || "User"}
          </p>
          <div className="text-xs text-[#7C8C83] mt-2 capitalize">
            {user?.role === "admin" ? " Administrator" : " Member"}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`block w-full p-4 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-[#2ECC71] text-[#0F1310] shadow-lg border border-[#D4AF37]"
                  : "hover:bg-[#1B211D] text-[#9FB3A6] hover:text-[#D4AF37] border border-transparent hover:border-[#26322B]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-1">{item.icon}</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs opacity-75">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-[#26322B]">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-[#E53935] hover:bg-[#C41C3B] text-white font-semibold transition-colors duration-200 text-sm"
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

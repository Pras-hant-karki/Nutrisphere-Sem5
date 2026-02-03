"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../lib/auth-helpers";
import { Sidebar } from "../components/Sidebar";

const userNavItems = [
  {
    name: "Profile",
    href: "/user/profile",
    icon: "👤",
    description: "Manage your profile",
  },
  {
    name: "Fitness Plans",
    href: "/user/fitness-plans",
    icon: "💪",
    description: "View your plans",
  },
  {
    name: "Progress",
    href: "/user/progress",
    icon: "📊",
    description: "Track progress",
  },
  {
    name: "Appointments",
    href: "/user/appointments",
    icon: "📅",
    description: "Book sessions",
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
  }, [router]);

  // Don't render until auth check is complete
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F1310]">
      <Sidebar navItems={userNavItems} title="User Dashboard" />
      
      {/* Main Content */}
      <div className="md:ml-64 min-h-screen pt-16 md:pt-0">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

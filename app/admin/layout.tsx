"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "@/lib/auth-helpers";
import { Sidebar } from "../components/Sidebar";

const adminNavItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: "",
    description: "Overview & stats",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: "",
    description: "Manage users",
  },
  {
    name: "Create User",
    href: "/admin/users/create",
    icon: "",
    description: "Add new user",
  },
  {
    name: "Fitness Content",
    href: "/admin/fitness-content",
    icon: "",
    description: "Manage content",
  },
];

export default function AdminLayout({
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

    // Check if user has admin role
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
  }, [router]);

  // Don't render until auth check is complete
  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F1310]">
      <Sidebar navItems={adminNavItems} title="Admin Dashboard" />
      
      {/* Main Content */}
      <div className="md:ml-64 min-h-screen pt-16 md:pt-0">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

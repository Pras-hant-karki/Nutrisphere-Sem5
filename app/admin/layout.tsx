"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "../lib/auth-helpers";

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

  return <>{children}</>;
}

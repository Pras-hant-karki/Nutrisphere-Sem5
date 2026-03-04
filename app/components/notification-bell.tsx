"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api/base-url";
import { getToken } from "@/lib/auth-helpers";

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({
  className = "absolute top-8 right-10 z-50",
}: NotificationBellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationsPath = pathname.startsWith("/admin")
    ? "/admin/notifications"
    : "/user/notifications";

  useEffect(() => {
    let mounted = true;

    const fetchUnreadCount = async () => {
      try {
        const token = getToken();
        if (!token) {
          if (mounted) setUnreadCount(0);
          return;
        }

        const response = await axios.get(buildApiUrl("/api/notifications/unread-count"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const count = Number(response.data?.data?.count ?? 0);
        if (mounted) {
          setUnreadCount(Number.isFinite(count) ? count : 0);
        }
      } catch {
        if (mounted) {
          setUnreadCount(0);
        }
      }
    };

    fetchUnreadCount();
    const timer = window.setInterval(fetchUnreadCount, 30000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className={className}>
      <button
        onClick={() => router.push(notificationsPath)}
        className="relative bg-white !p-4 rounded-full shadow-2xl hover:scale-[1.03] transition-transform"
        aria-label="Open notifications"
      >
        <Bell className="text-black w-7 h-7" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[12px] font-black min-w-6 h-6 px-1 flex items-center justify-center rounded-full border-2 border-black">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

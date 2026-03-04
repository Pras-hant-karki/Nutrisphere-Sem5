"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Bell, Calendar, ChevronLeft, CheckCheck } from "lucide-react";
import { buildApiUrl } from "@/lib/api/base-url";
import { getToken } from "@/lib/auth-helpers";
import NotificationBell from "@/app/components/notification-bell";

type NotificationItem = {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    senderName?: string;
    relatedId?: string;
  };
};

const normalizeNotification = (item: any): NotificationItem => ({
  _id: String(item?._id ?? ""),
  type: typeof item?.type === "string" ? item.type : "",
  title: typeof item?.title === "string" ? item.title : "",
  message: typeof item?.message === "string" ? item.message : "",
  isRead: Boolean(item?.isRead),
  createdAt: typeof item?.createdAt === "string" ? item.createdAt : new Date().toISOString(),
  metadata: item?.metadata && typeof item.metadata === "object" ? item.metadata : undefined,
});

const typeLabel = (type: string) => {
  switch (type) {
    case "new_post":
      return "New Post";
    case "new_session":
      return "New Session";
    case "trainer_update":
      return "Trainer Update";
    case "appointment_request":
      return "Appointment";
    case "plan_request":
      return "Plan Request";
    default:
      return "Notification";
  }
};

const getTimeAgo = (value: string) => {
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return "Just now";

  const diffMs = Date.now() - createdAt.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return createdAt.toLocaleDateString();
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setItems([]);
        return;
      }

      const response = await axios.get(buildApiUrl("/api/notifications"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      setItems(list.map(normalizeNotification));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const id = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(id);
  }, [loadNotifications]);

  const markAsRead = async (id: string) => {
    try {
      setWorkingId(id);
      const token = getToken();
      if (!token) return;

      await axios.put(
        buildApiUrl(`/api/notifications/${id}/read`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems((prev) => prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)));
    } catch (err) {
      console.error(err);
    } finally {
      setWorkingId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);
      const token = getToken();
      if (!token) return;

      await axios.put(
        buildApiUrl("/api/notifications/read-all"),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A0705] text-white font-sans overflow-x-hidden">
      <NotificationBell className="absolute top-8 right-10 z-50" />

      <div className="relative z-10 !ml-[40px] pl-10 pr-12 pb-14">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-center justify-between !pt-20 !mb-10">
            <button
              onClick={() => router.back()}
              className="text-[#FACC15] hover:scale-110 transition-transform"
              aria-label="Back"
            >
              <ChevronLeft size={48} strokeWidth={3} />
            </button>
            <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
              Notifications
            </h1>
            <div className="w-12" />
          </div>

          <div className="mb-7 flex items-center justify-between rounded-2xl border border-[#FACC15]/30 bg-[#1E1E1E] px-5 py-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Bell size={16} className="text-[#FACC15]" />
              <span>{unreadCount} unread</span>
            </div>
            <button
              onClick={markAllAsRead}
              disabled={markingAll || unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-[#FACC15]/40 px-3 py-1.5 text-sm text-[#FACC15] hover:bg-[#FACC15]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck size={14} />
              {markingAll ? "Marking..." : "Mark all read"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-[#FACC15] text-xl mt-20 font-bold">Loading notifications...</div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#1E1E1E] px-6 py-10 text-center text-white/60">
              No notifications yet.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    if (!item.isRead) {
                      void markAsRead(item._id);
                    }
                  }}
                  disabled={workingId === item._id}
                  className={`w-full text-left rounded-2xl border px-5 py-4 transition-all shadow-[0_3px_12px_rgba(0,0,0,0.2)] ${
                    item.isRead
                      ? "border-white/10 bg-[#1E1E1E] hover:border-white/20"
                      : "border-[#FACC15]/45 bg-[#FACC15]/10 hover:border-[#FACC15]/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center rounded-md bg-[#FACC15]/15 border border-[#FACC15]/30 px-2 py-0.5 text-[11px] text-[#FACC15] font-semibold">
                          {typeLabel(item.type)}
                        </span>
                        <span className="text-[11px] text-white/40">{getTimeAgo(item.createdAt)}</span>
                      </div>
                      <p className="text-[15px] font-semibold text-white line-clamp-1">{item.title}</p>
                      <p className="text-[13px] text-white/70 mt-1">{item.message}</p>
                      {item.metadata?.senderName && (
                        <p className="text-[12px] text-white/40 mt-1.5">From: {item.metadata.senderName}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      {!item.isRead && <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15]" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="h-8" />

          <div className="rounded-xl border border-[#FACC15]/20 bg-[#1E1E1E] px-4 py-3 text-[13px] text-white/60 flex items-center gap-2">
            <Calendar size={14} className="text-[#FACC15]" />
            Notifications auto-refresh every 30 seconds.
          </div>
        </div>
      </div>
    </div>
  );
}

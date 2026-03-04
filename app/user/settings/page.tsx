"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Mail,
  Moon,
  NotebookPen,
  Shield,
  Star,
  User,
  FileText,
  BookText,
  TestTube2,
} from "lucide-react";
import NotificationBell from "@/app/components/notification-bell";
import { logout } from "@/lib/auth-helpers";

type Notice = {
  type: "success" | "info";
  text: string;
};

type TileProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  onClick: () => void;
};

type SwitchTileProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

const SETTINGS_KEYS = {
  notifications: "user_settings_notifications_enabled",
  emailUpdates: "user_settings_email_updates_enabled",
};

export default function UserSettingsPage() {
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const savedNotifications = localStorage.getItem(SETTINGS_KEYS.notifications);
    const savedEmail = localStorage.getItem(SETTINGS_KEYS.emailUpdates);

    if (savedNotifications !== null) {
      setNotificationsEnabled(savedNotifications === "true");
    }

    if (savedEmail !== null) {
      setEmailUpdatesEnabled(savedEmail === "true");
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 2500);
    return () => window.clearTimeout(id);
  }, [notice]);

  const showNotice = (text: string, type: Notice["type"] = "info") => {
    setNotice({ text, type });
  };

  const appVersion = useMemo(() => "1.0.0", []);

  return (
    <div className="relative min-h-screen bg-[#0A0705] text-white overflow-x-hidden">
      <NotificationBell className="absolute top-8 right-10 z-50" />

      <div className="relative z-10 !ml-[40px] pl-10 pr-12 pb-14">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex items-center justify-between !pt-20 !mb-10">
            <button
              onClick={() => router.push("/user/home")}
              className="text-[#FACC15] hover:scale-110 transition-transform"
              aria-label="Back"
            >
              <ChevronLeft size={48} strokeWidth={3} />
            </button>
            <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
              Settings
            </h1>
            <div className="w-12" />
          </div>

          {notice && (
            <div className="mb-6 flex justify-center">
              <div
                className={`inline-flex min-h-[50px] min-w-[300px] items-center justify-center rounded-[16px] px-5 py-3 text-[15px] font-semibold ${
                  notice.type === "success"
                    ? "bg-[#4ADE80] text-black border border-[#15803D]"
                    : "bg-[#1E1E1E] text-[#FACC15] border border-[#FACC15]/35"
                }`}
              >
                {notice.text}
              </div>
            </div>
          )}

          <div className="space-y-8">
            <section>
              <SectionHeader title="Account" />
              <div className="mt-3 space-y-2.5">
                <SettingsTile
                  icon={User}
                  title="Edit Profile"
                  subtitle="Update personal info"
                  onClick={() => router.push("/user/profile")}
                />
                <SettingsTile
                  icon={Shield}
                  title="Privacy & Security"
                  subtitle="Manage privacy"
                  onClick={() => showNotice("Privacy settings coming soon")}
                />
                <SettingsTile
                  icon={Lock}
                  title="Change Password"
                  subtitle="Update password"
                  onClick={() => showNotice("Change password coming soon")}
                />
              </div>
            </section>

            <section>
              <SectionHeader title="Notifications" />
              <div className="mt-3 space-y-2.5">
                <SwitchTile
                  icon={Bell}
                  title="Push Notifications"
                  subtitle="Receive notifications"
                  checked={notificationsEnabled}
                  onChange={(next) => {
                    setNotificationsEnabled(next);
                    localStorage.setItem(SETTINGS_KEYS.notifications, String(next));
                    showNotice(next ? "Notifications enabled" : "Notifications disabled", "success");
                  }}
                />
                <SwitchTile
                  icon={Mail}
                  title="Email Updates"
                  subtitle="Receive email updates"
                  checked={emailUpdatesEnabled}
                  onChange={(next) => {
                    setEmailUpdatesEnabled(next);
                    localStorage.setItem(SETTINGS_KEYS.emailUpdates, String(next));
                    showNotice(next ? "Email updates enabled" : "Email updates disabled", "success");
                  }}
                />
                <SettingsTile
                  icon={TestTube2}
                  title="Test Notification"
                  subtitle="Send a sample in-app notice"
                  onClick={() => showNotice("Test notification sent", "success")}
                />
              </div>
            </section>

            <section>
              <SectionHeader title="Support" />
              <div className="mt-3 space-y-2.5">
                <SettingsTile
                  icon={HelpCircle}
                  title="Help Center"
                  subtitle="Get help"
                  onClick={() => showNotice("Help center page coming soon")}
                />
                <SettingsTile
                  icon={Info}
                  title="About"
                  subtitle={`App version ${appVersion}`}
                  onClick={() => showNotice(`NutriSphere v${appVersion}`)}
                />
                <SettingsTile
                  icon={Star}
                  title="Rate App"
                  subtitle="Share your feeling"
                  onClick={() => showNotice("Thank you for your feedback")}
                />
              </div>
            </section>

            <section>
              <SectionHeader title="Legal" />
              <div className="mt-3 space-y-2.5">
                <SettingsTile
                  icon={FileText}
                  title="Privacy Policy"
                  subtitle="View privacy"
                  onClick={() => showNotice("Privacy policy page coming soon")}
                />
                <SettingsTile
                  icon={BookText}
                  title="Terms of Service"
                  subtitle="View terms"
                  onClick={() => showNotice("Terms of service page coming soon")}
                />
              </div>
            </section>

            <section>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="w-full h-[52px] rounded-xl border-2 border-red-500/80 text-red-400 hover:bg-red-500/10 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-[20px] font-bold text-white tracking-wide">
      {title}
    </h2>
  );
}

function SettingsTile({ icon: Icon, title, subtitle, onClick }: TileProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-[#FACC15]/25 bg-[#1E1E1E] px-4 py-3 flex items-center gap-4 text-left hover:border-[#FACC15]/60 transition-all"
    >
      <div className="w-[42px] h-[42px] rounded-[10px] bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-[#FACC15]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-semibold text-white leading-tight">{title}</p>
        <p className="text-[13px] text-white/50 mt-1 truncate">{subtitle}</p>
      </div>

      <ChevronRight size={18} className="text-white/40 flex-shrink-0" />
    </button>
  );
}

function SwitchTile({ icon: Icon, title, subtitle, checked, onChange }: SwitchTileProps) {
  return (
    <div className="w-full rounded-xl border border-[#FACC15]/25 bg-[#1E1E1E] px-4 py-3 flex items-center gap-4">
      <div className="w-[42px] h-[42px] rounded-[10px] bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-[#FACC15]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-semibold text-white leading-tight">{title}</p>
        <p className="text-[13px] text-white/50 mt-1 truncate">{subtitle}</p>
      </div>

      <button
        onClick={() => onChange(!checked)}
        aria-label={title}
        className={`relative w-[48px] h-[28px] rounded-full transition-colors ${
          checked ? "bg-[#FACC15]" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-[3px] w-[22px] h-[22px] rounded-full transition-all ${
            checked ? "left-[23px] bg-black" : "left-[3px] bg-white"
          }`}
        />
      </button>
    </div>
  );
}

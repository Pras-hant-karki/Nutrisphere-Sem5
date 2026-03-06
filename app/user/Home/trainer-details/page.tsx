"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { ChevronLeft, Maximize2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/notification-bell";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";
import { getToken } from "@/lib/auth-helpers";

type BioEntry = {
  type: "text" | "image";
  content: string;
};

type TrainerInfo = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  profilePicture?: string | null;
  image?: string | null;
  bio?: BioEntry[];
};

const normalizeBioEntry = (entry: any): BioEntry => ({
  type: entry?.type === "image" ? "image" : "text",
  content:
    typeof entry?.content === "string"
      ? entry.content
      : entry?.content == null
      ? ""
      : String(entry.content),
});

const resolveImageSrc = (content: string): string => {
  if (content.startsWith("http://") || content.startsWith("https://")) {
    return content;
  }
  if (content.startsWith("/")) {
    return `${API_BASE_URL}${content}`;
  }
  return content;
};

export default function TrainerDetailsPage() {
  const router = useRouter();
  const [trainer, setTrainer] = useState<TrainerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainerInfo();
  }, []);

  const fetchTrainerInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/admin/trainer-info"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success && response.data?.data) {
        const raw = response.data.data;
        setTrainer({
          _id: String(raw?._id ?? ""),
          fullName: raw?.fullName || "Trainer",
          email: raw?.email || "No email",
          phone: raw?.phone || null,
          profilePicture: raw?.profilePicture || null,
          image: raw?.image || null,
          bio: Array.isArray(raw?.bio) ? raw.bio.map(normalizeBioEntry) : [],
        });
      } else {
        setTrainer(null);
        setError("Trainer details unavailable");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load trainer details");
      setTrainer(null);
    } finally {
      setLoading(false);
    }
  };

  const trainerImage = useMemo(() => {
    const raw = trainer?.profilePicture || trainer?.image;
    if (!raw) return null;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return buildApiUrl(raw);
  }, [trainer]);

  const initials = useMemo(() => {
    const name = trainer?.fullName?.trim();
    if (!name) return "TR";
    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
  }, [trainer?.fullName]);

  return (
    <div className="relative min-h-screen w-full bg-[#0A0705] text-white font-sans overflow-x-hidden">
      <NotificationBell className="absolute top-8 right-10 z-50" />

      <div className="relative z-10 !ml-[40px] !mr-[80px] pb-12">
        <div className="w-full !pt-4">
          <div className="flex items-center justify-between !pt-20 !mb-16">
            <button
              onClick={() => router.push("/user/home")}
              className="text-[#FACC15] hover:scale-110 transition-transform"
            >
              <ChevronLeft size={48} strokeWidth={3} />
            </button>

            <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">
              Trainer Details
            </h1>
            <div className="w-12" />
          </div>
          {loading ? (
            <div className="rounded-xl border border-[#2A3630] bg-[#161B17] px-6 py-16 text-center text-[#9FB3A6]">
              Loading trainer details...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-400">
              {error}
            </div>
          ) : (
            <div>
              <div className="rounded-2xl border border-[#3D4D57] bg-[#1E1E1E] px-5 py-4">
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#7A8795] bg-[#243042] flex items-center justify-center">
                    {trainerImage ? (
                      <Image src={trainerImage} alt={trainer?.fullName || "Trainer"} fill unoptimized className="object-cover" />
                    ) : (
                      <span className="text-4xl text-white/80">{initials}</span>
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#FACC15] leading-tight truncate">
                      {trainer?.fullName || "Trainer"}
                    </h2>
                    <p className="text-[#9CA3AF] text-base md:text-lg truncate">Ph no: {trainer?.phone || "Not provided"}</p>
                    <p className="text-[#9CA3AF] text-base md:text-lg truncate">Email: {trainer?.email || "No email"}</p>
                  </div>
                </div>
              </div>

              <div className="h-8" />

              <div className="rounded-2xl border border-[#2A3630] bg-[#0A0F10] overflow-hidden">
                {!trainer?.bio || trainer.bio.length === 0 ? (
                  <div className="px-5 py-8 text-[#9FB3A6]">Trainer has not added details yet.</div>
                ) : (
                  <div className="flex flex-col">
                    {trainer.bio.map((entry, index) => {
                      if (entry.type === "image") {
                        const src = resolveImageSrc(entry.content);
                        return (
                          <div key={`${entry.type}-${index}`} className="relative w-full border-t border-[#2A3630] first:border-t-0 group">
                            <Image
                              src={src}
                              alt={`Trainer content ${index + 1}`}
                              width={1200}
                              height={900}
                              unoptimized
                              className="w-full h-[340px] md:h-[480px] object-cover"
                            />
                            <button
                              onClick={() => setFullscreenImage(src)}
                              className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Maximize2 size={18} />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`${entry.type}-${index}`}
                          className="px-4 py-3 text-base md:text-lg leading-relaxed text-[#D8DEE4] whitespace-pre-line border-t border-[#2A3630] first:border-t-0"
                        >
                          {entry.content}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {fullscreenImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreenImage(null)}>
          <button
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={() => setFullscreenImage(null)}
          >
            <X size={28} />
          </button>
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={fullscreenImage as string}
              alt="Trainer detail image"
              width={1920}
              height={1080}
              unoptimized
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
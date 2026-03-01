"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock3, UserRound, ChevronLeft, Maximize2, X } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/notification-bell";

interface FitnessContent {
  _id: string;
  title: string;
  description: string;
  content?: string;
  image?: string;
  adminName: string;
  tags?: string[];
  duration?: number;
  createdAt: string;
}

export default function FitnessPostsPage() {
  const router = useRouter();
  const [content, setContent] = useState<FitnessContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    fetchFitnessContent();
  }, []);

  const fetchFitnessContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl("/api/fitness"));
      if (response.data.success) {
        setContent(response.data.data);
      }
    } catch (err) {
      setError("Failed to load fitness content");
      console.error("Error fetching fitness content:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCreatedTime = (dateValue: string) => {
    const date = new Date(dateValue);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="!ml-[40px] !mr-[80px] min-h-screen bg-[#0A0705] relative">
        <NotificationBell className="absolute top-8 right-10 z-50" />
        <div className="!pt-4 pb-12">
        <div className="flex items-center justify-between px-4 !mb-8">
          <button onClick={() => router.push("/user/home")} className="text-[#FACC15] hover:scale-110 transition-transform">
            <ChevronLeft size={48} strokeWidth={3} />
          </button>
          <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">Fitness Posts</h1>
          <div className="w-12" />
        </div>
        <p className="text-[#9FB3A6] !mb-12 text-base text-center">High quality fitness guidance below !</p>

        <div className="space-y-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-4 animate-pulse">
              <div className="w-full h-[360px] bg-[#2A3630] rounded-xl" />
              <div className="mt-5 space-y-3">
                <div className="h-7 bg-[#2A3630] rounded w-3/4"></div>
                <div className="h-4 bg-[#2A3630] rounded w-full"></div>
                <div className="h-4 bg-[#2A3630] rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="!ml-[40px] !mr-[80px] min-h-screen bg-[#0A0705] relative">
        <NotificationBell className="absolute top-8 right-10 z-50" />
        <div className="!pt-4 pb-12">
        <div className="flex items-center justify-between px-4 !mb-8">
          <button onClick={() => router.push("/user/home")} className="text-[#FACC15] hover:scale-110 transition-transform">
            <ChevronLeft size={48} strokeWidth={3} />
          </button>
          <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">Fitness Posts</h1>
          <div className="w-12" />
        </div>
        <p className="text-[#9FB3A6] !mb-12 text-base text-center">High quality fitness guidance below !</p>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-base font-medium">{error}</p>
            <button
              onClick={fetchFitnessContent}
              className="mt-4 px-4 py-2 bg-[#D4AF37] text-[#1A1008] rounded-lg font-medium hover:bg-[#c4a032] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="!ml-[40px] !mr-[80px] min-h-screen bg-[#0A0705] relative">
        <NotificationBell className="absolute top-8 right-10 z-50" />
        <div className="!pt-4 pb-12">
        <div className="flex items-center justify-between px-4 !mb-8">
          <button onClick={() => router.push("/user/home")} className="text-[#FACC15] hover:scale-110 transition-transform">
            <ChevronLeft size={48} strokeWidth={3} />
          </button>
          <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">Fitness Posts</h1>
          <div className="w-12" />
        </div>
        <p className="text-[#9FB3A6] !mb-12 text-base text-center">High quality fitness guidance below !</p>

        <div className="rounded-xl border border-[#26322B] bg-[#171C18] p-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💪</span>
            </div>
            <p className="text-[#9FB3A6] text-base font-medium">No fitness content available</p>
            <p className="text-[#7C8C83] text-sm mt-2">Check back soon for personalized workout and diet plans!</p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="!ml-[40px] !mr-[80px] min-h-screen bg-[#0A0705] relative">
      <NotificationBell className="absolute top-8 right-10 z-50" />
      <div className="!pt-4 pb-12">
      <div className="flex items-center justify-between px-4 !mb-8">
        <button onClick={() => router.push("/user/home")} className="text-[#FACC15] hover:scale-110 transition-transform">
          <ChevronLeft size={48} strokeWidth={3} />
        </button>
        <h1 className="!text-[56px] font-black text-[#FACC15] tracking-tight text-center flex-1">Fitness Posts</h1>
        <div className="w-12" />
      </div>
      <p className="text-[#9FB3A6] !mb-12 text-base text-center">High quality fitness guidance below !</p>

      <div className="flex flex-col gap-10">
        {content.map((item) => (
          <div key={item._id} className="bg-[#0A0705] border border-[#2A3630] rounded-2xl p-4 md:p-5 hover:border-[#D4AF37]/30 transition-colors">
            <div className="w-full">
              {item.image ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-[#2A3630] group">
                  <Image
                    src={buildApiUrl(item.image)}
                    alt={item.title}
                    width={1200}
                    height={900}
                    unoptimized
                    className="w-full h-[340px] md:h-[480px] object-cover"
                  />
                  <button
                    onClick={() => setFullscreenImage({ src: buildApiUrl(item.image!), alt: item.title })}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
              ) : (
                <div className="w-full h-[340px] md:h-[480px] rounded-xl border border-[#2A3630] bg-[#0F1310] flex items-center justify-center">
                  <p className="text-[#7C8C83] text-sm">No media available</p>
                </div>
              )}

              <div className="pt-5 px-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                  {item.title}
                </h2>
                <p className="text-[#C3D2C8] text-base md:text-lg leading-relaxed mt-4 mb-4 whitespace-pre-line">
                  {item.description || item.content || ""}
                </p>
                <div className="flex flex-wrap items-center gap-5 text-sm text-[#9FB3A6]">
                  <div className="flex items-center gap-2">
                    <Clock3 size={15} />
                    <span>{formatCreatedTime(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRound size={15} />
                    <span>Created by {item.adminName || "Admin"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Fullscreen image modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={() => setFullscreenImage(null)}
          >
            <X size={28} />
          </button>
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={fullscreenImage.src}
              alt={fullscreenImage.alt}
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
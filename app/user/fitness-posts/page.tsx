"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock3, UserRound } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";

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
  const [content, setContent] = useState<FitnessContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
        <p className="text-[#9FB3A6] mb-8 text-base">High quality fitness guidance below !</p>

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
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
        <p className="text-[#9FB3A6] mb-8 text-base">High quality fitness guidance below !</p>

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
    );
  }

  if (content.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
        <p className="text-[#9FB3A6] mb-8 text-base">High quality fitness guidance below !</p>

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
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
      <p className="text-[#9FB3A6] mb-8 text-base">High quality fitness guidance below !</p>

      <div className="space-y-10">
        {content.map((item) => (
          <div
            key={item._id}
            className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-4 md:p-5 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="w-full">
              {item.image ? (
                <div className="w-full rounded-xl overflow-hidden border border-[#2A3630]">
                  <Image
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.title}
                    width={1200}
                    height={900}
                    className="w-full h-[340px] md:h-[480px] object-cover"
                  />
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
                <p className="text-[#C3D2C8] text-base md:text-lg leading-relaxed mb-4 whitespace-pre-line">
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
  );
}
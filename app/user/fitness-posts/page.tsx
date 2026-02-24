"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, User, Tag } from "lucide-react";
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
        <p className="text-[#9FB3A6] mb-8 text-sm">View your personalized fitness plans</p>

        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-[#2A3630] rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-[#2A3630] rounded w-3/4"></div>
                  <div className="h-4 bg-[#2A3630] rounded w-1/2"></div>
                  <div className="h-4 bg-[#2A3630] rounded w-2/3"></div>
                </div>
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
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
        <p className="text-[#9FB3A6] mb-8 text-sm">View your personalized fitness plans</p>

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
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
        <p className="text-[#9FB3A6] mb-8 text-sm">View your personalized fitness plans</p>

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Fitness Posts</h1>
      <p className="text-[#9FB3A6] mb-8 text-sm">High quality fitness guidance below!</p>

      <div className="space-y-6">
        {content.map((item) => (
          <div
            key={item._id}
            className="bg-[#161B17] border border-[#2A3630] rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex gap-6">
              {/* Image */}
              {item.image && (
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-[#2A3630]">
                  <Image
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                  {item.title}
                </h2>

                <p className="text-[#9FB3A6] text-sm mb-3 line-clamp-3">
                  {item.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#7C8C83]">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag size={12} />
                      <span>{item.tags.join(", ")}</span>
                    </div>
                  )}

                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{item.duration} min</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>By {item.adminName}</span>
                  </div>
                </div>

                {/* Full content if available */}
                {item.content && (
                  <div className="mt-4 pt-4 border-t border-[#2A3630]">
                    <p className="text-[#9FB3A6] text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
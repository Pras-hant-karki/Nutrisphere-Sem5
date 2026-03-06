"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { getToken } from "@/lib/auth-helpers";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ViewUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(
        buildApiUrl(`/api/admin/users/${userId}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to fetch user";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0705] min-h-screen">
      <div className="!ml-[40px] pl-10 pr-12 pt-16 pb-12">
        <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin/users"
            className="text-[#2ECC71] hover:text-[#26c969] text-sm mb-4 inline-flex items-center gap-2 font-semibold"
          >
            ← Back to Users
          </Link>
          <h1 className="text-4xl font-extrabold text-[#D4AF37] mt-4 tracking-tight">User Details</h1>
          <p className="text-[#9FB3A6] mt-2 text-base">View complete user information</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-5 rounded-xl bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center text-[#9FB3A6] rounded-2xl border border-[#26322B] bg-[#171C18] shadow-xl">
            Loading user details...
          </div>
        )}

        {/* User Details Card */}
        {!isLoading && user && (
          <div className="rounded-2xl border border-[#26322B] bg-[#171C18] p-8 md:p-10 shadow-xl">
            <div className="space-y-8">
              {/* Profile Section */}
              <div className="flex items-center gap-6 py-5 min-h-[140px] border-b border-[#26322B]">
                <div className="h-24 w-24 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-4xl border-2 border-[#D4AF37]">
                  {user.image ? (
                    <img
                      src={`${API_BASE_URL}${user.image}`}
                      alt={user.fullName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#FFFFFF]">{user.fullName}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === "admin"
                          ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                          : "bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30"
                      }`}
                    >
                      {user.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        user.isActive
                          ? "bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30"
                          : "bg-[#E53935]/20 text-[#E53935] border border-[#E53935]/30"
                      }`}
                    >
                      {user.isActive ? "✓ Active" : "✗ Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="p-4 min-h-[58px] rounded-[5px] bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Email</p>
                  <p className="text-[#FFFFFF] font-medium">{user.email}</p>
                </div>

                <div className="p-4 min-h-[58px] rounded-[5px] bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Phone</p>
                  <p className="text-[#FFFFFF] font-medium">{user.phone || "Not provided"}</p>
                </div>

                <div className="p-4 min-h-[58px] rounded-[5px] bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">User ID</p>
                  <p className="text-[#FFFFFF] font-mono text-sm">{user._id}</p>
                </div>

                <div className="p-4 min-h-[58px] rounded-[5px] bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Role</p>
                  <p className="text-[#FFFFFF] font-medium capitalize">{user.role}</p>
                </div>

                <div className="p-4 min-h-[58px] rounded-[5px] bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Created At</p>
                  <p className="text-[#FFFFFF] font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-4 min-h-[58px] rounded-[5px] bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Last Updated</p>
                  <p className="text-[#FFFFFF] font-medium">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Not Found State */}
        {!isLoading && !user && !error && (
          <div className="py-16 text-center text-[#9FB3A6] rounded-2xl border border-[#26322B] bg-[#171C18] shadow-xl">
            User not found
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

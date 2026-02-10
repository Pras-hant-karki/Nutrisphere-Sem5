"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { getToken } from "@/lib/auth-helpers";

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
        `http://localhost:5000/api/admin/users/${userId}`,
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
    <div className="min-h-screen bg-[#0F1310] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="text-[#2ECC71] hover:text-[#26c969] text-sm mb-4 inline-flex items-center gap-2 font-semibold"
          >
            ← Back to Users
          </Link>
          <h1 className="text-4xl font-bold text-[#D4AF37] mt-4">User Details</h1>
          <p className="text-[#9FB3A6] mt-2">View complete user information</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center text-[#9FB3A6] rounded-lg border border-[#26322B] bg-[#171C18]">
            Loading user details...
          </div>
        )}

        {/* User Details Card */}
        {!isLoading && user && (
          <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 md:p-8 shadow-lg">
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-[#26322B]">
                <div className="h-24 w-24 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-4xl border-2 border-[#D4AF37]">
                  {user.image ? (
                    <img
                      src={`http://localhost:5000${user.image}`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Email</p>
                  <p className="text-[#FFFFFF] font-medium">{user.email}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Phone</p>
                  <p className="text-[#FFFFFF] font-medium">{user.phone || "Not provided"}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">User ID</p>
                  <p className="text-[#FFFFFF] font-mono text-sm">{user._id}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Role</p>
                  <p className="text-[#FFFFFF] font-medium capitalize">{user.role}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#1B211D] border border-[#26322B]">
                  <p className="text-sm font-semibold text-[#9FB3A6] mb-1">Created At</p>
                  <p className="text-[#FFFFFF] font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#1B211D] border border-[#26322B]">
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-[#26322B]">
                <Link
                  href={`/admin/users/${userId}/edit`}
                  className="px-6 py-3 rounded-lg bg-[#D4AF37] text-[#0F1310] font-bold hover:bg-[#F0C960] transition-all shadow-lg"
                >
                  ✏️ Edit User
                </Link>
                <Link
                  href="/admin/users"
                  className="px-6 py-3 rounded-lg border border-[#26322B] text-[#9FB3A6] font-semibold hover:bg-[#1B211D] hover:text-[#FFFFFF] transition-all"
                >
                  ← Back to List
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {!isLoading && !user && !error && (
          <div className="p-8 text-center text-[#9FB3A6] rounded-lg border border-[#26322B] bg-[#171C18]">
            User not found
          </div>
        )}
      </div>
    </div>
  );
}

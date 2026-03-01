"use client";

import { useState, useEffect } from "react";
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
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(buildApiUrl("/api/admin/users"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && !err.response) {
        setError("Unable to connect to server. Please make sure backend API is running.");
        return;
      }

      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch users";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const token = getToken();
      await axios.delete(buildApiUrl(`/api/admin/users/${id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setDeleteTarget(null);
    } catch (err: any) {
      if (axios.isAxiosError(err) && !err.response) {
        setError("Unable to connect to server. Please make sure backend API is running.");
        return;
      }

      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete user";
      setError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const regularCount = users.filter((u) => u.role !== "admin").length;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getProfileImageSrc = (image?: string) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${API_BASE_URL}${image}`;
  };

  return (
    <div className="bg-[#0A0705] min-h-screen">
      <div className="!ml-[40px] pl-10 pr-12 pt-16 pb-12">
        <div className="mx-auto w-full max-w-5xl">

          {/* Header - Updated spacing and removed Admin Panel text */}
          <div className="flex flex-col items-center text-center gap-1">
            <div>
              <h1 className="text-4xl font-extrabold text-[#D4AF37] mb-2 tracking-tight">Users Management</h1>
              <p className="text-[#9FB3A6] text-sm">View, manage and control all registered system users.</p>
            </div>
          </div>

          <div className="h-8" />

          {/* Stats Bar - Changed mb-20 to mb-1 (4px) */}
          {!isLoading && users.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Users", value: totalUsers, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10 border-[#D4AF37]/20" },
                { label: "Admins", value: adminCount, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10 border-[#D4AF37]/20" },
                { label: "Regular Users", value: regularCount, color: "text-[#2ECC71]", bg: "bg-[#2ECC71]/10 border-[#2ECC71]/20" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-2xl border ${stat.bg} p-5 text-center`}>
                  <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-[#9FB3A6] mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {!isLoading && users.length > 0 && <div className="h-10" />}

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30 text-sm flex items-center gap-3">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-[#2ECC71] border-t-transparent animate-spin" />
              <p className="text-[#9FB3A6] text-sm">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 rounded-2xl border border-[#26322B] bg-[#171C18]">
              <span className="text-5xl">👤</span>
              <p className="text-[#9FB3A6] text-base font-medium">No users found</p>
              <Link href="/admin/users/create" className="px-5 py-2 rounded-lg bg-[#2ECC71] text-[#0F1310] font-bold text-sm hover:bg-[#26c969] transition-all">
                Create First User
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-[#26322B] bg-[#171C18] hover:bg-[#1B211D] hover:border-[#2ECC71]/30 transition-all px-10 py-5 min-h-[72px] shadow-md"
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 ml-1 sm:ml-2 w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold shadow-md ${
                      user.role === "admin"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
                        : "bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40"
                    }`}
                  >
                    {getProfileImageSrc(user.image) ? (
                      <img
                        src={getProfileImageSrc(user.image)!}
                        alt={user.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.fullName)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                    <div className="sm:col-span-1">
                      <p className="text-white font-semibold text-sm truncate">{user.fullName}</p>
                      <p className="text-[#9FB3A6] text-xs truncate">{user.email}</p>
                    </div>

                    <div className="sm:col-span-1 flex sm:justify-center">
                      <span
                        className={`inline-flex items-center gap-1 px-5 py-2 rounded text-sm font-bold border ${
                          user.role === "admin"
                            ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30"
                            : "bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/30"
                        }`}
                      >
                        {user.role === "admin" ? "👑" : "👤"} {user.role}
                      </span>
                    </div>

                    <div className="sm:col-span-1 sm:text-center">
                      <p className="text-[#9FB3A6] text-xs font-medium uppercase tracking-wide">Phone</p>
                      <p className="text-white text-sm">{user.phone || "—"}</p>
                    </div>

                    {/* Actions */}
                    <div className="sm:col-span-1 flex items-center gap-2 sm:justify-end sm:pr-3 md:pr-4 flex-wrap">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="px-6 py-2.5 rounded bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/30 text-sm font-bold hover:bg-[#2ECC71]/20 transition-all"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="px-6 py-2.5 rounded bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30 text-sm font-bold hover:bg-[#E53935]/20 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer count */}
          {!isLoading && users.length > 0 && (
            <p className="text-center text-[#9FB3A6] text-xs mt-8">
              Showing <span className="text-[#D4AF37] font-semibold">{users.length}</span> users
            </p>
          )}

          {deleteTarget && (
            <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
              <div className="bg-[#1E1E1E] p-8 min-h-[170px] rounded-2xl max-w-sm w-full text-center border border-white/10 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
                <p className="text-gray-400 mb-7 font-normal">
                  You want to delete <span className="text-white font-semibold">{deleteTarget.fullName}</span>?
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="w-[100px] py-2.5 rounded-[8px] bg-white/5 hover:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteTarget._id)}
                    disabled={isDeleting}
                    className="w-[100px] py-2.5 rounded-[8px] bg-red-600 hover:bg-red-700 font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
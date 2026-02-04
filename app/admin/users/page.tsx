"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { getToken } from "@/lib/auth-helpers";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get("http://localhost:5050/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err: any) {
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
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:5050/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete user";
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1310] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Users Management</h1>
            <p className="text-[#9FB3A6]">View and manage all system users</p>
          </div>
          <Link
            href="/admin/users/create"
            className="mt-4 md:mt-0 px-6 py-3 rounded-lg bg-[#2ECC71] text-[#0F1310] font-bold hover:bg-[#26c969] transition-all inline-flex items-center gap-2 w-fit shadow-lg"
          >
            ➕ Create User
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border border-[#26322B] bg-[#171C18] overflow-hidden shadow-lg">
          {isLoading ? (
            <div className="p-8 text-center text-[#9FB3A6]">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-[#9FB3A6]">
              No users found. <Link href="/admin/users/create" className="text-[#D4AF37] hover:underline">Create one</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#26322B] bg-[#1B211D]">
                    <th className="px-6 py-3 text-left text-sm font-bold text-[#D4AF37]">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-[#D4AF37]">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-[#D4AF37]">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-[#D4AF37]">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-[#D4AF37]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[#26322B] hover:bg-[#1B211D] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-[#FFFFFF] font-semibold">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#9FB3A6]">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === "admin"
                              ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                              : "bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30"
                          }`}
                        >
                          {user.role === "admin" ? "👑 " : "👤 "}{user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#9FB3A6]">
                        {user.phone || "--"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="text-[#2ECC71] hover:text-[#26c969] font-semibold transition-colors"
                          >
                            👁️ View
                          </Link>
                          <Link
                            href={`/admin/users/${user._id}/edit`}
                            className="text-[#D4AF37] hover:text-[#F0C960] font-semibold transition-colors"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-[#E53935] hover:text-[#FF6B6B] font-semibold transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { getToken } from "../../lib/auth-helpers";

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
            <p className="text-foreground/60 mt-1">View and manage all system users</p>
          </div>
          <Link
            href="/admin/users/create"
            className="mt-4 md:mt-0 px-6 py-2 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 w-fit"
          >
            + Create User
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 text-red-600 border border-red-500/30">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-foreground/60">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-foreground/60">
              No users found. <Link href="/admin/users/create" className="underline hover:no-underline">Create one</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/10">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/60">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-700"
                              : "bg-blue-500/20 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/60">
                        {user.phone || "--"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/users/${user._id}/edit`}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
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

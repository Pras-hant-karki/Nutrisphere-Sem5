"use client";

import Link from "next/link";
import { getUser } from "../../lib/auth-helpers";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [user, setUser] = useState(getUser());

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-foreground/60 mt-1">
            Welcome back, {user?.fullName}! 👋
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Users Card */}
          <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 hover:bg-foreground/8 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-foreground mt-2">--</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
          </div>

          {/* Fitness Content Card */}
          <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 hover:bg-foreground/8 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">
                  Fitness Content
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">--</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <span className="text-xl">💪</span>
              </div>
            </div>
          </div>

          {/* Admin Users Card */}
          <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 hover:bg-foreground/8 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Admin Users</p>
                <p className="text-3xl font-bold text-foreground mt-2">--</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span className="text-xl">⚙️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-4 rounded-lg border border-foreground/20 bg-background hover:bg-foreground/5 transition-colors"
            >
              <div>
                <p className="font-semibold text-foreground">Manage Users</p>
                <p className="text-sm text-foreground/60">View and manage all users</p>
              </div>
              <span>→</span>
            </Link>

            <Link
              href="/admin/users/create"
              className="flex items-center justify-between p-4 rounded-lg border border-foreground/20 bg-background hover:bg-foreground/5 transition-colors"
            >
              <div>
                <p className="font-semibold text-foreground">Create User</p>
                <p className="text-sm text-foreground/60">Add a new user to system</p>
              </div>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-700">
          <p className="text-sm font-medium">📊 More analytics and features coming soon!</p>
        </div>
      </div>
    </div>
  );
}

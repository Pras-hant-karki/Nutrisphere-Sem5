"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="text-blue-600 hover:underline text-sm mb-4 inline-block"
          >
            ← Back to Users
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
          <p className="text-foreground/60 mt-1">User ID: {userId}</p>
        </div>

        {/* Content Card */}
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 md:p-8">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background border border-foreground/10">
              <p className="text-sm font-medium text-foreground/60">Edit Form</p>
              <p className="text-foreground mt-2">
                This is a placeholder page. Edit form will be fetched from API.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                className="px-6 py-2 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                disabled
              >
                Save Changes
              </button>
              <Link
                href={`/admin/users/${userId}`}
                className="px-6 py-2 rounded-lg border border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

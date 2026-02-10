"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { getToken } from "@/lib/auth-helpers";

// Validation schema
const editUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"], { message: "Please select a role" }),
  isActive: z.boolean(),
});

type EditUserData = z.infer<typeof editUserSchema>;

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  image?: string;
  isActive: boolean;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
    mode: "onSubmit",
  });

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
        const userData = response.data.data;
        setUser(userData);
        if (userData.image) {
          setImagePreview(`http://localhost:5000${userData.image}`);
        }
        reset({
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone || "",
          role: userData.role,
          isActive: userData.isActive,
        });
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to fetch user";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EditUserData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone || "");
      formData.append("role", data.role);
      formData.append("isActive", String(data.isActive));

      // Add image only if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const token = getToken();
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "User updated successfully! Redirecting...",
        });

        setTimeout(() => {
          router.push(`/admin/users/${userId}`);
        }, 1500);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to update user";
      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setIsSaving(false);
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
          <h1 className="text-4xl font-bold text-[#D4AF37] mt-4">Edit User</h1>
          <p className="text-[#9FB3A6] mt-2">Update user information</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30">
            {error}
          </div>
        )}

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/30"
                : "bg-[#E53935]/10 text-[#E53935] border-[#E53935]/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center text-[#9FB3A6] rounded-lg border border-[#26322B] bg-[#171C18]">
            Loading user details...
          </div>
        )}

        {/* Edit Form */}
        {!isLoading && user && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 md:p-8 shadow-lg">
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="pb-6 border-b border-[#26322B]">
                  <label className="block text-sm font-bold text-[#D4AF37] mb-4">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-4xl border-2 border-[#D4AF37] overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="cursor-pointer px-4 py-2 rounded-lg bg-[#26322B] text-[#9FB3A6] hover:bg-[#2E3A33] hover:text-[#FFFFFF] transition-all inline-block font-semibold"
                      >
                        📁 Choose Image
                      </label>
                      <p className="text-xs text-[#9FB3A6] mt-2">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-bold text-[#D4AF37] mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...register("fullName")}
                      className="w-full px-4 py-3 rounded-lg bg-[#1B211D] border border-[#26322B] text-[#FFFFFF] placeholder-[#9FB3A6]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter full name"
                    />
                    {errors.fullName && (
                      <p className="text-[#E53935] text-sm mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-[#D4AF37] mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className="w-full px-4 py-3 rounded-lg bg-[#1B211D] border border-[#26322B] text-[#FFFFFF] placeholder-[#9FB3A6]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter email"
                    />
                    {errors.email && (
                      <p className="text-[#E53935] text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-bold text-[#D4AF37] mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-lg bg-[#1B211D] border border-[#26322B] text-[#FFFFFF] placeholder-[#9FB3A6]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-[#E53935] text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-bold text-[#D4AF37] mb-2"
                    >
                      Role *
                    </label>
                    <select
                      id="role"
                      {...register("role")}
                      className="w-full px-4 py-3 rounded-lg bg-[#1B211D] border border-[#26322B] text-[#FFFFFF] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    >
                      <option value="user">👤 User</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                    {errors.role && (
                      <p className="text-[#E53935] text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-[#1B211D] border border-[#26322B]">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="h-5 w-5 rounded border-[#26322B] text-[#2ECC71] focus:ring-[#D4AF37]"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-semibold text-[#FFFFFF] cursor-pointer"
                  >
                    Account Active
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-[#26322B]">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 rounded-lg bg-[#2ECC71] text-[#0F1310] font-bold hover:bg-[#26c969] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "💾 Save Changes"}
                  </button>
                  <Link
                    href={`/admin/users/${userId}`}
                    className="px-6 py-3 rounded-lg border border-[#26322B] text-[#9FB3A6] font-semibold hover:bg-[#1B211D] hover:text-[#FFFFFF] transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

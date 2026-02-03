"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getToken } from "../../../lib/auth-helpers";

// Validation schema
const createUserSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "admin"], { message: "Please select a role" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateUserData = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit",
  });

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

  const onSubmit = async (data: CreateUserData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Create FormData - required by backend multer
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone || "");
      formData.append("password", data.password);
      formData.append("role", data.role);
      
      // Add image only if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const token = getToken();
      const response = await axios.post(
        "http://localhost:5050/api/admin/users",
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
          text: "User created successfully! Redirecting...",
        });
        
        // Reset form
        reset();
        setSelectedFile(null);
        setImagePreview(null);
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create user";
      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1310] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Create New User</h1>
          <p className="text-[#9FB3A6]">Add a new user to the system</p>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/30"
                : "bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 md:p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="pb-6 border-b border-[#26322B]">
              <label className="block text-sm font-bold text-[#D4AF37] mb-4">
                📸 Profile Picture (Optional)
              </label>
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover border-2 border-[#D4AF37] shadow-lg"
                  />
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-sm text-[#9FB3A6] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#2ECC71] file:text-[#0F1310] hover:file:bg-[#26c969] focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-bold text-[#D4AF37] mb-2"
                >
                  👤 Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] placeholder-[#7C8C83] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-[#E53935]">
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
                  📧 Email *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] placeholder-[#7C8C83] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#E53935]">
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
                  📱 Phone (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] placeholder-[#7C8C83] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-[#D4AF37] mb-2"
                >
                  🔐 Password *
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] placeholder-[#7C8C83] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-[#E53935]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold text-[#D4AF37] mb-2"
                >
                  🔐 Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] placeholder-[#7C8C83] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                  placeholder="••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-[#E53935]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-bold text-[#D4AF37] mb-2"
                >
                  👑 Role *
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                >
                  <option value="">Select a role</option>
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-[#E53935]">
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-lg bg-[#2ECC71] text-[#0F1310] font-bold hover:bg-[#26c969] disabled:opacity-60 transition-all shadow-lg"
              >
                {isLoading ? "💾 Creating..." : "💾 Create User"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/users")}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-[#26322B] text-[#9FB3A6] font-semibold hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

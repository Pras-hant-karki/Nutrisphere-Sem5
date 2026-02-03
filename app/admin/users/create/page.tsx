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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New User</h1>
          <p className="text-foreground/60 mt-1">Add a new user to the system</p>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 text-green-600 border border-green-500/30"
                : "bg-red-500/10 text-red-600 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="pb-6 border-b border-foreground/10">
              <label className="block text-sm font-medium text-foreground mb-4">
                Profile Picture (Optional)
              </label>
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover border-2 border-foreground/20"
                  />
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-sm text-foreground/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-foreground file:text-background hover:file:bg-foreground/90"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 outline-none focus:border-foreground/50 transition-colors"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 outline-none focus:border-foreground/50 transition-colors"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 outline-none focus:border-foreground/50 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 outline-none focus:border-foreground/50 transition-colors"
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 outline-none focus:border-foreground/50 transition-colors"
                  placeholder="••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Role *
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-foreground outline-none focus:border-foreground/50 transition-colors"
                >
                  <option value="">Select a role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">
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
                className="flex-1 px-6 py-2 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {isLoading ? "Creating..." : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/users")}
                className="flex-1 px-6 py-2 rounded-lg border border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { getUser, setAuth, getToken, getInitials } from "../../lib/auth-helpers";

// Validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email").readonly(),
  role: z.string().readonly(),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [user, setUserState] = useState(getUser());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      role: user?.role || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    // Load existing image if available
    if (user?.image) {
      setImagePreview(`http://localhost:5050/${user.image}`);
    }
  }, [user]);

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

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phone", data.phone || "");
      
      // Add image only if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const token = getToken();
      const response = await axios.put(
        `http://localhost:5050/api/auth/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const updatedUser = {
          ...user,
          fullName: data.fullName,
          phone: data.phone,
          image: response.data.data.image || user.image,
        };
        
        setUserState(updatedUser);
        setAuth(token!, updatedUser);
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        setSelectedFile(null);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1310] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">My Profile</h1>
          <p className="text-[#9FB3A6]">Manage your personal information</p>
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

        {/* Profile Card */}
        <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 md:p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-[#26322B]">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-[#D4AF37] shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-[#1B211D] flex items-center justify-center border-4 border-[#D4AF37]">
                    <span className="text-5xl font-bold text-[#D4AF37]">
                      {getInitials(user.fullName)}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="image" className="block text-sm font-semibold text-[#D4AF37] mb-2">
                  📸 Profile Picture
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-sm text-[#9FB3A6] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#2ECC71] file:text-[#0F1310] hover:file:bg-[#26c969] focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-[#D4AF37] mb-2"
                >
                  👤 Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] placeholder-[#7C8C83] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-[#E53935]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email - Read Only */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#9FB3A6] mb-2"
                >
                  📧 Email (Non-editable)
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#7C8C83] cursor-not-allowed opacity-60"
                />
              </div>

              {/* Role - Read Only */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-[#9FB3A6] mb-2"
                >
                  👑 Role (Non-editable)
                </label>
                <input
                  id="role"
                  type="text"
                  {...register("role")}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#7C8C83] cursor-not-allowed opacity-60 capitalize"
                />
              </div>

              {/* Phone - Optional */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-[#D4AF37] mb-2"
                >
                  📱 Phone (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#26322B] bg-[#1B211D] text-[#FFFFFF] placeholder-[#7C8C83] outline-none focus:border-[#D4AF37] focus:shadow-lg transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-lg bg-[#2ECC71] text-[#0F1310] font-bold hover:bg-[#26c969] disabled:opacity-60 transition-all shadow-lg"
              >
                {isLoading ? "💾 Saving..." : "💾 Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setImagePreview(
                    user.image
                      ? `http://localhost:5050/${user.image}`
                      : null
                  );
                  setSelectedFile(null);
                }}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-[#26322B] text-[#9FB3A6] font-semibold hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              >
                ↺ Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { getUser, getToken, setAuth, logout } from "@/lib/auth-helpers";
import { Camera, Mail, Phone, User, MapPin, LogOut, Save, X, Check } from "lucide-react";

const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export default function ProfilePage() {
  const currentUser = getUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
    },
  });

  useEffect(() => {
    if (currentUser?.image) {
      setImagePreview(`http://localhost:5000${currentUser.image}`);
    }
  }, [currentUser?.image]);

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

  const onSubmit = async (data: UpdateProfileData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      if (data.phone) formData.append("phone", data.phone);
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const token = getToken();
      const response = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        if (token) {
          setAuth(token, response.data.user);
        }
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        setIsEditing(false);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">My Profile</h1>
        <p className="text-[#9FB3A6]">Manage your personal information</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/50 text-green-400"
              : "bg-red-500/10 border border-red-500/50 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check size={20} /> : <X size={20} />}
            {message.text}
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-current hover:opacity-70"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#161B17] to-[#0F1310] border border-[#2A3630] rounded-3xl p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-lg bg-gradient-to-br from-[#26322B] to-[#171C18]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-[#D4AF37]">
                  {currentUser?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-2 right-2 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#c4a032] transition-colors shadow-lg">
                <Camera size={20} className="text-[#1A1008]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentUser?.fullName || "User"}
            </h2>
            <div className="space-y-2 text-[#9FB3A6]">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-[#D4AF37]" />
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#D4AF37]" />
                <span className="capitalize">{currentUser?.role || "User"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#D4AF37]" />
                <span>Member since 2024</span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#c4a032] text-[#1A1008] rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
              >
                <User size={18} />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="border-t border-[#2A3630] pt-6">
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Full Name</label>
                <input
                  {...register("fullName")}
                  className="w-full px-4 py-3 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-[#0F1310] border border-[#2A3630] rounded-lg text-[#7C8C83] cursor-not-allowed opacity-50"
                />
                <p className="text-[#7C8C83] text-xs mt-1">Email cannot be changed</p>
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Phone Number</label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 bg-[#0F1310] border border-[#2A3630] rounded-lg text-white placeholder-[#7C8C83] focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Account Type</label>
                <input
                  type="text"
                  value={
                    currentUser?.role
                      ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
                      : "User"
                  }
                  disabled
                  className="w-full px-4 py-3 bg-[#0F1310] border border-[#2A3630] rounded-lg text-[#7C8C83] cursor-not-allowed opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-[#2A3630] pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#D4AF37] hover:bg-[#c4a032] disabled:opacity-50 text-[#1A1008] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1A1008] border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                  setImagePreview(
                    currentUser?.image
                      ? `http://localhost:5000${currentUser.image}`
                      : null
                  );
                  setSelectedFile(null);
                }}
                className="flex-1 px-6 py-3 bg-[#2A3630] hover:bg-[#3A4640] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {!isEditing && (
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { getUser, getToken, setAuth, logout } from "@/lib/auth-helpers";

// Validation schema
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
  }, []);

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
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) {
      setMessage({
        type: "error",
        text: "User not authenticated",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phone", data.phone || "");

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const token = getToken();
      const response = await axios.put(
        `http://localhost:5000/api/auth/${userId}`,
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
          text: "Profile updated successfully!",
        });

        const updatedUser = response.data.user;
        if (token) {
          setAuth(token, {
            id: updatedUser._id,
            email: updatedUser.email,
            role: updatedUser.role,
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            image: updatedUser.image,
          });
        }

        setSelectedFile(null);
        setIsEditing(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to update profile";
      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset({
      fullName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
    });
    setSelectedFile(null);
    if (currentUser?.image) {
      setImagePreview(`http://localhost:5000${currentUser.image}`);
    } else {
      setImagePreview(null);
    }
    setMessage(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-8 py-12 bg-gradient-to-br from-[#0F1310] via-[#1a1f1b] to-[#0F1310]">
      <div className="w-full max-w-5xl">
        {/* My Profile Title */}
        <h1 className="text-5xl font-bold text-[#FFD700] text-center mb-12 tracking-wide drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          My Profile
        </h1>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#1a1f1b] to-[#0F1310] rounded-3xl shadow-2xl border-2 border-[#FFD700]/30 p-10 backdrop-blur-sm">
          <div className="flex items-start gap-12 justify-center">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-[220px] h-[220px] rounded-full overflow-hidden border-4 border-[#FFD700] shadow-2xl bg-gradient-to-br from-[#26322B] to-[#171C18]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={currentUser?.fullName || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-7xl text-[#FFD700] font-bold">
                      {currentUser?.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {isEditing && (
                    <label
                      htmlFor="profileImage"
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      <div className="text-center">
                        <svg className="w-12 h-12 text-[#FFD700] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[#FFD700] text-sm font-medium">Change Photo</span>
                      </div>
                    </label>
                  )}
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* User Role Badge */}
              <div className="flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-[#FFD700] font-semibold text-sm capitalize">{currentUser?.role || "User"}</span>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="flex-1 max-w-md">
              <div className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label className="block text-[#FFD700]/80 text-sm font-medium mb-2 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#FFD700] rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative w-full h-14 bg-[#232323] border-2 border-[#FFD700]/50 rounded-2xl flex items-center px-4 gap-3 transition-all duration-300 hover:border-[#FFD700] focus-within:border-[#FFD700] focus-within:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                      <svg className="w-5 h-5 text-[#FFD700] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        {...register("fullName")}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                        className="flex-1 bg-transparent text-white outline-none disabled:cursor-not-allowed placeholder:text-white/40 text-base"
                      />
                    </div>
                  </div>
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="w-full h-14 bg-[#232323]/50 border-2 border-white/20 rounded-2xl flex items-center px-4 gap-3">
                      <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        value={currentUser?.email || ""}
                        disabled
                        placeholder="email@example.com"
                        className="flex-1 bg-transparent text-white/70 outline-none cursor-not-allowed text-base"
                      />
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-[#FFD700]/80 text-sm font-medium mb-2 ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#FFD700] rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative w-full h-14 bg-[#232323] border-2 border-[#FFD700]/50 rounded-2xl flex items-center px-4 gap-3 transition-all duration-300 hover:border-[#FFD700] focus-within:border-[#FFD700] focus-within:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                      <svg className="w-5 h-5 text-[#FFD700] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input
                        type="tel"
                        {...register("phone")}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                        className="flex-1 bg-transparent text-white outline-none disabled:cursor-not-allowed placeholder:text-white/40 text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-8">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 h-12 bg-gradient-to-r from-[#0536CB] to-[#0442d4] border-2 border-[#DFEA0B] rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(5,54,203,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 h-12 bg-gradient-to-r from-[#0536CB] to-[#0442d4] border-2 border-[#DFEA0B] rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(5,54,203,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                      className="flex-1 h-12 bg-gradient-to-r from-[#05CB1C] to-[#04b81a] border-2 border-[#DFEA0B] rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(5,203,28,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Success/Error Message */}
              {message && (
                <div
                  className={`mt-4 p-4 rounded-xl border-2 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                    message.type === "success"
                      ? "bg-green-500/10 text-green-400 border-green-500/40 shadow-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/40 shadow-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {message.type === "success" ? (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    <span className="font-medium text-sm">{message.text}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="px-6 py-3 bg-transparent border-2 border-[#E53935] rounded-xl text-[#E53935] font-semibold hover:bg-[#E53935] hover:text-white transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(229,57,53,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
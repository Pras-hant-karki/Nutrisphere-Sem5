"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { getUser, getToken, setAuth } from "@/lib/auth-helpers";

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
      setImagePreview(`http://localhost:5050${currentUser.image}`);
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
    if (!currentUser?._id) {
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
        `http://localhost:5050/api/auth/${currentUser._id}`,
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
      setImagePreview(`http://localhost:5050${currentUser.image}`);
    } else {
      setImagePreview(null);
    }
    setMessage(null);
    setIsEditing(false);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <h1 className="text-4xl font-bold italic text-[#D4AF37] mb-10 text-center">
        My Profile
      </h1>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl border ${message.type === "success"
            ? "bg-green-500/10 text-green-400 border-green-500/30"
            : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Profile Content - Side by Side Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Profile Image - Left Side */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <div className="relative inline-block">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-2xl bg-gradient-to-br from-[#26322B] to-[#171C18]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={currentUser?.fullName || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-7xl text-[#D4AF37] font-bold">
                  {currentUser?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            {isEditing && (
              <label
                htmlFor="profileImage"
                className="absolute bottom-3 right-3 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#c9a227] transition-all duration-300 shadow-xl border-2 border-[#0F1310]"
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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
          {selectedFile && (
            <p className="text-[#D4AF37] text-sm text-center mt-3">
              New image selected
            </p>
          )}
        </div>

        {/* Profile Form - Right Side */}
        <div className="flex-1 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <div className="flex items-center gap-4 bg-[#171C18] border-2 border-[#D4AF37] rounded-xl px-5 py-4">
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  {...register("fullName")}
                  disabled={!isEditing}
                  placeholder="Full Name"
                  className="flex-1 bg-transparent text-[#9FB3A6] outline-none disabled:cursor-default placeholder:text-[#9FB3A6]"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <div className="flex items-center gap-4 bg-[#171C18] border-2 border-[#D4AF37] rounded-xl px-5 py-4">
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  placeholder="Email"
                  className="flex-1 bg-transparent text-[#9FB3A6] outline-none cursor-default"
                />
              </div>
            </div>

            {/* Role (Read-only) */}
            <div>
              <div className="flex items-center gap-4 bg-[#171C18] border-2 border-[#D4AF37] rounded-xl px-5 py-4">
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <input
                  type="text"
                  value={currentUser?.role || "User"}
                  disabled
                  className="flex-1 bg-transparent text-[#9FB3A6] outline-none cursor-default capitalize"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <div className="flex items-center gap-4 bg-[#171C18] border-2 border-[#D4AF37] rounded-xl px-5 py-4">
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <input
                  type="tel"
                  {...register("phone")}
                  disabled={!isEditing}
                  placeholder="Phone Number"
                  className="flex-1 bg-transparent text-[#9FB3A6] outline-none disabled:cursor-default placeholder:text-[#9FB3A6]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 pt-8">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-12 py-3 rounded-full bg-[#1e90ff] hover:bg-[#1a7fd6] text-white font-bold transition-all duration-300 shadow-lg"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-12 py-3 rounded-full bg-[#1e90ff] hover:bg-[#1a7fd6] text-white font-bold transition-all duration-300 shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-12 py-3 rounded-full bg-[#00c853] hover:bg-[#00b347] text-white font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
                  >
                    {isLoading && (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-foreground/60 mt-1">Manage your profile information</p>
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

        {/* Profile Card */}
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-foreground/10">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-foreground/20"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-foreground/10 flex items-center justify-center border-4 border-foreground/20">
                    <span className="text-3xl font-bold text-foreground/60">
                      {getInitials(user.fullName)}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">
                  Profile Picture
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background text-sm text-foreground/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-foreground file:text-background hover:file:bg-foreground/90"
                />
              </div>
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
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email - Read Only */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email (Non-editable)
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-foreground/5 text-foreground/60 cursor-not-allowed"
                />
              </div>

              {/* Role - Read Only */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Role (Non-editable)
                </label>
                <input
                  id="role"
                  type="text"
                  {...register("role")}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-foreground/5 text-foreground/60 cursor-not-allowed capitalize"
                />
              </div>

              {/* Phone - Optional */}
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
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-2 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {isLoading ? "Saving..." : "Save Changes"}
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

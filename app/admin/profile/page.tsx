"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Mail, Phone, Save, User } from "lucide-react";
import { getToken, getUser, setAuth } from "@/lib/auth-helpers";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";

type Message = {
  type: "success" | "error";
  text: string;
};

export default function AdminProfilePage() {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (currentUser?.image) {
      setImagePreview(`${API_BASE_URL}${currentUser.image}`);
    } else {
      setImagePreview(null);
    }
  }, [currentUser?.image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!currentUser) return;

    try {
      setIsSaving(true);
      setMessage(null);

      const token = getToken();
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const userId = currentUser._id || currentUser.id;
      const response = await axios.put(buildApiUrl(`/api/auth/${userId}`), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        const updated = response.data.user;
        if (token && updated) {
          const nextUser = {
            id: updated._id || updated.id || currentUser.id,
            _id: updated._id || currentUser._id,
            email: updated.email || currentUser.email,
            role: (updated.role || currentUser.role) as "user" | "admin",
            fullName: updated.fullName || fullName,
            phone: updated.phone || phone,
            image: updated.image || currentUser.image,
          };
          setAuth(token, nextUser);
          setCurrentUser(nextUser);
        }

        setSelectedFile(null);
        setMessage({ type: "success", text: "Profile updated successfully" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="rounded-xl border border-[#26322B] bg-[#171C18] p-6 text-[#9FB3A6]">
        User data not found. Please log in again.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Admin Profile</h1>
        <p className="text-[#9FB3A6]">Update your personal and account details</p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg border p-4 text-sm ${
            message.type === "success"
              ? "border-[#2ECC71]/30 bg-[#2ECC71]/10 text-[#2ECC71]"
              : "border-[#E53935]/30 bg-[#E53935]/10 text-[#ff8c8c]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-2xl border border-[#26322B] bg-[#171C18] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b border-[#26322B]">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl border-2 border-[#D4AF37] bg-[#0F1310] overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-[#D4AF37]">
                  {currentUser.fullName?.charAt(0).toUpperCase() || "A"}
                </span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-[#D4AF37] hover:bg-[#c4a032] transition-colors text-[#111417] flex items-center justify-center cursor-pointer shadow-lg">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">{currentUser.fullName}</h2>
            <p className="text-[#9FB3A6] mt-1 capitalize">{currentUser.role}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-[#2A3630] bg-[#0F1310] px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Email</label>
            <div className="w-full rounded-lg border border-[#2A3630] bg-[#0F1310] px-4 py-3 text-[#9FB3A6] flex items-center gap-2">
              <Mail size={16} className="text-[#D4AF37]" />
              <span>{currentUser.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Phone</label>
            <div className="flex items-center gap-2 rounded-lg border border-[#2A3630] bg-[#0F1310] px-4 py-3">
              <Phone size={16} className="text-[#D4AF37]" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={isSaving}
          className="mt-8 w-full rounded-lg bg-[#D4AF37] px-6 py-3 text-[#0F1310] font-semibold hover:bg-[#c4a032] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { getUser, getToken, setAuth, logout } from "@/lib/auth-helpers";
import { Mail, Phone, User, Star, Bell, Camera } from "lucide-react";
import { API_BASE_URL, buildApiUrl } from "@/lib/api/base-url";

const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Name too short"),
  phone: z.string().optional(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

function ProfileInputField({ icon, disabled, value, placeholder, register, ...props }: any) {
  return (
    <div className={`flex items-center w-full border-2 border-[#FACC15] rounded-[20px] bg-[#1E1E1E] overflow-hidden transition-all !h-[72px] ${disabled ? 'opacity-80' : 'focus-within:ring-4 focus-within:ring-[#FACC15]/10'}`}>
      <div className="flex justify-center items-center min-w-[64px] text-white border-r border-white/10">
        {icon}
      </div>
      <div className="flex-1 h-full relative">
        <input
          {...register}
          defaultValue={value}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full h-full bg-transparent px-5 text-white placeholder:text-gray-500 outline-none !text-[18px] font-medium disabled:cursor-not-allowed"
          {...props}
        />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = getUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
    },
  });

  useEffect(() => {
    if (currentUser?.image) {
      setImagePreview(`${API_BASE_URL}${currentUser.image}`);
    }
  }, [currentUser?.image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UpdateProfileData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      if (data.phone) formData.append("phone", data.phone);
      if (selectedFile) formData.append("image", selectedFile);

      const token = getToken();
      const userId = currentUser?._id || currentUser?.id;
      const response = await axios.put(buildApiUrl(`/api/auth/${userId}`), formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        if (token) setAuth(token, response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0705] text-white flex flex-col relative font-sans overflow-x-hidden">
      
      {/* NOTIFICATION BELL */}
      <div className="absolute top-8 right-10 z-50">
        <div className="relative bg-white !p-4 rounded-full shadow-2xl cursor-pointer hover:scale-105 transition-all">
          <Bell className="text-black w-7 h-7" />
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[12px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-black">1</span>
        </div>
      </div>

      {/* HEADING */}
      <div className="w-full text-center !pt-10 !mb-10">
        <h1 className="!text-[64px] font-black text-[#FACC15] tracking-tight">My Profile</h1>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center !gap-x-32 w-full max-w-6xl mx-auto px-10 pb-0">
        
        {/* LEFT COLUMN: Avatar + Edit/Save buttons */}
        <div className="flex flex-col items-center justify-between !h-[500px] !-mt-10 !ml-45">
          <div className="relative group">
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-zinc-800 bg-[#1E1E1E] shadow-[0_0_60px_rgba(0,0,0,0.6)] flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-[120px] font-black text-[#FACC15]">P</div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-6 right-8 bg-[#FACC15] p-4 rounded-full cursor-pointer shadow-xl border-4 border-black hover:scale-110 transition-transform">
                <Camera size={24} className="text-black" />
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
          {/* Edit + Save below avatar */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => { if(isEditing) reset(); setIsEditing(!isEditing); }}
              className={`!w-[120px] !h-[50px] rounded-[10px] font-black !text-[18px] transition-all active:scale-95 shadow-xl ${
                isEditing ? 'bg-red-600 text-white' : 'bg-[#0B30D9] text-white'
              }`}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isEditing || isLoading}
              className={`!w-[120px] !h-[50px] bg-[#00CA25] text-white font-black rounded-[10px] !text-[18px] shadow-xl transition-all active:scale-95 ${
                (!isEditing || isLoading) ? 'opacity-20 cursor-not-allowed' : 'hover:bg-green-500'
              }`}
            >
              {isLoading ? "Wait..." : "Save"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Input Fields */}
        <div className="flex flex-col w-full max-w-[440px] !ml-auto !gap-y-8 mt-12 lg:mt-0">
          <ProfileInputField icon={<User size={24} />} placeholder="Full Name" register={register("fullName")} disabled={!isEditing} />
          <ProfileInputField icon={<Mail size={24} />} placeholder="Email" value={currentUser?.email} disabled={true} />
          <ProfileInputField icon={<Star size={24} />} placeholder="Role" value={currentUser?.role || "User"} disabled={true} />
          <ProfileInputField icon={<Phone size={24} />} placeholder="Phone Number" register={register("phone")} disabled={!isEditing} />
        </div>
      </div>

      {/* LOGOUT: fixed 20px from bottom-right */}
      <button 
        type="button"
        onClick={() => { logout(); router.push("/login"); }}
        className="fixed bottom-[20px] right-10 bg-[#EAE5DF] hover:bg-white text-[#4A171E] !px-8 !h-[45px] rounded-[6px] font-black !text-[14px] shadow-2xl uppercase tracking-widest transition-all active:scale-95 border border-zinc-300 z-50"
      >
        Logout
      </button>
    </div>
  );
}
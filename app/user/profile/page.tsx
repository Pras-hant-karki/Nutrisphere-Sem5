"use client";

import { useState, useEffect } from "react";
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

/**
 * 1. FIXED INPUT FIELD COMPONENT
 * (Defined only once to avoid the "defined multiple times" error seen in your screenshot)
 */
function InputField({ icon, disabled, value, placeholder, register, ...props }: any) {
  return (
    <div className="flex items-center bg-[#121212] border border-[#FFCC00]/80 rounded-xl px-5 h-[62px]">
      <div className="w-8 flex items-center justify-center text-[#FFCC00] mr-3 shrink-0">
        {icon}
      </div>
      <input
        {...register}
        defaultValue={value}
        disabled={disabled}
        placeholder={placeholder}
        className="bg-transparent w-full outline-none text-white text-[15px] placeholder-zinc-600 disabled:text-zinc-500 font-medium"
        {...props}
      />
    </div>
  );
}

export default function ProfilePage() {
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
      if (selectedFile) formData.append("profilePicture", selectedFile);

      const token = getToken();
      const response = await axios.put(buildApiUrl("/api/auth/update-profile"), formData, {
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
    <div className="min-h-screen bg-[#0A0705] text-white flex flex-col relative font-sans overflow-y-auto pb-20">
      
      {/* BELL POSITIONING */}
      <div className="absolute z-50" style={{ top: "24px", right: "32px" }}>
        <div className="relative bg-white p-2.5 rounded-full shadow-xl">
          <Bell className="text-black w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#0A0705]">1</span>
        </div>
      </div>

      {/* HEADER POSITIONING - Detailed adjustment for top/bottom gap */}
      <div className="w-full text-center" style={{ marginTop: "80px", marginBottom: "50px" }}>
        <h1 className="text-5xl font-bold text-[#FFCC00] tracking-tight">My Profile</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-16 w-full max-w-5xl mx-auto px-6">
        
        {/* LEFT COLUMN: IMAGE AND BIG BUTTONS */}
        <div className="flex flex-col items-center" style={{ marginTop: "-40px" }}>
          
          {/* IMAGE HOLDER POSITIONING */}
          <div className="relative" style={{ marginBottom: "40px" }}>
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border border-zinc-800 bg-[#121212] shadow-2xl flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-9xl font-bold text-[#FFCC00] opacity-90">P</div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-6 right-8 bg-[#FFCC00] p-3 rounded-full cursor-pointer shadow-xl border-4 border-[#0A0705]">
                <Camera size={20} className="text-black" />
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* BIG BUTTONS ADJUSTMENT:
              - h-[80px]: Forces a very tall height. Change '80' to make it bigger/smaller.
              - w-40: Widens them slightly to maintain a professional look.
              - text-lg: Makes the text inside bigger to match the button size.
          */}
          <div className="flex items-center gap-6" style={{ marginTop: "20px" }}>
            <button 
              type="button" 
              onClick={() => { if(isEditing) reset(); setIsEditing(!isEditing); }} 
              className={`w-32 h-[40px] rounded-full font-bold text-lg transition-all active:scale-95 shadow-2xl ${
                isEditing ? 'bg-red-600 text-white' : 'bg-[#0B30D9] text-white'
              }`}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            
            <button 
              type="button" 
              onClick={handleSubmit(onSubmit)} 
              disabled={!isEditing || isLoading} 
              className={`w-32 h-[40px] bg-[#00CA25] text-white font-bold rounded-full text-lg shadow-2xl transition-all active:scale-95 ${
                (!isEditing || isLoading) ? 'opacity-20 cursor-not-allowed' : 'hover:bg-green-500 shadow-green-900/40'
              }`}
            >
              {isLoading ? "Wait..." : "Save"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM FIELDS */}
        <div className="flex flex-col w-full max-w-[440px]">
          <div className="flex flex-col gap-6">
            <InputField icon={<User size={18} />} placeholder="Full Name" register={register("fullName")} disabled={!isEditing} />
            <InputField icon={<Mail size={18} />} placeholder="Email" value={currentUser?.email} disabled />
            <InputField icon={<Star size={18} />} placeholder="Role" value={currentUser?.role || "User"} disabled />
            <InputField icon={<Phone size={18} />} placeholder="Phone Number" register={register("phone")} disabled={!isEditing} />
          </div>

          {/* LOGOUT BUTTON POSITIONING (Exactly 70px down from text fields) */}
          <div className="flex justify-end" style={{ marginTop: "70px" }}>
            <button 
              type="button"
              onClick={logout}
              className="bg-[#EAE5DF] hover:bg-white text-[#4A171E] px-10 py-3 rounded font-black text-[13px] shadow-lg border border-zinc-200 uppercase tracking-widest active:scale-95 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
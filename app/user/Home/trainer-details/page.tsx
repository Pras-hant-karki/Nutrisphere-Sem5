"use client";

export default function TrainerDetailsPage() {
  // This data would come from backend in real app
  const trainer = {
    fullName: "John Martinez",
    email: "john.martinez@nutrisphere.com",
    role: "Trainer",
    phone: "+1 234 567 8900",
    image: null, // Would be trainer's profile image URL
    bio: "Passionate fitness professional with 8 years of experience. Specialized in strength training, HIIT, and nutrition planning. Dedicated to helping clients achieve their health and wellness goals through personalized training programs and nutritional guidance.\n\nCertifications:\n- NASM Certified Personal Trainer\n- ACE Fitness Nutrition Specialist\n- CrossFit Level 2 Trainer\n\nAvailability:\nMonday - Friday: 6:00 AM - 9:00 PM\nSaturday: 8:00 AM - 2:00 PM\nSunday: Closed",
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center">
        Trainer Details
      </h1>

      {/* Trainer Profile Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
        {/* Trainer Image - Left Side */}
        <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-2xl bg-gradient-to-br from-[#26322B] to-[#171C18]">
            {trainer.image ? (
              <img
                src={trainer.image}
                alt={trainer.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-7xl text-[#D4AF37] font-bold">
                {trainer.fullName?.charAt(0).toUpperCase() || "T"}
              </div>
            )}
          </div>
        </div>

        {/* Trainer Info Fields - Right Side */}
        <div className="flex-1 w-full space-y-5">
          {/* Full Name */}
          <div className="flex items-center gap-4 bg-[#171C18] border-2 border-[#D4AF37] rounded-xl px-5 py-4">
            <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[#9FB3A6]">{trainer.fullName || "Full Name"}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 bg-[#171C18] border border-[#26322B] rounded-xl px-5 py-3.5 hover:border-[#D4AF37]/40 transition-colors">
            <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[#9FB3A6]">{trainer.email || "Email"}</span>
          </div>

          {/* Role */}
          <div className="flex items-center gap-4 bg-[#171C18] border border-[#26322B] rounded-xl px-5 py-3.5 hover:border-[#D4AF37]/40 transition-colors">
            <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-[#9FB3A6]">{trainer.role || "Role"}</span>
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-4 bg-[#171C18] border border-[#26322B] rounded-xl px-5 py-3.5 hover:border-[#D4AF37]/40 transition-colors">
            <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-[#9FB3A6]">{trainer.phone || "Phone Number"}</span>
          </div>
        </div>
      </div>

      {/* Trainer Bio - Notepad Area */}
      <div className="bg-[#171C18] border border-[#26322B] rounded-xl p-5 min-h-[200px]">
        <p className="text-white/90 whitespace-pre-line leading-relaxed">
          {trainer.bio || "Trainer bio will appear here..."}
        </p>
      </div>
    </div>
  );
}

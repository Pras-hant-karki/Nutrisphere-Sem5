"use client";

export default function TrainerDetailsPage() {
  const trainer = {
    name: "John Martinez",
    title: "Certified Personal Trainer",
    experience: "8 years",
    specialization: ["Strength Training", "HIIT", "Nutrition Planning"],
    rating: 4.9,
    reviews: 156,
    bio: "Passionate fitness professional dedicated to helping clients achieve their health and wellness goals through personalized training programs and nutritional guidance.",
    certifications: [
      "NASM Certified Personal Trainer",
      "ACE Fitness Nutrition Specialist",
      "CrossFit Level 2 Trainer",
    ],
    availability: [
      { day: "Monday", times: "6:00 AM - 9:00 PM" },
      { day: "Tuesday", times: "6:00 AM - 9:00 PM" },
      { day: "Wednesday", times: "6:00 AM - 9:00 PM" },
      { day: "Thursday", times: "6:00 AM - 9:00 PM" },
      { day: "Friday", times: "6:00 AM - 8:00 PM" },
      { day: "Saturday", times: "8:00 AM - 2:00 PM" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Trainer Details</h1>
        <p className="text-[#9FB3A6]">Know your Trainer!</p>
      </div>

      {/* Trainer Profile Card */}
      <div className="bg-gradient-to-br from-[#171C18] to-[#0F1310] border border-white/20 rounded-2xl p-8 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Trainer Photo */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl bg-[#1a1a1a]">
              <div className="h-full w-full flex items-center justify-center text-6xl text-[#D4AF37] font-bold bg-gradient-to-br from-[#26322B] to-[#171C18]">
                JM
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(trainer.rating) ? "text-[#D4AF37]" : "text-gray-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-bold">{trainer.rating}</span>
              </div>
              <p className="text-[#9FB3A6] text-sm">{trainer.reviews} reviews</p>
            </div>
          </div>

          {/* Trainer Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{trainer.name}</h2>
            <p className="text-[#D4AF37] text-lg mb-4">{trainer.title}</p>
            <p className="text-[#9FB3A6] mb-6 leading-relaxed">{trainer.bio}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-[#0F1310] rounded-lg p-4 border border-white/10">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-[#9FB3A6] text-xs">Experience</p>
                  <p className="text-white font-semibold">{trainer.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#0F1310] rounded-lg p-4 border border-white/10">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <p className="text-[#9FB3A6] text-xs">Clients Trained</p>
                  <p className="text-white font-semibold">200+</p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <p className="text-[#9FB3A6] text-sm mb-3">Specializations:</p>
              <div className="flex flex-wrap gap-2">
                {trainer.specialization.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold rounded-full border border-[#D4AF37]/30"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Availability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certifications */}
        <div className="bg-[#171C18] border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Certifications</h3>
          </div>
          <div className="space-y-3">
            {trainer.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-[#0F1310] rounded-lg p-3 border border-white/10"
              >
                <svg className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[#9FB3A6] text-sm">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-[#171C18] border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Availability</h3>
          </div>
          <div className="space-y-2">
            {trainer.availability.map((schedule, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-[#0F1310] rounded-lg p-3 border border-white/10"
              >
                <span className="text-white font-semibold text-sm">{schedule.day}</span>
                <span className="text-[#9FB3A6] text-sm">{schedule.times}</span>
              </div>
            ))}
            <div className="bg-[#0F1310] rounded-lg p-3 border border-white/10 text-center">
              <span className="text-[#7C8C83] text-sm">Sunday: Closed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-[#D4AF37] hover:bg-[#c9a227] text-black font-bold py-4 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book a Session
        </button>
        <button className="flex-1 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Send Message
        </button>
      </div>
    </div>
  );
}

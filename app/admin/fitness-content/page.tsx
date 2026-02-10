"use client";

export default function FitnessContentPage() {
  return (
    <div>
      <div className="max-w-7xl">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Fitness Content</h1>
        <p className="text-[#9FB3A6] mb-8">Manage fitness guides, videos, and content</p>

        <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 shadow-lg">
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏋️</span>
            </div>
            <p className="text-[#9FB3A6] text-lg">Manage fitness content here</p>
            <p className="text-[#7C8C83] text-sm mt-2">Upload workout guides and training videos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

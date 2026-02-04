"use client";

export default function FitnessPlansPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Fitness Plans</h1>
      <p className="text-[#9FB3A6] mb-8">View your personalized fitness plans</p>

      <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 shadow-lg">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💪</div>
          <p className="text-[#9FB3A6] text-lg">🏋️ Your fitness plans will appear here</p>
          <p className="text-[#7C8C83] text-sm mt-2">Check back soon for personalized workout and diet plans!</p>
        </div>
      </div>
    </div>
  );
}
"use client";

export default function AppointmentsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Appointments</h1>
      <p className="text-[#9FB3A6] mb-8 text-sm">Manage your fitness trainer sessions</p>

      <div className="rounded-xl border border-[#26322B] bg-[#171C18] p-6">
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-[#9FB3A6] text-base font-medium">Book your appointments here</p>
          <p className="text-[#7C8C83] text-sm mt-2">Schedule sessions with your trainer</p>
        </div>
      </div>
    </div>
  );
}
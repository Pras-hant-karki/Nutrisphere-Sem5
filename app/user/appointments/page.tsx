"use client";

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-[#0F1310]">
      <div className="max-w-7xl">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">Appointments</h1>
        <p className="text-[#9FB3A6] mb-8">Manage your fitness trainer sessions</p>

        <div className="rounded-lg border border-[#26322B] bg-[#171C18] p-6 shadow-lg">
          <div className="text-center py-12">
            <p className="text-[#9FB3A6] text-lg"> Book your appointments here</p>
            <p className="text-[#7C8C83] text-sm mt-2">Schedule sessions with your trainer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

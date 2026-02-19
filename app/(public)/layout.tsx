import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#170306] text-white">
      {/* NAVBAR */}
      <header className="w-full h-16 px-4 md:px-8 flex items-center sticky top-0 bg-[#170306]/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-4 md:gap-5">
        </div>
      </header>

      {children}
    </main>
  );
}

import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#1A1008" }}>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE LOGO */}
        <div className="hidden md:flex items-center justify-center px-10">
          <Image src="/image/logo.png" alt="NutriSphere" width={420} height={160} priority />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0F1310" }}>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE LOGO */}
        <div className="hidden md:flex items-center justify-center px-10">
          <Image src="/image/logo.png" alt="NutriSphere" width={420} height={160} priority />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex items-center justify-center px-6 py-10">
          <div
            className="w-full max-w-md p-10 rounded-2xl shadow-lg"
            style={{
              backgroundColor: "#171C18",
              border: "1px solid #26322B",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

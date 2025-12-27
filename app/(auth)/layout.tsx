import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE LOGO */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src="/image/logo.png"
            alt="NutriSphere"
            width={360}
            height={140}
            priority
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            {children}
          </div>
        </div>

      </div>
    </main>
  );
}

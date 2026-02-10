import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="w-full bg-[#0F1310] text-white">

      {/* NAVBAR */}
      <header className="w-full h-16 px-8 flex justify-between items-center border-b border-[#26322B]/50 sticky top-0 bg-[#0F1310]/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <Image src="/image/logo.png" alt="NutriSphere" width={32} height={32} className="object-contain" />
          <span className="text-[#D4AF37] font-bold text-lg">NutriSphere</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="h-9 px-5 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
              Sign In
            </button>
          </Link>
          <Link href="/register">
            <button className="h-9 px-5 bg-[#D4AF37] text-[#0F1310] rounded-lg text-sm font-semibold hover:bg-[#c4a032] transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center px-8">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">
          <div className="relative w-full h-[380px] flex justify-center">
            <Image
              src="/image/logo.png"
              alt="NutriSphere logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight text-[#D4AF37]">
              Train Together, <br /> Grow Together
            </h1>
            <p className="mt-6 text-base text-[#9FB3A6] leading-relaxed">
              Become part of a driven fitness family.
              Get coached, stay accountable, and push beyond
              your limits with confidence.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/register">
                <button className="px-6 py-3 bg-[#D4AF37] text-[#0F1310] rounded-xl text-sm font-bold hover:bg-[#c4a032] transition-all">
                  Start Your Journey
                </button>
              </Link>
              <Link href="/login">
                <button className="px-6 py-3 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl text-sm font-medium hover:bg-[#D4AF37]/10 transition-all">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      {[
        {
          title: "Personal Training",
          desc: "Get personalized instruction and workout plans tailored specifically to your goals.",
          img: "/image/pt.png",
          alt: "Personal Training",
          reverse: false,
        },
        {
          title: "Personal Plans",
          desc: "Customized diet and fitness plans based on your body type and lifestyle.",
          img: "/image/plan.png",
          alt: "Personal Plans",
          reverse: true,
        },
        {
          title: "Progress Tracking",
          desc: "Track workouts, body stats, and achievements all in one place.",
          img: "/image/track.png",
          alt: "Progress Tracking",
          reverse: false,
        },
      ].map((feature, i) => (
        <section key={i} className="py-24 px-8">
          <div className={`w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center ${feature.reverse ? "" : ""}`}>
            {feature.reverse ? (
              <>
                <div className="max-w-md">
                  <div className="w-10 h-1 bg-[#D4AF37] rounded-full mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">{feature.title}</h2>
                  <p className="text-[#9FB3A6] leading-relaxed">{feature.desc}</p>
                </div>
                <div className="relative w-full h-[350px] flex justify-center">
                  <Image src={feature.img} alt={feature.alt} fill className="object-contain" />
                </div>
              </>
            ) : (
              <>
                <div className="relative w-full h-[350px] flex justify-center">
                  <Image src={feature.img} alt={feature.alt} fill className="object-contain" />
                </div>
                <div className="max-w-md">
                  <div className="w-10 h-1 bg-[#D4AF37] rounded-full mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">{feature.title}</h2>
                  <p className="text-[#9FB3A6] leading-relaxed">{feature.desc}</p>
                </div>
              </>
            )}
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <footer className="border-t border-[#26322B] py-8 px-8 text-center">
        <p className="text-[#7C8C83] text-sm">&copy; 2026 NutriSphere. All rights reserved.</p>
      </footer>
    </main>
  );
}

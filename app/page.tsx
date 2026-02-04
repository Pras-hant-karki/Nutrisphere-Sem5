import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="w-full bg-[#0F1310] text-white">

      {/* NAVBAR */}
      <header className="w-full px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 font-medium">
            Home
          </span>
          <span className="flex items-center gap-1 font-medium">
            About Us
          </span>
        </div>

        <div className="flex gap-3">
          <Link href="/login">
            <button className="px-4 py-2 border rounded-md">
              Get Started
            </button>
          </Link>

          <Link href="/register">
            <button className="px-4 py-2 rounded-md bg-[#5b3a3a] text-yellow-300 font-medium">
              Create new account
            </button>
          </Link>
        </div>
      </header>

      {/* HOME / LANDING */}
      <section className="min-h-screen flex items-center px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT — LOGO */}
          <div className="relative w-full h-[380px]">
            <Image
              src="/image/logo.png"
              alt="NutriSphere logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* RIGHT — TEXT */}
          <div>
            <h1 className="text-5xl font-bold leading-tight text-[#D4AF37]">
              Train Together, <br /> Grow Together
            </h1>

            <p className="mt-4 text-lg text-white max-w-md">
              Become part of a driven fitness family.
              Get coached, stay accountable, and push beyond
              your limits with confidence.
            </p>
          </div>

        </div>
      </section>

      {/* PERSONAL TRAINING */}
      <section className="min-h-screen flex items-center px-10 bg-[#0F1310]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* TEXT LEFT */}
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#D4AF37" }}>
            Personal Training
          </h2>

          <p className="text-sm mt-2" style={{ color: "#C0C0C0" }}>
            Get personalized instruction and workout plans
            tailored specifically to your goals.
          </p>
          </div>


          {/* IMAGE RIGHT */}
          <div className="relative w-full h-[320px]">
            <Image
              src="/image/pt.png"
              alt="Personal Training"
              fill
              className="object-contain"
            />
          </div>

        </div>
      </section>

      {/* PERSONAL PLANS */}
      <section className="min-h-screen flex items-center px-10 bg-[#0F1310]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* IMAGE LEFT */}
          <div className="relative w-full h-[320px]">
            <Image
              src="/image/plan.png"
              alt="Personal Plans"
              fill
              className="object-contain"
            />
          </div>

          {/* TEXT RIGHT */}
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#D4AF37" }}>
            Personal Plans
          </h2>

          <p className="text-sm mt-2" style={{ color: "#C0C0C0" }}>
            Customized diet and fitness plans based on your
              body type and lifestyle.
          </p>
          </div>
          

        </div>
      </section>

      {/* PROGRESS TRACKING */}
      <section className="min-h-screen flex items-center px-10 bg-[#0F1310]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* TEXT LEFT */}
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#D4AF37" }}>
            Progress Tracking
          </h2>

          <p className="text-sm mt-2" style={{ color: "#C0C0C0" }}>
            Track workouts, body stats, and achievements
              all in one place.
          </p>
          </div>

          {/* IMAGE RIGHT */}
          <div className="relative w-full h-[350px]">
            <Image
              src="/image/track.png"
              alt="Progress Tracking"
              fill
              className="object-contain"
            />
          </div>

        </div>
      </section>

    </main>
  );
}

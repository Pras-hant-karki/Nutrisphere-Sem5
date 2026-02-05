import Image from "next/image";
import Link from "next/link";
import { Home, Info } from "lucide-react";

export default function Page() {
  return (
    <main className="w-full bg-[#0F1310] text-white">

      {/* NAVBAR */}
      <header className="w-full h-20 px-10 flex justify-between items-center">

        <div className="flex items-center gap-8 text-sm font-medium">

          <span className="flex items-center gap-2 cursor-pointer">
            <Home size={18} />
            Home
          </span>

          <span className="flex items-center gap-2 cursor-pointer">
            <Info size={18} />
            About Us
          </span>
        </div>

        <div className="flex items-center gap-4 -ml-6">
          {/* buttons here */}

          <Link href="/login">
            <button
              className="
                h-7 w-30
                bg-[#E6E6E6] text-black
                rounded-none text-sm font-medium
                hover:bg-[#dcdcdc] transition
              "
            >
              Get Started
            </button>
          </Link>

          <Link href="/register">
            <button
              className="
                h-7 w-45
                bg-[#4A2F2F] text-yellow-400
                rounded-none text-sm font-semibold
                hover:opacity-90 transition
              "
            >
              Create new account
            </button>
          </Link>

        </div>

      </header>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-10">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-20 items-center">

          <div className="relative w-full h-[420px] flex justify-center">
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

            <p className="mt-6 text-base text-white/90">
              Become part of a driven fitness family.
              Get coached, stay accountable, and push beyond
              your limits with confidence.
            </p>
          </div>

        </div>
      </section>


      {/* PERSONAL TRAINING */}
      <section className="min-h-screen flex items-center justify-center px-10">
      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">

        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-[#D4AF37]">
            Personal Training
          </h2>

          <p className="mt-4 text-base text-white/80">
            Get personalized instruction and workout plans tailored
            specifically to your goals.
          </p>
        </div>

        <div className="relative w-full h-[420px] flex justify-center">
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
      <section className="min-h-screen flex items-center justify-center px-10">
      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">

        <div className="relative w-full h-[420px] flex justify-center">
          <Image
            src="/image/plan.png"
            alt="Personal Plans"
            fill
            className="object-contain"
          />
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-[#D4AF37]">
            Personal Plans
          </h2>

          <p className="mt-4 text-base text-white/80">
            Customized diet and fitness plans based on your
            body type and lifestyle.
          </p>
        </div>

      </div>
    </section>


      {/* PROGRESS TRACKING */}
      <section className="min-h-screen flex items-center justify-center px-10">
      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">

        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-[#D4AF37]">
            Progress Tracking
          </h2>

          <p className="mt-4 text-base text-white/80">
            Track workouts, body stats, and achievements
            all in one place.
          </p>
        </div>

        <div className="relative w-full h-[420px] flex justify-center">
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

import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="w-full bg-white text-black">

      {/* NAVBAR */}
      <header className="w-full px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 font-medium">
            🏠 Home
          </span>
          <span className="flex items-center gap-1 font-medium">
            👤 About Us
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

      {/* HERO / LANDING */}
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
            <h1 className="text-5xl font-bold leading-tight">
              Train Together, <br /> Grow Together
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-md">
              Become part of a driven fitness family.
              Get coached, stay accountable, and push beyond
              your limits with confidence.
            </p>
          </div>

        </div>
      </section>

      {/* PERSONAL TRAINING */}
      <section className="min-h-screen flex items-center px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* TEXT LEFT */}
          <div>
            <h2 className="text-3xl font-semibold">Personal Training</h2>
            <p className="mt-3 text-gray-600">
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
      <section className="min-h-screen flex items-center px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="relative w-full h-[320px]">
            <Image
              src="/image/plan.png"
              alt="Personal Plans"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold">Personal Plans</h2>
            <p className="mt-3 text-gray-600">
              Customized diet and fitness plans based on your
              body type and lifestyle.
            </p>
          </div>

        </div>
      </section>

      {/* PROGRESS TRACKING */}
      <section className="min-h-screen flex items-center px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-semibold">Progress Tracking</h2>
            <p className="mt-3 text-gray-600">
              Track workouts, body stats, and achievements
              all in one place.
            </p>
          </div>

          <div className="relative w-full h-[320px]">
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

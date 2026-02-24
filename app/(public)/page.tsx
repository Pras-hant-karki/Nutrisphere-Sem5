import Image from "next/image";

const sections = [
  {
    title: "Personal\nTraining",
    desc: "Get all personalized instruction and workout tips staying at home.",
    image: "/image/pt.png",
    imageAlt: "Personal Training",
    reverse: true,
  },
  {
    title: "Personal\nPlans",
    desc: "Get personalized diet and workout plans based on your goal",
    image: "/image/plan.png",
    imageAlt: "Personal Plans",
    reverse: true,
  },
  {
    title: "Progress\nTracking",
    desc: "Track all your fitness progress in one place",
    image: "/image/track.png",
    imageAlt: "Progress Tracking",
    reverse: true,
  },
];

export default function Page() {
  return (
    <main className="w-full min-h-screen bg-[#170306] text-white">
      <section className="min-h-[calc(100vh-50px)] flex items-center px-6 md:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-[1940px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative h-[200px] sm:h-[260px] md:h-[420px]">
            <Image
              src="/image/logo.png"
              alt="NutriSphere Logo"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="max-w-lg">
            <h1 className="text-[38px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-extrabold leading-[1.05] text-[#F2C200]">
              Train Together,
              <br />
              Grow Together
            </h1>
            <div className="h-6" />
            <p className="mt-5 max-w-md text-sm md:text-base leading-relaxed text-[#d7d7d7]">
              Become part of a driven fitness family. Get coached, stay
              accountable, and push beyond your limits with confidence.
            </p>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="min-h-[calc(100vh-50px)] flex items-center px-6 md:px-12 lg:px-20"
        >
          <div className="mx-auto grid w-full max-w-[1940px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
            <div
              className={`max-w-md text-center md:text-left ${
                section.reverse ? "md:order-2 md:justify" : ""
              }`}
            >
              <h2 className="text-[40px] sm:text-[50px] md:text-[58px] font-extrabold leading-[1.08] text-[#F2C200] whitespace-pre-line">
                {section.title}
              </h2>
              <p className="mt-5 max-w-sm text-sm md:text-base leading-relaxed text-[#d7d7d7] mx-auto md:mx-0">
                {section.desc}
              </p>
            </div>

            <div
              className={`relative h-[260px] sm:h-[320px] md:h-[400px] ${
                section.reverse ? "md:order-1" : ""
              }`}
            >
              <Image
                src={section.image}
                alt={section.imageAlt}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}

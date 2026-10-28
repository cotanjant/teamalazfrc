import Image from "next/image";
import { siteCollection } from "@/data/collection";
import { GsapSectionAnimator } from "@/components/GsapSectionAnimator";

export function AboutSection() {
  const { team } = siteCollection;

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative border-t border-[#141414] bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <GsapSectionAnimator
        sectionId="team"
        selector=".about-reveal"
        yOffset={24}
        duration={0.8}
        stagger={0.12}
        blur={12}
      />
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7">
            <p className="about-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
              {team.title || "Our Team"}
            </p>
            <h2
              id="team-heading"
              className="about-reveal blur-reveal mt-3 text-3xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8] sm:text-4xl md:text-5xl"
            >
              {team.tagline}
            </h2>

            <div className="about-reveal blur-reveal mt-8 space-y-6 text-base leading-[1.65] text-[#E8E8E8]/80 max-w-[65ch]">
              <p>{team.description}</p>
            </div>
          </div>

          {/* Right Column: Authentic Team Photography */}
          <div className="about-reveal blur-reveal lg:col-span-5">
            <div className="group relative border border-[#1A1A1A] bg-[#050505] p-3 shadow-2xl transition-all duration-300 hover:border-[#FF7800]/50 hover:shadow-[0_0_30px_rgba(255,120,0,0.12)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#1A1A1A] bg-[#0A0A0A]">
                <Image
                  src={team.media || "/medias/team-hands.webp"}
                  alt={team.mediaAlt || "Team ALAZ members"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

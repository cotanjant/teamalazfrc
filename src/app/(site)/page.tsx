import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { AboutSection } from "@/components/AboutSection";
import { DepartmentsSection } from "@/components/DepartmentsSection";
import { MissionVisionSection } from "@/components/MissionVisionSection";
import { RobotPreviewSection } from "@/components/RobotPreviewSection";
import { OutreachPreviewSection } from "@/components/OutreachPreviewSection";
import { PartnersSection } from "@/components/PartnersSection";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <AboutSection />
      <DepartmentsSection />
      <MissionVisionSection />
      <RobotPreviewSection />
      <OutreachPreviewSection />
      <PartnersSection />
      <ContactSection />
    </>
  );
}

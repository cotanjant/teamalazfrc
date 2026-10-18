"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCollection } from "@/data/collection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const DEPARTMENTS = [
  "Mechanical",
  "Electrical",
  "Coding",
  "CAD",
  "Project",
  "Social Media",
  "Documentation",
  "Sponsorship",
  "Awards",
];

export function ContactSection() {
  const { contact, media } = siteCollection;
  const sectionRef = useRef<HTMLElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const leftItems = gsap.utils.toArray<HTMLElement>(".contact-left-reveal");
      const rightCard = gsap.utils.toArray<HTMLElement>(".contact-right-reveal");

      gsap.fromTo(
        leftItems,
        {
          opacity: 0,
          y: 24,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        rightCard,
        {
          opacity: 0,
          y: 30,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`ALAZ Basvuru - ${name || "Aday"} (${department || "Genel"})`);
    const body = encodeURIComponent(
      `Isim: ${name}\nE-posta: ${email}\nBasvurulan Departman: ${department}\n\nMesaj / Aciklama:\n${message}`
    );
    window.location.href = `mailto:${contact.email || "alazfrc@gmail.com"}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative bg-[#000000] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Side: Contact Narrative, Email & Social Links */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="contact-left-reveal blur-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#FF7800]">
                {contact.title || "Contact"}
              </p>
              <h2
                id="contact-heading"
                className="contact-left-reveal blur-reveal mt-3 text-3xl font-bold tracking-[-0.02em] leading-[1.08] text-[#E8E8E8] sm:text-4xl md:text-5xl"
              >
                {contact.tagline}
              </h2>

              <p className="contact-left-reveal blur-reveal mt-6 text-base leading-[1.65] text-[#E8E8E8]/80 max-w-[65ch]">
                {contact.description}
              </p>

              {/* Email Direct Link */}
              <div className="contact-left-reveal blur-reveal mt-8 border-t border-[#1A1A1A] pt-6">
                <span className="block font-mono text-xs text-[#666666]">
                  ELECTRONIC MAIL
                </span>
                <a
                  href={`mailto:${contact.email || "alazfrc@gmail.com"}`}
                  className="mt-2 inline-block break-all font-mono text-xl sm:text-2xl font-bold text-[#FF7800] underline decoration-[#FF7800]/40 underline-offset-8 transition-colors hover:text-[#FFD21C] hover:decoration-[#FFD21C]"
                >
                  {contact.email || "alazfrc@gmail.com"}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-left-reveal blur-reveal mt-8">
              <p className="mb-3 font-mono text-xs text-[#666666]">
                OFFICIAL DIGITAL CHANNELS
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {media.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative z-10 flex flex-col justify-between border border-[#1A1A1A] bg-[#050505] p-3.5 transition-all duration-200 hover:border-[#FF7800] hover:bg-[#101010] cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-mono text-xs text-[#666666]">
                      <span>{social.platform}</span>
                      <span
                        aria-hidden="true"
                        className="text-[#E8E8E8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FFD21C]"
                      >
                        ↗
                      </span>
                    </div>
                    <span className="mt-1.5 truncate font-mono text-xs text-[#888888]">
                      {social.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Department Application Form */}
          <div className="contact-right-reveal blur-reveal lg:col-span-6">
            <Card className="border border-[#1A1A1A] bg-[#050505] shadow-2xl rounded-none p-6 sm:p-7">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-xl font-bold text-[#E8E8E8] tracking-tight">
                  Team Application Form
                </CardTitle>
                <CardDescription className="text-sm text-[#666666]">
                  Select your department of interest and reach out to join Team ALAZ.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="app-name" className="text-xs font-mono uppercase text-[#E8E8E8]/80">
                      Full Name
                    </Label>
                    <Input
                      id="app-name"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-[#1A1A1A] bg-[#0A0A0A] text-[#E8E8E8] placeholder:text-[#444] rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="app-email" className="text-xs font-mono uppercase text-[#E8E8E8]/80">
                      Email Address
                    </Label>
                    <Input
                      id="app-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-[#1A1A1A] bg-[#0A0A0A] text-[#E8E8E8] placeholder:text-[#444] rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="app-department" className="text-xs font-mono uppercase text-[#E8E8E8]/80">
                      Department of Interest
                    </Label>
                    <Select value={department} onValueChange={setDepartment} required>
                      <SelectTrigger
                        id="app-department"
                        className="border-[#1A1A1A] bg-[#0A0A0A] text-[#E8E8E8] rounded-none focus:ring-1 focus:ring-[#FF7800]"
                      >
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent className="border-[#1A1A1A] bg-[#0A0A0A] text-[#E8E8E8] rounded-none">
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem
                            key={dept}
                            value={dept}
                            className="rounded-none focus:bg-[#FF7800] focus:text-black cursor-pointer"
                          >
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="app-message" className="text-xs font-mono uppercase text-[#E8E8E8]/80">
                      Message / Experience
                    </Label>
                    <Textarea
                      id="app-message"
                      rows={4}
                      placeholder="Tell us about yourself and why you'd like to join..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="border-[#1A1A1A] bg-[#0A0A0A] text-[#E8E8E8] placeholder:text-[#444] rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full min-h-[48px] rounded-none bg-[#FF7800] text-black font-mono font-semibold hover:bg-[#FFD21C] transition-colors"
                  >
                    Submit Application via Email →
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;

import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#FF7800] focus:text-black focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:rounded-none focus:outline-2 focus:outline-offset-2 focus:outline-[#FFD21C]"
      >
        Skip to main content
      </a>
      <SmoothScroll>
        <Navbar />
        <main id="main-content" className="min-h-[100dvh] pt-16">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}

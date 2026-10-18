import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://teamalaz.com"),
  title: {
    default: "Team ALAZ | FIRST Robotics Competition",
    template: "%s | Team ALAZ",
  },
  description:
    "Team ALAZ is a FIRST Robotics Competition team from Izmir uniting science, engineering, and teamwork to develop the technologies of tomorrow.",
  keywords: [
    "Team ALAZ",
    "ALAZ FRC",
    "FIRST Robotics Competition",
    "Izmir FRC",
    "Robotics Turkey",
    "STEM Education",
  ],
  authors: [{ name: "Team ALAZ" }],
  creator: "Team ALAZ",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Team ALAZ",
    title: "Team ALAZ | FIRST Robotics Competition",
    description:
      "Engineering the Future. Building Beyond Limits. FIRST Robotics Competition Team from Izmir, Turkiye.",
    images: [
      {
        url: "/medias/logo-full.jpg",
        width: 1200,
        height: 630,
        alt: "Team ALAZ Phoenix Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Team ALAZ | FIRST Robotics Competition",
    description:
      "Engineering the Future. Building Beyond Limits. FIRST Robotics Competition Team from Izmir, Turkiye.",
    images: ["/medias/logo-full.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/medias/logo.jpg",
    apple: "/medias/logo.jpg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Team ALAZ",
  alternateName: "ALAZ FRC",
  description:
    "FIRST Robotics Competition Team based in Izmir, Turkiye.",
  email: "alazfrc@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Izmir",
    addressCountry: "TR",
  },
  sameAs: [
    "https://www.instagram.com/teamalazfrc/",
    "https://x.com/frcteamalaz?s=11",
    "https://www.tiktok.com/@teamalazfrc2",
    "https://www.youtube.com/@TeamALAZFRC",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="bg-[#000000] text-[#E8E8E8] font-sans antialiased selection:bg-[#FF7800] selection:text-black overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

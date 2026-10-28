import type { Metadata, Viewport } from "next";

export const SITE_URL = "https://www.alazfrc.org";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  title: {
    default: "Team ALAZ #12368 | FIRST Robotics Competition",
    template: "%s | Team ALAZ #12368",
  },
  description:
    "Team ALAZ #12368 is an award-winning FIRST Robotics Competition team from Izmir, Turkiye, engineering high-performance autonomous systems and advancing STEM education.",
  keywords: [
    "Team ALAZ",
    "ALAZ 12368",
    "FIRST Robotics Competition",
    "FRC Turkey",
    "Izmir Robotics",
    "STEM Education Turkey",
    "High School Robotics",
    "Autonomous Robotics",
    "alazfrc.org",
  ],
  authors: [{ name: "Team ALAZ", url: SITE_URL }],
  creator: "Team ALAZ #12368",
  publisher: "Team ALAZ",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Team ALAZ #12368",
    title: "Team ALAZ #12368 | FIRST Robotics Competition",
    description:
      "Engineering the Future. Building Beyond Limits. Award-winning FIRST Robotics Competition team from Izmir, Turkiye.",
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
    site: "@frcteamalaz",
    creator: "@frcteamalaz",
    title: "Team ALAZ #12368 | FIRST Robotics Competition",
    description:
      "Engineering the Future. Building Beyond Limits. FIRST Robotics Competition team from Izmir, Turkiye.",
    images: ["/medias/logo-full.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/medias/logo.jpg",
    apple: "/medias/logo.jpg",
  },
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "SportsTeam"],
      "@id": `${SITE_URL}/#organization`,
      name: "Team ALAZ",
      alternateName: "ALAZ #12368",
      url: SITE_URL,
      logo: `${SITE_URL}/medias/logo-full.jpg`,
      image: `${SITE_URL}/medias/logo-full.jpg`,
      description:
        "Team ALAZ #12368 is a FIRST Robotics Competition (FRC) team based in Izmir, Turkiye, uniting science, engineering, and youth innovation.",
      email: "alazfrc@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Izmir",
        addressCountry: "TR",
      },
      sameAs: [
        "https://www.instagram.com/teamalazfrc/",
        "https://x.com/frcteamalaz",
        "https://www.tiktok.com/@teamalazfrc2",
        "https://www.youtube.com/@TeamALAZFRC",
        "https://github.com/cotanjant/teamalazfrc",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Team ALAZ #12368 | FIRST Robotics Competition",
      description: "Official web platform and engineering portfolio of Team ALAZ #12368.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-US",
    },
  ],
};

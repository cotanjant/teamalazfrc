import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: SITE_URL,
          "x-default": SITE_URL,
        },
      },
    },
  ];
}

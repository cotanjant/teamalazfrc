import { describe, it, expect } from "vitest";
import robots from "../robots";
import sitemap from "../sitemap";
import { metadata, jsonLd, SITE_URL } from "../seo-config";

describe("Technical SEO & Next.js Metadata Architecture Suite", () => {
  describe("robots.ts specifications", () => {
    it("should produce compliant robots directives with AI search allowances and admin restrictions", () => {
      const robotsConfig = robots();
      expect(robotsConfig).toBeDefined();
      expect(robotsConfig.sitemap).toBe(`${SITE_URL}/sitemap.xml`);

      const rules = Array.isArray(robotsConfig.rules)
        ? robotsConfig.rules
        : [robotsConfig.rules];

      // Verify disallow blocks private admin and api routes
      const generalRule = rules.find((r) => r.userAgent === "*" || (Array.isArray(r.userAgent) && r.userAgent.includes("*")));
      expect(generalRule).toBeDefined();
      expect(generalRule?.disallow).toEqual(expect.arrayContaining(["/admin", "/api/"]));

      // Verify AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are explicitly managed
      const aiRule = rules.find((r) => {
        if (Array.isArray(r.userAgent)) {
          return r.userAgent.includes("GPTBot") && r.userAgent.includes("ClaudeBot");
        }
        return false;
      });
      expect(aiRule).toBeDefined();
      expect(aiRule?.allow).toBe("/");
      expect(aiRule?.disallow).toEqual(expect.arrayContaining(["/admin", "/api/"]));
    });
  });

  describe("sitemap.ts specifications", () => {
    it("should generate a valid XML sitemap descriptor with fresh lastModified and weekly frequency", () => {
      const sitemapEntries = sitemap();
      expect(Array.isArray(sitemapEntries)).toBe(true);
      expect(sitemapEntries.length).toBeGreaterThan(0);

      const rootEntry = sitemapEntries.find((entry) => entry.url === SITE_URL);
      expect(rootEntry).toBeDefined();
      expect(rootEntry?.priority).toBe(1.0);
      expect(rootEntry?.changeFrequency).toBe("weekly");
      expect(rootEntry?.lastModified).toBeInstanceOf(Date);
    });
  });

  describe("seo-config metadata and OpenGraph specifications", () => {
    it("should enforce English locale, self-referencing canonical URL, and valid metadataBase with https://www.alazfrc.org", () => {
      expect(metadata.metadataBase?.toString()).toBe("https://www.alazfrc.org/");
      
      // Self-referencing canonical check
      expect(metadata.alternates).toBeDefined();
      expect(metadata.alternates?.canonical).toBe("https://www.alazfrc.org");

      // OpenGraph locale must match <html lang="en"> international FRC requirement
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.locale).toBe("en_US");
      expect(metadata.openGraph?.siteName).toBe("Team ALAZ #12368");
    });

    it("should provide rich JSON-LD schema with clean sameAs URLs and organization/website graphs", () => {
      expect(jsonLd).toBeDefined();
      expect(jsonLd["@context"]).toBe("https://schema.org");

      const graph = (jsonLd as any)["@graph"];
      expect(Array.isArray(graph)).toBe(true);

      const orgSchema = graph.find((item: any) => 
        Array.isArray(item["@type"])
          ? item["@type"].includes("EducationalOrganization") && item["@type"].includes("SportsTeam")
          : item["@type"] === "EducationalOrganization"
      );
      expect(orgSchema).toBeDefined();
      expect(orgSchema.name).toBe("Team ALAZ");
      expect(orgSchema.email).toBe("alazfrc@gmail.com");

      // Verify no tracking query parameters in social media URLs
      orgSchema.sameAs.forEach((url: string) => {
        expect(url).not.toContain("?s=11");
        expect(url).not.toContain("?ref=");
      });

      const websiteSchema = graph.find((item: any) => item["@type"] === "WebSite");
      expect(websiteSchema).toBeDefined();
      expect(websiteSchema.url).toBe("https://www.alazfrc.org");
      expect(websiteSchema.inLanguage).toBe("en-US");
    });
  });
});

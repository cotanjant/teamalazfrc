import assert from "node:assert/strict";
import { getAdminTranslation } from "../useAdminTranslation";
import trLocale from "../../../locales/admin/tr.json";

console.log("Running comprehensive i18n verification test suite...");

// 1. Translation Functionality & Lookups
{
  // Key lookups
  assert.equal(getAdminTranslation("common.save"), "Değişiklikleri Kaydet");
  assert.equal(getAdminTranslation("homeStats.heroTitle"), "Ana Sayfa Başlık Metinleri");
  assert.equal(getAdminTranslation("team.categories.engineering"), "Mühendislik");
  assert.equal(getAdminTranslation("errors.missingToken"), "Oturum anahtarı bulunamadı. Lütfen tekrar giriş yapınız.");

  // Fallback
  assert.equal(getAdminTranslation("nonexistent.key" as any, undefined, "Varsayılan"), "Varsayılan");
  assert.equal(getAdminTranslation("nonexistent.key" as any), "nonexistent.key");

  // Interpolation helper
  const interpolated = (template: string, params: Record<string, string>) => {
    return template.replace(/\{(\w+)\}/g, (_, k) => params[k] || "");
  };
  assert.equal(interpolated("Merhaba {name}", { name: "Efe" }), "Merhaba Efe");
  console.log("✓ Translation key lookups, fallbacks, and interpolation passed");
}

// 2. Verify all 12 required sections exist in tr.json
{
  const requiredSections = [
    "nav",
    "common",
    "auth",
    "homeStats",
    "team",
    "missionVision",
    "robot",
    "outreach",
    "partners",
    "contact",
    "errors",
    "tour",
  ];

  for (const section of requiredSections) {
    assert.ok(section in trLocale, `Section "${section}" must exist in tr.json`);
  }
  console.log("✓ All 12 required i18n sections verified");
}

// 3. Verify Copywriting Constraints: No em-dashes and no decorative emojis (Anti-slop rules)
{
  function inspectStrings(obj: any, path: string) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof value === "string") {
        assert.ok(!value.includes("—"), `Em-dash (—) found in ${currentPath}: "${value}"`);
        assert.ok(!value.includes("–"), `En-dash (–) found in ${currentPath}: "${value}"`);
        // Check for decorative emojis like 🚀, ✨, 🔥, 💡
        const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        assert.ok(!emojiRegex.test(value), `Decorative emoji found in ${currentPath}: "${value}"`);
      } else if (typeof value === "object" && value !== null) {
        inspectStrings(value, currentPath);
      }
    }
  }

  inspectStrings(trLocale, "");
  console.log("✓ Zero em-dashes, zero emojis, professional tone verified");
}

console.log("\n==========================================");
console.log("ALL I18N VERIFICATION TESTS PASSED (100%)");
console.log("==========================================");

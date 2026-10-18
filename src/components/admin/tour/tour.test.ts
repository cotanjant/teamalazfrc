import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { TOUR_CONFIG, TOUR_STEPS, TOUR_STORAGE_KEY } from "./tourConfig";

console.log("=== RUNNING ALAZ ADMIN TOUR TEST SUITE ===");

// 1. Verify 7 Steps
assert.strictEqual(TOUR_STEPS.length, 7, "Tour must contain exactly 7 steps");
console.log("PASS: Tour contains exactly 7 steps");

// 2. Verify Step Targets & Copy Rules
const expectedTargets = [
  undefined, // Step 1: Centered modal (no element)
  "#admin-sidebar",
  "#admin-active-section",
  "#admin-data-table",
  "#admin-dirty-badge",
  "#admin-save-button",
  "#admin-tour-restart-button",
];

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

TOUR_STEPS.forEach((step, idx) => {
  const expectedTarget = expectedTargets[idx];
  assert.strictEqual(
    step.element,
    expectedTarget,
    `Step ${idx + 1} target mismatch: expected ${expectedTarget}, got ${step.element}`
  );

  assert.ok(step.popover, `Step ${idx + 1} must have a popover definition`);
  const title = step.popover?.title || "";
  const desc = step.popover?.description || "";

  assert.ok(title.length > 0, `Step ${idx + 1} must have a non-empty title`);
  assert.ok(desc.length > 0, `Step ${idx + 1} must have a non-empty description`);

  // Em dash (—) and en dash (–) check (anti-slop rule R-02)
  assert.ok(
    !title.includes("—") && !title.includes("–"),
    `Step ${idx + 1} title contains prohibited em-dash or en-dash: "${title}"`
  );
  assert.ok(
    !desc.includes("—") && !desc.includes("–"),
    `Step ${idx + 1} description contains prohibited em-dash or en-dash: "${desc}"`
  );

  // Emoji check (anti-slop rule R-04)
  assert.ok(
    !emojiRegex.test(title),
    `Step ${idx + 1} title contains prohibited emoji: "${title}"`
  );
  assert.ok(
    !emojiRegex.test(desc),
    `Step ${idx + 1} description contains prohibited emoji: "${desc}"`
  );
});
console.log("PASS: All 7 steps have compliant targets, non-empty titles and descriptions without em-dashes or emojis");

// 3. Verify Tour Config & Keyboard Accessibility
assert.strictEqual(TOUR_CONFIG.allowKeyboardControl, true, "Keyboard control must be enabled");
assert.strictEqual(TOUR_CONFIG.skipMissingElement, true, "Missing elements must be skipped silently");
assert.strictEqual(TOUR_CONFIG.allowClose, true, "Allow close must be enabled");
assert.strictEqual(TOUR_CONFIG.popoverClass, "alaz-tour-popover", "Custom popover class must be alaz-tour-popover");
assert.strictEqual(TOUR_CONFIG.nextBtnText, "Ileri", "Next button text must be Turkish 'Ileri'");
assert.strictEqual(TOUR_CONFIG.prevBtnText, "Geri", "Previous button text must be Turkish 'Geri'");
assert.strictEqual(TOUR_CONFIG.doneBtnText, "Tamamla", "Done button text must be Turkish 'Tamamla'");
assert.strictEqual(TOUR_CONFIG.closeBtnLabel, "Rehberi Kapat", "Close button text must be Turkish 'Rehberi Kapat'");
assert.strictEqual(TOUR_STORAGE_KEY, "alaz_admin_tour_completed", "Storage key must be alaz_admin_tour_completed");
console.log("PASS: Tour config options, Turkish labels and keyboard accessibility verified");

// 4. Verify Target IDs exist in actual source code
const cwd = process.cwd();
const sidebarSrc = fs.readFileSync(path.join(cwd, "src/components/admin/shell/AdminSidebar.tsx"), "utf8");
const pageSrc = fs.readFileSync(path.join(cwd, "src/app/admin/page.tsx"), "utf8");
const headerSrc = fs.readFileSync(path.join(cwd, "src/components/admin/shell/AdminHeader.tsx"), "utf8");
const layoutSrc = fs.readFileSync(path.join(cwd, "src/app/admin/layout.tsx"), "utf8");

assert.ok(sidebarSrc.includes('id="admin-sidebar"'), "AdminSidebar.tsx must contain id='admin-sidebar'");
assert.ok(pageSrc.includes('id="admin-active-section"'), "page.tsx must contain id='admin-active-section'");
assert.ok(pageSrc.includes('id="admin-data-table"'), "page.tsx must contain id='admin-data-table'");
assert.ok(pageSrc.includes('id="admin-dirty-badge"'), "page.tsx must contain id='admin-dirty-badge'");
assert.ok(pageSrc.includes('id="admin-save-button"'), "page.tsx must contain id='admin-save-button'");
assert.ok(headerSrc.includes('id="admin-tour-restart-button"'), "AdminHeader.tsx must contain id='admin-tour-restart-button'");
assert.ok(headerSrc.includes("startAdminTour"), "AdminHeader.tsx must wire startAdminTour");
assert.ok(layoutSrc.includes("<AdminTour />"), "layout.tsx must render <AdminTour />");
console.log("PASS: All DOM element IDs and integration points verified in component sources");

console.log("=== ALL TEST SUITE ASSERTIONS PASSED (100%) ===");

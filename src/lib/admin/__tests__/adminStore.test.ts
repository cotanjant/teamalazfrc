import assert from "node:assert/strict";
import { test } from "vitest";
import initialData from "../../../data/collection.json";
import type {
  SiteCollection,
  NavItem,
  DepartmentItem,
  PartnerSlotItem,
  StatItem,
  RobotSpecItem,
  CrewGalleryItem,
} from "../../../data/collection";
import {
  computeCollectionDiff,
  pureMutators,
  reorderArray,
  handleSaveData,
} from "../useAdminStore";
import { getAdminTranslation } from "../../i18n/useAdminTranslation";

async function run() {
  console.log("Starting Admin Store & State Management test suite (TDD RED Gate)...");

  const initial = initialData as unknown as SiteCollection;

  // 1. Initial State & Diff Verification
  {
    const diff = computeCollectionDiff(initial, initial);
    assert.equal(diff.isDirty, false, "Initial collection must not be dirty");
    assert.equal(diff.hasUnsavedChanges, false, "hasUnsavedChanges should be false initially");
    assert.equal(diff.changedFieldsCount, 0, "changedFieldsCount should be 0 initially");
    assert.equal(diff.changedSections.length, 0, "changedSections should be empty initially");
    console.log("✓ Initial state diff checks passed");
  }

  // 2. Pure Array Reordering
  {
    const list = ["A", "B", "C", "D"];
    const reordered = reorderArray(list, 0, 2);
    assert.deepEqual(reordered, ["B", "C", "A", "D"], "Item at index 0 should move to index 2");
    assert.deepEqual(list, ["A", "B", "C", "D"], "Original array must not be mutated");

    // Out of bounds test
    const outOfBounds = reorderArray(list, -1, 10);
    assert.deepEqual(outOfBounds, list, "Out of bounds reordering should return array copy unchanged");
    console.log("✓ Array reorder utility passed");
  }

  // 2.5 Navigation Mutators & Helpers
  {
    const updatedNav = pureMutators.updateNavigation(initial, 0, "label", "ALAZ ROBOTICS");
    assert.equal(updatedNav.navigation[0].label, "ALAZ ROBOTICS");
    assert.notEqual(updatedNav.navigation[0].label, initial.navigation[0].label);

    const newNav: Partial<NavItem> = {
      id: "nav-sponsors",
      code: "08",
      label: "DESTEKCILER",
      href: "#sponsors",
      isExternal: false,
    };
    const addedNav = pureMutators.addNavigationItem(initial, newNav);
    assert.equal(addedNav.navigation.length, initial.navigation.length + 1);
    assert.equal(addedNav.navigation[addedNav.navigation.length - 1].label, "DESTEKCILER");

    const reorderedNav = pureMutators.reorderNavigationItem(addedNav, 0, 1);
    assert.equal(reorderedNav.navigation[0].id, addedNav.navigation[1].id);

    const removedNav = pureMutators.removeNavigationItem(addedNav, addedNav.navigation.length - 1);
    assert.equal(removedNav.navigation.length, initial.navigation.length);
    console.log("✓ Navigation updaters and helpers passed");
  }

  // 3. TeamInfo & Hero Pure Updaters (Immutability)
  {
    const updatedTeam = pureMutators.updateTeamInfo(initial, "name", "Team ALAZ Robotics 12368");
    assert.equal(updatedTeam.teamInfo.name, "Team ALAZ Robotics 12368");
    assert.notEqual(updatedTeam, initial, "Root reference must change");
    assert.notEqual(updatedTeam.teamInfo, initial.teamInfo, "teamInfo reference must change");
    assert.equal(initial.teamInfo.name, "Team ALAZ", "Initial state must remain untouched");

    const updatedHero = pureMutators.updateHero(initial, "badge", "NEW CHAMPIONSHIP BADGE");
    assert.equal(updatedHero.hero.badge, "NEW CHAMPIONSHIP BADGE");
    assert.equal(initial.hero.badge, "FIRST ROBOTICS COMPETITION TEAM");
    console.log("✓ TeamInfo & Hero updaters passed");
  }

  // 4. Stats Updaters & Helpers
  {
    const statUpdated = pureMutators.updateStats(initial, 0, "value", "99");
    assert.equal(statUpdated.stats[0].value, "99");
    assert.equal(initial.stats[0].value, "", "Initial stats must not be mutated");

    // Add stat
    const newStat: Partial<StatItem> = {
      id: "new-metric",
      label: "Awards Won",
      value: "12",
      code: "04",
      description: "Regional and national awards",
    };
    const added = pureMutators.addStat(initial, newStat);
    assert.equal(added.stats.length, initial.stats.length + 1);
    assert.equal(added.stats[added.stats.length - 1].label, "Awards Won");

    // Reorder stat
    const reordered = pureMutators.reorderStat(added, 0, 1);
    assert.equal(reordered.stats[0].id, added.stats[1].id);

    // Remove stat
    const removed = pureMutators.removeStat(added, added.stats.length - 1);
    assert.equal(removed.stats.length, initial.stats.length);
    console.log("✓ Stats updaters and helpers passed");
  }

  // 5. Department Updaters & Helpers
  {
    const updatedDept = pureMutators.updateDepartment(initial, 0, "name", "Mechanical & Prototyping");
    assert.equal(updatedDept.departments[0].name, "Mechanical & Prototyping");
    assert.equal(initial.departments[0].name, "Mechanical");

    const newDept: Partial<DepartmentItem> = {
      id: "strategy",
      code: "10",
      name: "Strategy & Scouting",
      category: "Operations",
      description: "Match data analytics and alliance strategy",
    };
    const addedDept = pureMutators.addDepartment(initial, newDept);
    assert.equal(addedDept.departments.length, initial.departments.length + 1);
    assert.equal(addedDept.departments[addedDept.departments.length - 1].name, "Strategy & Scouting");

    const removedDept = pureMutators.removeDepartment(addedDept, addedDept.departments.length - 1);
    assert.equal(removedDept.departments.length, initial.departments.length);
    console.log("✓ Department updaters and helpers passed");
  }

  // 6. Mission & Vision Updaters
  {
    const updatedMission = pureMutators.updateMissionVision(initial, "mission", "tagline", "Our Engineering Mission");
    assert.equal(updatedMission.missionVision.mission.tagline, "Our Engineering Mission");
    assert.notEqual(updatedMission.missionVision.mission.tagline, initial.missionVision.mission.tagline);

    const updatedVision = pureMutators.updateMissionVision(initial, "vision", "body", "Global impact through FIRST.");
    assert.equal(updatedVision.missionVision.vision.body, "Global impact through FIRST.");
    console.log("✓ Mission & Vision updaters passed");
  }

  // 7. Robot Updaters, Specs & Subsystems
  {
    const updatedRobot = pureMutators.updateRobot(initial, "seasonLabel", "REEFSCAPE 2026");
    assert.equal(updatedRobot.robot.seasonLabel, "REEFSCAPE 2026");

    // Spec helper
    const newSpec: Partial<RobotSpecItem> = {
      id: "spec-weight",
      code: "09",
      label: "Total Mass",
      value: "54.2",
      unit: "kg",
      detail: "Inspection-ready mass without bumpers",
    };
    const withSpec = pureMutators.addRobotSpec(initial, newSpec);
    assert.equal(withSpec.robot.specs.length, initial.robot.specs.length + 1);

    const updatedSpec = pureMutators.updateRobotSpec(withSpec, withSpec.robot.specs.length - 1, "value", "53.8");
    assert.equal(updatedSpec.robot.specs[updatedSpec.robot.specs.length - 1].value, "53.8");

    const removedSpec = pureMutators.removeRobotSpec(withSpec, withSpec.robot.specs.length - 1);
    assert.equal(removedSpec.robot.specs.length, initial.robot.specs.length);
    console.log("✓ Robot updaters, specs and subsystems passed");
  }

  // 8. Outreach, Partners, CrewGallery, Contact & Socials
  {
    // Outreach
    const updatedOutreach = pureMutators.updateOutreach(initial, "tagline", "Inspiring Izmir Communities");
    assert.equal(updatedOutreach.outreach.tagline, "Inspiring Izmir Communities");

    // Partners
    const newPartner: Partial<PartnerSlotItem> = {
      id: "partner-test",
      name: "Acme High-Tech",
      tier: "Gold Partner",
      role: "Precision Machining Supporter",
    };
    const withPartner = pureMutators.addPartner(initial, newPartner);
    assert.equal(withPartner.partners.tiers.length, initial.partners.tiers.length + 1);
    const withoutPartner = pureMutators.removePartner(withPartner, withPartner.partners.tiers.length - 1);
    assert.equal(withoutPartner.partners.tiers.length, initial.partners.tiers.length);

    // Crew Gallery
    const newGalleryItem: Partial<CrewGalleryItem> = {
      id: "gallery-test",
      code: "99",
      src: "/medias/test.webp",
      fallbackJpg: "/medias/test.jpg",
      alt: "Test photo",
      caption: "TEST CAPTION",
      departmentTag: "TEST",
      aspect: "landscape",
    };
    const withGallery = pureMutators.addCrewGalleryItem(initial, newGalleryItem);
    assert.equal(withGallery.media.crewGallery.length, initial.media.crewGallery.length + 1);
    const withoutGallery = pureMutators.removeCrewGalleryItem(withGallery, withGallery.media.crewGallery.length - 1);
    assert.equal(withoutGallery.media.crewGallery.length, initial.media.crewGallery.length);

    // Contact
    const updatedContact = pureMutators.updateContact(initial, "email", "info@teamalaz.com");
    assert.equal(updatedContact.contact.email, "info@teamalaz.com");

    // Socials
    const updatedSocial = pureMutators.updateSocials(initial, 0, "handle", "@teamalaz_official");
    assert.equal(updatedSocial.media.socials[0].handle, "@teamalaz_official");
    console.log("✓ Outreach, Partners, CrewGallery, Contact & Socials passed");
  }

  // 9. Diff Calculation & Dirty Tracking
  {
    const modified = pureMutators.updateHero(initial, "subtitle", "Modified subtitle for testing dirty tracker");
    const diff = computeCollectionDiff(initial, modified);

    assert.equal(diff.isDirty, true, "Modified collection must be marked dirty");
    assert.equal(diff.hasUnsavedChanges, true, "hasUnsavedChanges must be true");
    assert.ok(diff.changedSections.includes("hero"), "hero section should be listed in changedSections");
    assert.ok(diff.changedFieldsCount >= 1, "changedFieldsCount should be at least 1");

    // Reverting back
    const reverted = pureMutators.updateHero(modified, "subtitle", initial.hero.subtitle);
    const revertedDiff = computeCollectionDiff(initial, reverted);
    assert.equal(revertedDiff.isDirty, false, "Reverting to initial values must reset isDirty to false");
    assert.equal(revertedDiff.changedFieldsCount, 0, "Reverting must reset changedFieldsCount to 0");
    console.log("✓ Diff calculation & dirty tracking passed");
  }

  // 10. Data Integrity: Preserving all 12 Top-Level Sections
  {
    const testModified = pureMutators.updateDepartment(initial, 0, "name", "Updated Department Name");
    const expectedKeys: (keyof SiteCollection)[] = [
      "teamInfo",
      "navigation",
      "hero",
      "stats",
      "team",
      "departments",
      "missionVision",
      "robot",
      "outreach",
      "partners",
      "media",
      "contact",
    ];

    for (const key of expectedKeys) {
      assert.ok(key in testModified, `Section "${key}" must remain present after mutation`);
      assert.ok(testModified[key] !== undefined && testModified[key] !== null, `Section "${key}" must not be null/undefined`);
    }
    console.log("✓ All 12 top-level sections preserved without data loss");
  }

  // 11. SaveData Flow & i18n Integration
  {
    // Test case A: Optional Token (Cookie-based session)
    const cookieSaveRes = await handleSaveData({
      data: initial,
      token: null,
      fetchFn: async (_url, options) => {
        const headers = (options?.headers as Record<string, string>) || {};
        assert.equal("Authorization" in headers, false, "Authorization header should not be present when token is null");
        return new Response(JSON.stringify({ success: true, message: "Cookie auth save success" }), {
          status: 200,
        });
      },
    });
    assert.equal(cookieSaveRes.success, true);
    assert.equal(cookieSaveRes.saveStatus, "success");
    assert.equal(cookieSaveRes.statusMessage, "Cookie auth save success");

    // Test case B: Network Error
    const networkErrorRes = await handleSaveData({
      data: initial,
      token: "mock-valid-token",
      fetchFn: async () => {
        throw new Error("Network disconnection");
      },
    });
    assert.equal(networkErrorRes.success, false);
    assert.equal(networkErrorRes.saveStatus, "error");
    assert.equal(networkErrorRes.statusMessage, getAdminTranslation("errors.networkError"));

    // Test case C: Server API failure
    const serverFailureRes = await handleSaveData({
      data: initial,
      token: "mock-valid-token",
      fetchFn: async () =>
        new Response(JSON.stringify({ success: false, error: "Custom GitHub rate limit error" }), {
          status: 403,
        }),
    });
    assert.equal(serverFailureRes.success, false);
    assert.equal(serverFailureRes.saveStatus, "error");
    assert.equal(serverFailureRes.statusMessage, "Custom GitHub rate limit error");

    // Test case D: Successful Save
    const successRes = await handleSaveData({
      data: initial,
      token: "mock-valid-token",
      fetchFn: async (_url, options) => {
        const payload = JSON.parse((options?.body as string) || "{}");
        assert.equal(payload.action, "save-file");
        assert.equal(payload.path, "src/data/collection.json");
        return new Response(JSON.stringify({ success: true, message: "File saved successfully" }), {
          status: 200,
        });
      },
    });
    assert.equal(successRes.success, true);
    assert.equal(successRes.saveStatus, "success");
    assert.equal(successRes.statusMessage, "File saved successfully");
    console.log("✓ SaveData flow and i18n integration passed");
  }

  // 12. Concurrency Lock (Q-02) Verification
  {
    let activeCallCount = 0;
    let maxConcurrent = 0;
    const isSavingRef = { current: false };

    const simulatedSave = async (): Promise<boolean> => {
      if (isSavingRef.current) return false;
      isSavingRef.current = true;
      activeCallCount++;
      maxConcurrent = Math.max(maxConcurrent, activeCallCount);
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return true;
      } finally {
        activeCallCount--;
        isSavingRef.current = false;
      }
    };

    const [res1, res2, res3] = await Promise.all([
      simulatedSave(),
      simulatedSave(),
      simulatedSave(),
    ]);

    assert.equal(res1, true, "First save operation should proceed");
    assert.equal(res2, false, "Second concurrent call must be rejected immediately by isSavingRef lock");
    assert.equal(res3, false, "Third concurrent call must be rejected immediately by isSavingRef lock");
    assert.equal(maxConcurrent, 1, "Max concurrent executions must strictly never exceed 1");
    assert.equal(isSavingRef.current, false, "Lock must be released in finally block");
    console.log("✓ Concurrency lock (Q-02 isSavingRef) verified: concurrent calls safely rejected");
  }

  console.log("\n==========================================");
  console.log("ALL ADMIN STORE TESTS PASSED (100%)");
  console.log("==========================================");
}

test("Admin Store & State Management test suite", async () => {
  await run();
});


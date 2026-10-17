"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect, createContext, useContext } from "react";
import initialCollectionData from "@/data/collection.json";
import { getAdminSessionToken } from "@/components/admin/AdminGuard";
import { getAdminTranslation } from "@/lib/i18n/useAdminTranslation";
import type {
  SiteCollection,
  NavItem,
  TeamInfo,
  HeroContent,
  StatItem,
  TeamSectionContent,
  DepartmentItem,
  MissionVisionBlock,
  RobotContent,
  RobotSpecItem,
  RobotSubsystemItem,
  OutreachContent,
  OutreachProjectItem,
  OutreachStat,
  PartnersContent,
  PartnerSlotItem,
  MediaContent,
  CrewGalleryItem,
  ContactContent,
  SocialAccount,
} from "@/data/collection";

/**
 * Pure array reordering utility.
 * Returns a new array with the element at fromIndex moved to toIndex without mutating the source.
 */
export function reorderArray<T>(list: readonly T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex < 0 ||
    fromIndex >= list.length ||
    toIndex < 0 ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return [...list];
  }
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export interface CollectionDiffResult {
  isDirty: boolean;
  hasUnsavedChanges: boolean;
  changedSections: (keyof SiteCollection)[];
  changedFieldsCount: number;
  details: Partial<Record<keyof SiteCollection, { baseline: unknown; current: unknown }>>;
}

/**
 * Computes deep differences between baseline and current SiteCollection.
 */
export function computeCollectionDiff(
  baseline: SiteCollection,
  current: SiteCollection
): CollectionDiffResult {
  const sections = Object.keys(baseline) as (keyof SiteCollection)[];
  const changedSections: (keyof SiteCollection)[] = [];
  const details: Partial<Record<keyof SiteCollection, { baseline: unknown; current: unknown }>> = {};
  let changedFieldsCount = 0;

  for (const section of sections) {
    const baseVal = baseline[section];
    const currVal = current[section];

    const baseJson = JSON.stringify(baseVal);
    const currJson = JSON.stringify(currVal);

    if (baseJson !== currJson) {
      changedSections.push(section);
      details[section] = { baseline: baseVal, current: currVal };

      // Calculate granular sub-field changes if both are objects
      if (
        typeof baseVal === "object" &&
        baseVal !== null &&
        typeof currVal === "object" &&
        currVal !== null
      ) {
        if (Array.isArray(baseVal) && Array.isArray(currVal)) {
          // Array length delta or item level changes
          const maxLen = Math.max(baseVal.length, currVal.length);
          let arrayDiffs = 0;
          for (let i = 0; i < maxLen; i++) {
            if (JSON.stringify(baseVal[i]) !== JSON.stringify(currVal[i])) {
              arrayDiffs++;
            }
          }
          changedFieldsCount += Math.max(1, arrayDiffs);
        } else {
          // Object key comparison
          const bObj = baseVal as unknown as Record<string, unknown>;
          const cObj = currVal as unknown as Record<string, unknown>;
          const allKeys = new Set([
            ...Object.keys(bObj),
            ...Object.keys(cObj),
          ]);
          let objDiffs = 0;
          for (const k of allKeys) {
            const b = bObj[k];
            const c = cObj[k];
            if (JSON.stringify(b) !== JSON.stringify(c)) {
              objDiffs++;
            }
          }
          changedFieldsCount += Math.max(1, objDiffs);
        }
      } else {
        changedFieldsCount++;
      }
    }
  }

  const isDirty = changedSections.length > 0;

  return {
    isDirty,
    hasUnsavedChanges: isDirty,
    changedSections,
    changedFieldsCount,
    details,
  };
}

/**
 * Pure, immutable updater and manipulation functions for SiteCollection.
 */
export const pureMutators = {
  // 0. Navigation Links
  updateNavigation<K extends keyof NavItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: NavItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.navigation.length) return state;
    const copy = [...state.navigation];
    copy[index] = { ...copy[index], [field]: value };
    return { ...state, navigation: copy };
  },

  addNavigationItem(state: SiteCollection, item?: Partial<NavItem>): SiteCollection {
    const nextCode = String(state.navigation.length + 1).padStart(2, "0");
    const newItem: NavItem = {
      id: item?.id || `nav-${Date.now()}`,
      label: item?.label || "Yeni Bağlantı",
      href: item?.href || "/#",
      code: item?.code || nextCode,
      isExternal: item?.isExternal || false,
    };
    return { ...state, navigation: [...state.navigation, newItem] };
  },

  removeNavigationItem(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.navigation.length) return state;
    return {
      ...state,
      navigation: state.navigation.filter((_, i) => i !== index),
    };
  },

  reorderNavigationItem(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      navigation: reorderArray(state.navigation, fromIndex, toIndex),
    };
  },

  // 1. Team Info
  updateTeamInfo<K extends keyof TeamInfo>(
    state: SiteCollection,
    field: K,
    value: TeamInfo[K]
  ): SiteCollection {
    return {
      ...state,
      teamInfo: {
        ...state.teamInfo,
        [field]: value,
      },
    };
  },

  // 2. Hero Content
  updateHero<K extends keyof HeroContent>(
    state: SiteCollection,
    field: K,
    value: HeroContent[K]
  ): SiteCollection {
    return {
      ...state,
      hero: {
        ...state.hero,
        [field]: value,
      },
    };
  },

  // 3. Stats Bar
  updateStats<K extends keyof StatItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: StatItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.stats.length) return state;
    const copy = [...state.stats];
    copy[index] = { ...copy[index], [field]: value };
    return { ...state, stats: copy };
  },

  addStat(state: SiteCollection, stat?: Partial<StatItem>): SiteCollection {
    const nextCode = String(state.stats.length + 1).padStart(2, "0");
    const newStat: StatItem = {
      id: stat?.id || `stat-${Date.now()}`,
      value: stat?.value ?? "",
      suffix: stat?.suffix ?? "",
      label: stat?.label || "New Metric",
      code: stat?.code || nextCode,
      description: stat?.description || "Description of new metric",
      isPlaceholder: stat?.isPlaceholder,
    };
    return { ...state, stats: [...state.stats, newStat] };
  },

  removeStat(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.stats.length) return state;
    return {
      ...state,
      stats: state.stats.filter((_, i) => i !== index),
    };
  },

  reorderStat(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      stats: reorderArray(state.stats, fromIndex, toIndex),
    };
  },

  // 4. Team Section Header
  updateTeamSection<K extends keyof TeamSectionContent>(
    state: SiteCollection,
    field: K,
    value: TeamSectionContent[K]
  ): SiteCollection {
    return {
      ...state,
      team: {
        ...state.team,
        [field]: value,
      },
    };
  },

  // 5. Departments
  updateDepartment<K extends keyof DepartmentItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: DepartmentItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.departments.length) return state;
    const copy = [...state.departments];
    copy[index] = { ...copy[index], [field]: value };
    return { ...state, departments: copy };
  },

  addDepartment(state: SiteCollection, department?: Partial<DepartmentItem>): SiteCollection {
    const nextCode = String(state.departments.length + 1).padStart(2, "0");
    const newDept: DepartmentItem = {
      id: department?.id || `dept-${Date.now()}`,
      code: department?.code || nextCode,
      name: department?.name || "New Department",
      description: department?.description || "Department responsibilities narrative",
      category: department?.category || "Engineering",
    };
    return { ...state, departments: [...state.departments, newDept] };
  },

  removeDepartment(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.departments.length) return state;
    return {
      ...state,
      departments: state.departments.filter((_, i) => i !== index),
    };
  },

  reorderDepartment(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      departments: reorderArray(state.departments, fromIndex, toIndex),
    };
  },

  // 6. Mission & Vision
  updateMissionVision(
    state: SiteCollection,
    block: "mission" | "vision",
    field: keyof MissionVisionBlock,
    value: string
  ): SiteCollection {
    return {
      ...state,
      missionVision: {
        ...state.missionVision,
        [block]: {
          ...state.missionVision[block],
          [field]: value,
        },
      },
    };
  },

  updateMission(state: SiteCollection, field: "tagline" | "body" | keyof MissionVisionBlock, value: string): SiteCollection {
    return pureMutators.updateMissionVision(state, "mission", field, value);
  },

  updateVision(state: SiteCollection, field: "tagline" | "body" | keyof MissionVisionBlock, value: string): SiteCollection {
    return pureMutators.updateMissionVision(state, "vision", field, value);
  },

  // 7. Robot Content
  updateRobot<K extends keyof RobotContent>(
    state: SiteCollection,
    field: K,
    value: RobotContent[K]
  ): SiteCollection {
    return {
      ...state,
      robot: {
        ...state.robot,
        [field]: value,
      },
    };
  },

  updateRobotSpec<K extends keyof RobotSpecItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: RobotSpecItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.robot.specs.length) return state;
    const copy = [...state.robot.specs];
    copy[index] = { ...copy[index], [field]: value };
    return {
      ...state,
      robot: {
        ...state.robot,
        specs: copy,
      },
    };
  },

  addRobotSpec(state: SiteCollection, spec?: Partial<RobotSpecItem>): SiteCollection {
    const nextCode = String(state.robot.specs.length + 1).padStart(2, "0");
    const newSpec: RobotSpecItem = {
      id: spec?.id || `spec-${Date.now()}`,
      code: spec?.code || nextCode,
      label: spec?.label || "New Specification",
      value: spec?.value || "TBD",
      unit: spec?.unit ?? "",
      detail: spec?.detail || "Specification detail note",
      placeholder: spec?.placeholder,
    };
    return {
      ...state,
      robot: {
        ...state.robot,
        specs: [...state.robot.specs, newSpec],
      },
    };
  },

  removeRobotSpec(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.robot.specs.length) return state;
    return {
      ...state,
      robot: {
        ...state.robot,
        specs: state.robot.specs.filter((_, i) => i !== index),
      },
    };
  },

  reorderRobotSpec(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      robot: {
        ...state.robot,
        specs: reorderArray(state.robot.specs, fromIndex, toIndex),
      },
    };
  },

  updateRobotSubsystem<K extends keyof RobotSubsystemItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: RobotSubsystemItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.robot.subsystems.length) return state;
    const copy = [...state.robot.subsystems];
    copy[index] = { ...copy[index], [field]: value };
    return {
      ...state,
      robot: {
        ...state.robot,
        subsystems: copy,
      },
    };
  },

  addRobotSubsystem(state: SiteCollection, subsystem?: Partial<RobotSubsystemItem>): SiteCollection {
    const nextCode = String(state.robot.subsystems.length + 1).padStart(2, "0");
    const newSub: RobotSubsystemItem = {
      id: subsystem?.id || `sub-${Date.now()}`,
      code: subsystem?.code || nextCode,
      name: subsystem?.name || "New Subsystem",
      summary: subsystem?.summary || "Mechanism overview narrative",
      highlights: subsystem?.highlights || ["High precision mechanism", "Optimized gear ratio"],
      placeholder: subsystem?.placeholder,
    };
    return {
      ...state,
      robot: {
        ...state.robot,
        subsystems: [...state.robot.subsystems, newSub],
      },
    };
  },

  removeRobotSubsystem(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.robot.subsystems.length) return state;
    return {
      ...state,
      robot: {
        ...state.robot,
        subsystems: state.robot.subsystems.filter((_, i) => i !== index),
      },
    };
  },

  reorderRobotSubsystem(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      robot: {
        ...state.robot,
        subsystems: reorderArray(state.robot.subsystems, fromIndex, toIndex),
      },
    };
  },

  // 8. Outreach Content
  updateOutreach<K extends keyof OutreachContent>(
    state: SiteCollection,
    field: K,
    value: OutreachContent[K]
  ): SiteCollection {
    return {
      ...state,
      outreach: {
        ...state.outreach,
        [field]: value,
      },
    };
  },

  updateOutreachProject<K extends keyof OutreachProjectItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: OutreachProjectItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.outreach.projects.length) return state;
    const copy = [...state.outreach.projects];
    copy[index] = { ...copy[index], [field]: value };
    return {
      ...state,
      outreach: {
        ...state.outreach,
        projects: copy,
      },
    };
  },

  addOutreachProject(state: SiteCollection, project?: Partial<OutreachProjectItem>): SiteCollection {
    const nextCode = String(state.outreach.projects.length + 1).padStart(2, "0");
    const newProj: OutreachProjectItem = {
      id: project?.id || `proj-${Date.now()}`,
      code: project?.code || nextCode,
      title: project?.title || "New Community Project",
      category: project?.category || "STEM Education",
      status: project?.status || "Active",
      summary: project?.summary || "Project mission statement and scope",
      impactMetric: project?.impactMetric || "100+ Students",
      location: project?.location || "İzmir, TR",
      placeholder: project?.placeholder,
    };
    return {
      ...state,
      outreach: {
        ...state.outreach,
        projects: [...state.outreach.projects, newProj],
      },
    };
  },

  removeOutreachProject(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.outreach.projects.length) return state;
    return {
      ...state,
      outreach: {
        ...state.outreach,
        projects: state.outreach.projects.filter((_, i) => i !== index),
      },
    };
  },

  reorderOutreachProject(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      outreach: {
        ...state.outreach,
        projects: reorderArray(state.outreach.projects, fromIndex, toIndex),
      },
    };
  },

  updateOutreachStat<K extends keyof OutreachStat>(
    state: SiteCollection,
    index: number,
    field: K,
    value: OutreachStat[K]
  ): SiteCollection {
    if (index < 0 || index >= state.outreach.stats.length) return state;
    const copy = [...state.outreach.stats];
    copy[index] = { ...copy[index], [field]: value };
    return {
      ...state,
      outreach: {
        ...state.outreach,
        stats: copy,
      },
    };
  },

  addOutreachStat(state: SiteCollection, stat?: Partial<OutreachStat>): SiteCollection {
    const nextCode = String(state.outreach.stats.length + 1).padStart(2, "0");
    const newStat: OutreachStat = {
      label: stat?.label || "Metric Label",
      value: stat?.value || "0",
      code: stat?.code || nextCode,
      placeholder: stat?.placeholder,
    };
    return {
      ...state,
      outreach: {
        ...state.outreach,
        stats: [...state.outreach.stats, newStat],
      },
    };
  },

  removeOutreachStat(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.outreach.stats.length) return state;
    return {
      ...state,
      outreach: {
        ...state.outreach,
        stats: state.outreach.stats.filter((_, i) => i !== index),
      },
    };
  },

  // 9. Partners
  updatePartners<K extends keyof PartnersContent>(
    state: SiteCollection,
    field: K,
    value: PartnersContent[K]
  ): SiteCollection {
    return {
      ...state,
      partners: {
        ...state.partners,
        [field]: value,
      },
    };
  },

  updatePartner<K extends keyof PartnerSlotItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: PartnerSlotItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.partners.tiers.length) return state;
    const copy = [...state.partners.tiers];
    copy[index] = { ...copy[index], [field]: value };
    return {
      ...state,
      partners: {
        ...state.partners,
        tiers: copy,
      },
    };
  },

  addPartner(state: SiteCollection, partner?: Partial<PartnerSlotItem>): SiteCollection {
    const nextCode = String(state.partners.tiers.length + 1).padStart(2, "0");
    const newPartner: PartnerSlotItem = {
      id: partner?.id || `partner-${Date.now()}`,
      code: partner?.code || nextCode,
      name: partner?.name || "New Partner / Institution",
      tier: partner?.tier ?? "",
      role: partner?.role || "Technical Equipment & Mentorship Supporter",
      href: partner?.href ?? "",
      placeholder: partner?.placeholder,
    };
    return {
      ...state,
      partners: {
        ...state.partners,
        tiers: [...state.partners.tiers, newPartner],
      },
    };
  },

  removePartner(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.partners.tiers.length) return state;
    return {
      ...state,
      partners: {
        ...state.partners,
        tiers: state.partners.tiers.filter((_, i) => i !== index),
      },
    };
  },

  reorderPartner(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      partners: {
        ...state.partners,
        tiers: reorderArray(state.partners.tiers, fromIndex, toIndex),
      },
    };
  },

  // 10. Crew Gallery & Media
  updateMedia<K extends keyof MediaContent>(
    state: SiteCollection,
    field: K,
    value: MediaContent[K]
  ): SiteCollection {
    return {
      ...state,
      media: {
        ...state.media,
        [field]: value,
      },
    };
  },

  updateCrewGallery<K extends keyof CrewGalleryItem>(
    state: SiteCollection,
    index: number,
    field: K,
    value: CrewGalleryItem[K]
  ): SiteCollection {
    if (index < 0 || index >= state.media.crewGallery.length) return state;
    const copy = [...state.media.crewGallery];
    copy[index] = { ...copy[index], [field]: value };
    return {
      ...state,
      media: {
        ...state.media,
        crewGallery: copy,
      },
    };
  },

  addCrewGalleryItem(state: SiteCollection, item?: Partial<CrewGalleryItem>): SiteCollection {
    const nextCode = String(state.media.crewGallery.length + 1).padStart(2, "0");
    const newItem: CrewGalleryItem = {
      id: item?.id || `gallery-${Date.now()}`,
      code: item?.code || nextCode,
      src: item?.src || "/medias/placeholder.webp",
      fallbackJpg: item?.fallbackJpg || "/medias/placeholder.jpg",
      alt: item?.alt || "Team ALAZ activity moment",
      caption: item?.caption || "ALAZ MOMENT",
      departmentTag: item?.departmentTag || "TEAM",
      aspect: item?.aspect || "landscape",
    };
    return {
      ...state,
      media: {
        ...state.media,
        crewGallery: [...state.media.crewGallery, newItem],
      },
    };
  },

  removeCrewGalleryItem(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.media.crewGallery.length) return state;
    return {
      ...state,
      media: {
        ...state.media,
        crewGallery: state.media.crewGallery.filter((_, i) => i !== index),
      },
    };
  },

  reorderCrewGalleryItem(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      media: {
        ...state.media,
        crewGallery: reorderArray(state.media.crewGallery, fromIndex, toIndex),
      },
    };
  },

  // 11. Contact
  updateContact<K extends keyof ContactContent>(
    state: SiteCollection,
    field: K,
    value: ContactContent[K]
  ): SiteCollection {
    return {
      ...state,
      contact: {
        ...state.contact,
        [field]: value,
      },
    };
  },

  // 12. Socials
  updateSocials<K extends keyof SocialAccount>(
    state: SiteCollection,
    index: number,
    field: K,
    value: SocialAccount[K]
  ): SiteCollection {
    if (index < 0 || index >= state.media.socials.length) return state;
    const copy = [...state.media.socials];
    copy[index] = { ...copy[index], [field]: value };
    return {
      ...state,
      media: {
        ...state.media,
        socials: copy,
      },
    };
  },

  updateSocial<K extends keyof SocialAccount>(
    state: SiteCollection,
    index: number,
    field: K,
    value: SocialAccount[K]
  ): SiteCollection {
    return pureMutators.updateSocials(state, index, field, value);
  },

  addSocial(state: SiteCollection, account?: Partial<SocialAccount>): SiteCollection {
    const nextCode = String(state.media.socials.length + 1).padStart(2, "0");
    const newSocial: SocialAccount = {
      id: account?.id || `social-${Date.now()}`,
      platform: account?.platform || "Instagram",
      handle: account?.handle || "@teamalazfrc",
      href: account?.href || "https://instagram.com/teamalazfrc",
      code: account?.code || nextCode,
    };
    return {
      ...state,
      media: {
        ...state.media,
        socials: [...state.media.socials, newSocial],
      },
    };
  },

  removeSocial(state: SiteCollection, index: number): SiteCollection {
    if (index < 0 || index >= state.media.socials.length) return state;
    return {
      ...state,
      media: {
        ...state.media,
        socials: state.media.socials.filter((_, i) => i !== index),
      },
    };
  },

  reorderSocial(state: SiteCollection, fromIndex: number, toIndex: number): SiteCollection {
    return {
      ...state,
      media: {
        ...state.media,
        socials: reorderArray(state.media.socials, fromIndex, toIndex),
      },
    };
  },
};

export interface SaveDataOptions {
  data: SiteCollection;
  token?: string | null;
  fetchFn?: typeof fetch;
  targetPath?: string;
}

export interface SaveDataResult {
  success: boolean;
  saveStatus: "idle" | "success" | "error";
  statusMessage: string;
  resData?: Record<string, unknown>;
}

/**
 * Handles communication with /api/github-proxy with auth check, json packaging and translation.
 * Token is optional since authentication is primarily handled via httpOnly cookie on same-origin.
 */
export async function handleSaveData(options: SaveDataOptions): Promise<SaveDataResult> {
  const { data, token, fetchFn = fetch, targetPath = "src/data/collection.json" } = options;

  try {
    const jsonString = JSON.stringify(data, null, 2) + "\n";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetchFn("/api/github-proxy", {
      method: "POST",
      headers,
      credentials: "same-origin",
      body: JSON.stringify({
        action: "save-file",
        path: targetPath,
        content: jsonString,
        encoding: "utf-8",
        message: "Update site collection via Admin CMS",
      }),
    });

    const resData = (await res.json()) as Record<string, unknown>;

    if (!res.ok || !resData.success) {
      return {
        success: false,
        saveStatus: "error",
        statusMessage:
          (resData.error as string) ||
          getAdminTranslation("errors.saveFailed", undefined, "Failed to commit changes."),
        resData,
      };
    }

    return {
      success: true,
      saveStatus: "success",
      statusMessage:
        (resData.message as string) ||
        getAdminTranslation("common.saved", undefined, "Changes published successfully!"),
      resData,
    };
  } catch {
    return {
      success: false,
      saveStatus: "error",
      statusMessage: getAdminTranslation(
        "errors.networkError",
        undefined,
        "Network failure while contacting save API."
      ),
    };
  }
}

/**
 * Internal React Hook for Admin Dashboard state management.
 */
export function useAdminStoreInternal(initial?: SiteCollection) {
  const defaultCollection = useMemo(
    () => initial || (initialCollectionData as unknown as SiteCollection),
    [initial]
  );

  const [data, setData] = useState<SiteCollection>(defaultCollection);
  const [baseline, setBaseline] = useState<SiteCollection>(defaultCollection);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Compute diff and dirty state
  const diff = useMemo(() => computeCollectionDiff(baseline, data), [baseline, data]);

  // Reset function
  const resetChanges = useCallback(() => {
    setData(baseline);
  }, [baseline]);

  // Save function
  const saveData = useCallback(async (): Promise<boolean> => {
    const token = getAdminSessionToken();

    setIsSaving(true);
    setSaveStatus("idle");
    setStatusMessage("");

    const result = await handleSaveData({ data, token });

    setIsSaving(false);
    setSaveStatus(result.saveStatus);
    setStatusMessage(result.statusMessage);

    if (result.success) {
      setBaseline(data); // update baseline to current saved state
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
        setStatusMessage("");
      }, 5000);
      return true;
    }

    return false;
  }, [data]);

  // Wrapped updater functions
  const updateNavigation = useCallback(
    <K extends keyof NavItem>(index: number, field: K, value: NavItem[K]) => {
      setData((prev) => pureMutators.updateNavigation(prev, index, field, value));
    },
    []
  );

  const addNavigationItem = useCallback((item?: Partial<NavItem>) => {
    setData((prev) => pureMutators.addNavigationItem(prev, item));
  }, []);

  const removeNavigationItem = useCallback((index: number) => {
    setData((prev) => pureMutators.removeNavigationItem(prev, index));
  }, []);

  const reorderNavigationItem = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderNavigationItem(prev, fromIndex, toIndex));
  }, []);

  const updateTeamInfo = useCallback(
    <K extends keyof TeamInfo>(field: K, value: TeamInfo[K]) => {
      setData((prev) => pureMutators.updateTeamInfo(prev, field, value));
    },
    []
  );

  const updateHero = useCallback(
    <K extends keyof HeroContent>(field: K, value: HeroContent[K]) => {
      setData((prev) => pureMutators.updateHero(prev, field, value));
    },
    []
  );

  const updateStats = useCallback(
    <K extends keyof StatItem>(index: number, field: K, value: StatItem[K]) => {
      setData((prev) => pureMutators.updateStats(prev, index, field, value));
    },
    []
  );

  const addStat = useCallback((stat?: Partial<StatItem>) => {
    setData((prev) => pureMutators.addStat(prev, stat));
  }, []);

  const removeStat = useCallback((index: number) => {
    setData((prev) => pureMutators.removeStat(prev, index));
  }, []);

  const reorderStat = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderStat(prev, fromIndex, toIndex));
  }, []);

  const updateTeamSection = useCallback(
    <K extends keyof TeamSectionContent>(field: K, value: TeamSectionContent[K]) => {
      setData((prev) => pureMutators.updateTeamSection(prev, field, value));
    },
    []
  );

  const updateDepartment = useCallback(
    <K extends keyof DepartmentItem>(index: number, field: K, value: DepartmentItem[K]) => {
      setData((prev) => pureMutators.updateDepartment(prev, index, field, value));
    },
    []
  );

  const addDepartment = useCallback((department?: Partial<DepartmentItem>) => {
    setData((prev) => pureMutators.addDepartment(prev, department));
  }, []);

  const removeDepartment = useCallback((index: number) => {
    setData((prev) => pureMutators.removeDepartment(prev, index));
  }, []);

  const reorderDepartment = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderDepartment(prev, fromIndex, toIndex));
  }, []);

  const updateMissionVision = useCallback(
    (block: "mission" | "vision", field: keyof MissionVisionBlock, value: string) => {
      setData((prev) => pureMutators.updateMissionVision(prev, block, field, value));
    },
    []
  );

  const updateMission = useCallback((field: "tagline" | "body" | keyof MissionVisionBlock, value: string) => {
    setData((prev) => pureMutators.updateMission(prev, field, value));
  }, []);

  const updateVision = useCallback((field: "tagline" | "body" | keyof MissionVisionBlock, value: string) => {
    setData((prev) => pureMutators.updateVision(prev, field, value));
  }, []);

  const updateRobot = useCallback(
    <K extends keyof RobotContent>(field: K, value: RobotContent[K]) => {
      setData((prev) => pureMutators.updateRobot(prev, field, value));
    },
    []
  );

  const updateRobotSpec = useCallback(
    <K extends keyof RobotSpecItem>(index: number, field: K, value: RobotSpecItem[K]) => {
      setData((prev) => pureMutators.updateRobotSpec(prev, index, field, value));
    },
    []
  );

  const addRobotSpec = useCallback((spec?: Partial<RobotSpecItem>) => {
    setData((prev) => pureMutators.addRobotSpec(prev, spec));
  }, []);

  const removeRobotSpec = useCallback((index: number) => {
    setData((prev) => pureMutators.removeRobotSpec(prev, index));
  }, []);

  const reorderRobotSpec = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderRobotSpec(prev, fromIndex, toIndex));
  }, []);

  const updateRobotSubsystem = useCallback(
    <K extends keyof RobotSubsystemItem>(index: number, field: K, value: RobotSubsystemItem[K]) => {
      setData((prev) => pureMutators.updateRobotSubsystem(prev, index, field, value));
    },
    []
  );

  const addRobotSubsystem = useCallback((subsystem?: Partial<RobotSubsystemItem>) => {
    setData((prev) => pureMutators.addRobotSubsystem(prev, subsystem));
  }, []);

  const removeRobotSubsystem = useCallback((index: number) => {
    setData((prev) => pureMutators.removeRobotSubsystem(prev, index));
  }, []);

  const reorderRobotSubsystem = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderRobotSubsystem(prev, fromIndex, toIndex));
  }, []);

  const updateOutreach = useCallback(
    <K extends keyof OutreachContent>(field: K, value: OutreachContent[K]) => {
      setData((prev) => pureMutators.updateOutreach(prev, field, value));
    },
    []
  );

  const updateOutreachProject = useCallback(
    <K extends keyof OutreachProjectItem>(index: number, field: K, value: OutreachProjectItem[K]) => {
      setData((prev) => pureMutators.updateOutreachProject(prev, index, field, value));
    },
    []
  );

  const addOutreachProject = useCallback((project?: Partial<OutreachProjectItem>) => {
    setData((prev) => pureMutators.addOutreachProject(prev, project));
  }, []);

  const removeOutreachProject = useCallback((index: number) => {
    setData((prev) => pureMutators.removeOutreachProject(prev, index));
  }, []);

  const reorderOutreachProject = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderOutreachProject(prev, fromIndex, toIndex));
  }, []);

  const updateOutreachStat = useCallback(
    <K extends keyof OutreachStat>(index: number, field: K, value: OutreachStat[K]) => {
      setData((prev) => pureMutators.updateOutreachStat(prev, index, field, value));
    },
    []
  );

  const addOutreachStat = useCallback((stat?: Partial<OutreachStat>) => {
    setData((prev) => pureMutators.addOutreachStat(prev, stat));
  }, []);

  const removeOutreachStat = useCallback((index: number) => {
    setData((prev) => pureMutators.removeOutreachStat(prev, index));
  }, []);

  const updatePartners = useCallback(
    <K extends keyof PartnersContent>(field: K, value: PartnersContent[K]) => {
      setData((prev) => pureMutators.updatePartners(prev, field, value));
    },
    []
  );

  const updatePartner = useCallback(
    <K extends keyof PartnerSlotItem>(index: number, field: K, value: PartnerSlotItem[K]) => {
      setData((prev) => pureMutators.updatePartner(prev, index, field, value));
    },
    []
  );

  const addPartner = useCallback((partner?: Partial<PartnerSlotItem>) => {
    setData((prev) => pureMutators.addPartner(prev, partner));
  }, []);

  const removePartner = useCallback((index: number) => {
    setData((prev) => pureMutators.removePartner(prev, index));
  }, []);

  const reorderPartner = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderPartner(prev, fromIndex, toIndex));
  }, []);

  const updateMedia = useCallback(
    <K extends keyof MediaContent>(field: K, value: MediaContent[K]) => {
      setData((prev) => pureMutators.updateMedia(prev, field, value));
    },
    []
  );

  const updateCrewGallery = useCallback(
    <K extends keyof CrewGalleryItem>(index: number, field: K, value: CrewGalleryItem[K]) => {
      setData((prev) => pureMutators.updateCrewGallery(prev, index, field, value));
    },
    []
  );

  const addCrewGalleryItem = useCallback((item?: Partial<CrewGalleryItem>) => {
    setData((prev) => pureMutators.addCrewGalleryItem(prev, item));
  }, []);

  const removeCrewGalleryItem = useCallback((index: number) => {
    setData((prev) => pureMutators.removeCrewGalleryItem(prev, index));
  }, []);

  const reorderCrewGalleryItem = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderCrewGalleryItem(prev, fromIndex, toIndex));
  }, []);

  const updateContact = useCallback(
    <K extends keyof ContactContent>(field: K, value: ContactContent[K]) => {
      setData((prev) => pureMutators.updateContact(prev, field, value));
    },
    []
  );

  const updateSocials = useCallback(
    <K extends keyof SocialAccount>(index: number, field: K, value: SocialAccount[K]) => {
      setData((prev) => pureMutators.updateSocials(prev, index, field, value));
    },
    []
  );

  const updateSocial = updateSocials;

  const addSocial = useCallback((account?: Partial<SocialAccount>) => {
    setData((prev) => pureMutators.addSocial(prev, account));
  }, []);

  const removeSocial = useCallback((index: number) => {
    setData((prev) => pureMutators.removeSocial(prev, index));
  }, []);

  const reorderSocial = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => pureMutators.reorderSocial(prev, fromIndex, toIndex));
  }, []);

  return {
    data,
    setData,
    baseline,
    setBaseline,
    isDirty: diff.isDirty,
    hasUnsavedChanges: diff.hasUnsavedChanges,
    changedFieldsCount: diff.changedFieldsCount,
    changedSections: diff.changedSections,
    isSaving,
    saveStatus,
    statusMessage,
    resetChanges,
    saveData,
    // Updaters
    updateNavigation,
    addNavigationItem,
    removeNavigationItem,
    reorderNavigationItem,
    updateTeamInfo,
    updateHero,
    updateStats,
    addStat,
    removeStat,
    reorderStat,
    updateTeamSection,
    updateDepartment,
    addDepartment,
    removeDepartment,
    reorderDepartment,
    updateMissionVision,
    updateMission,
    updateVision,
    updateRobot,
    updateRobotSpec,
    addRobotSpec,
    removeRobotSpec,
    reorderRobotSpec,
    updateRobotSubsystem,
    addRobotSubsystem,
    removeRobotSubsystem,
    reorderRobotSubsystem,
    updateOutreach,
    updateOutreachProject,
    addOutreachProject,
    removeOutreachProject,
    reorderOutreachProject,
    updateOutreachStat,
    addOutreachStat,
    removeOutreachStat,
    updatePartners,
    updatePartner,
    addPartner,
    removePartner,
    reorderPartner,
    updateMedia,
    updateCrewGallery,
    addCrewGalleryItem,
    removeCrewGalleryItem,
    reorderCrewGalleryItem,
    updateContact,
    updateSocial,
    updateSocials,
    addSocial,
    removeSocial,
    reorderSocial,
  };
}

export type AdminStoreContextType = ReturnType<typeof useAdminStoreInternal>;

export const AdminStoreContext = createContext<AdminStoreContextType | null>(null);

export interface AdminStoreProviderProps {
  children: React.ReactNode;
  initial?: SiteCollection;
}

/**
 * Single source of truth context provider for all Admin tabs and pages.
 */
export function AdminStoreProvider({ children, initial }: AdminStoreProviderProps) {
  const store = useAdminStoreInternal(initial);
  return React.createElement(AdminStoreContext.Provider, { value: store }, children);
}

/**
 * Consumes the shared AdminStoreContext.
 * Throws a clear error if invoked outside AdminStoreProvider.
 */
export function useAdminStore(_initial?: SiteCollection): AdminStoreContextType {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error("useAdminStore must be used within an AdminStoreProvider");
  }
  return context;
}

export default useAdminStore;

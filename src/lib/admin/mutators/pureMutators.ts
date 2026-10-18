import { reorderArray } from "../utils/arrayUtils";
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

/**
 * Creates pre-bound updater methods connected to the store's state setter.
 */
export function createAdminUpdaters(
  setData: (updater: (prev: SiteCollection) => SiteCollection) => void
) {
  const m = pureMutators;
  return {
    updateNavigation: <K extends keyof NavItem>(i: number, f: K, v: NavItem[K]) => setData((s) => m.updateNavigation(s, i, f, v)),
    addNavigationItem: (item?: Partial<NavItem>) => setData((s) => m.addNavigationItem(s, item)),
    removeNavigationItem: (i: number) => setData((s) => m.removeNavigationItem(s, i)),
    reorderNavigationItem: (from: number, to: number) => setData((s) => m.reorderNavigationItem(s, from, to)),

    updateTeamInfo: <K extends keyof TeamInfo>(f: K, v: TeamInfo[K]) => setData((s) => m.updateTeamInfo(s, f, v)),
    updateHero: <K extends keyof HeroContent>(f: K, v: HeroContent[K]) => setData((s) => m.updateHero(s, f, v)),

    updateStats: <K extends keyof StatItem>(i: number, f: K, v: StatItem[K]) => setData((s) => m.updateStats(s, i, f, v)),
    addStat: (stat?: Partial<StatItem>) => setData((s) => m.addStat(s, stat)),
    removeStat: (i: number) => setData((s) => m.removeStat(s, i)),
    reorderStat: (from: number, to: number) => setData((s) => m.reorderStat(s, from, to)),

    updateTeamSection: <K extends keyof TeamSectionContent>(f: K, v: TeamSectionContent[K]) => setData((s) => m.updateTeamSection(s, f, v)),

    updateDepartment: <K extends keyof DepartmentItem>(i: number, f: K, v: DepartmentItem[K]) => setData((s) => m.updateDepartment(s, i, f, v)),
    addDepartment: (d?: Partial<DepartmentItem>) => setData((s) => m.addDepartment(s, d)),
    removeDepartment: (i: number) => setData((s) => m.removeDepartment(s, i)),
    reorderDepartment: (from: number, to: number) => setData((s) => m.reorderDepartment(s, from, to)),

    updateMissionVision: (b: "mission" | "vision", f: keyof MissionVisionBlock, v: string) => setData((s) => m.updateMissionVision(s, b, f, v)),
    updateMission: (f: "tagline" | "body" | keyof MissionVisionBlock, v: string) => setData((s) => m.updateMission(s, f, v)),
    updateVision: (f: "tagline" | "body" | keyof MissionVisionBlock, v: string) => setData((s) => m.updateVision(s, f, v)),

    updateRobot: <K extends keyof RobotContent>(f: K, v: RobotContent[K]) => setData((s) => m.updateRobot(s, f, v)),
    updateRobotSpec: <K extends keyof RobotSpecItem>(i: number, f: K, v: RobotSpecItem[K]) => setData((s) => m.updateRobotSpec(s, i, f, v)),
    addRobotSpec: (spec?: Partial<RobotSpecItem>) => setData((s) => m.addRobotSpec(s, spec)),
    removeRobotSpec: (i: number) => setData((s) => m.removeRobotSpec(s, i)),
    reorderRobotSpec: (from: number, to: number) => setData((s) => m.reorderRobotSpec(s, from, to)),

    updateRobotSubsystem: <K extends keyof RobotSubsystemItem>(i: number, f: K, v: RobotSubsystemItem[K]) => setData((s) => m.updateRobotSubsystem(s, i, f, v)),
    addRobotSubsystem: (sub?: Partial<RobotSubsystemItem>) => setData((s) => m.addRobotSubsystem(s, sub)),
    removeRobotSubsystem: (i: number) => setData((s) => m.removeRobotSubsystem(s, i)),
    reorderRobotSubsystem: (from: number, to: number) => setData((s) => m.reorderRobotSubsystem(s, from, to)),

    updateOutreach: <K extends keyof OutreachContent>(f: K, v: OutreachContent[K]) => setData((s) => m.updateOutreach(s, f, v)),
    updateOutreachProject: <K extends keyof OutreachProjectItem>(i: number, f: K, v: OutreachProjectItem[K]) => setData((s) => m.updateOutreachProject(s, i, f, v)),
    addOutreachProject: (p?: Partial<OutreachProjectItem>) => setData((s) => m.addOutreachProject(s, p)),
    removeOutreachProject: (i: number) => setData((s) => m.removeOutreachProject(s, i)),
    reorderOutreachProject: (from: number, to: number) => setData((s) => m.reorderOutreachProject(s, from, to)),
    updateOutreachStat: <K extends keyof OutreachStat>(i: number, f: K, v: OutreachStat[K]) => setData((s) => m.updateOutreachStat(s, i, f, v)),
    addOutreachStat: (stat?: Partial<OutreachStat>) => setData((s) => m.addOutreachStat(s, stat)),
    removeOutreachStat: (i: number) => setData((s) => m.removeOutreachStat(s, i)),

    updatePartners: <K extends keyof PartnersContent>(f: K, v: PartnersContent[K]) => setData((s) => m.updatePartners(s, f, v)),
    updatePartner: <K extends keyof PartnerSlotItem>(i: number, f: K, v: PartnerSlotItem[K]) => setData((s) => m.updatePartner(s, i, f, v)),
    addPartner: (p?: Partial<PartnerSlotItem>) => setData((s) => m.addPartner(s, p)),
    removePartner: (i: number) => setData((s) => m.removePartner(s, i)),
    reorderPartner: (from: number, to: number) => setData((s) => m.reorderPartner(s, from, to)),

    updateMedia: <K extends keyof MediaContent>(f: K, v: MediaContent[K]) => setData((s) => m.updateMedia(s, f, v)),
    updateCrewGallery: <K extends keyof CrewGalleryItem>(i: number, f: K, v: CrewGalleryItem[K]) => setData((s) => m.updateCrewGallery(s, i, f, v)),
    addCrewGalleryItem: (item?: Partial<CrewGalleryItem>) => setData((s) => m.addCrewGalleryItem(s, item)),
    removeCrewGalleryItem: (i: number) => setData((s) => m.removeCrewGalleryItem(s, i)),
    reorderCrewGalleryItem: (from: number, to: number) => setData((s) => m.reorderCrewGalleryItem(s, from, to)),

    updateContact: <K extends keyof ContactContent>(f: K, v: ContactContent[K]) => setData((s) => m.updateContact(s, f, v)),

    updateSocials: <K extends keyof SocialAccount>(i: number, f: K, v: SocialAccount[K]) => setData((s) => m.updateSocials(s, i, f, v)),
    updateSocial: <K extends keyof SocialAccount>(i: number, f: K, v: SocialAccount[K]) => setData((s) => m.updateSocials(s, i, f, v)),
    addSocial: (acc?: Partial<SocialAccount>) => setData((s) => m.addSocial(s, acc)),
    removeSocial: (i: number) => setData((s) => m.removeSocial(s, i)),
    reorderSocial: (from: number, to: number) => setData((s) => m.reorderSocial(s, from, to)),
  };
}

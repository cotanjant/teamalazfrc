/**
 * Team ALAZ: Code-Driven Content Collection
 * Modeled after asmin-tumur-portfolio's collection.ts single source of truth.
 * All copy derived strictly and verbatim from website bilgileri.md.
 */

import collectionData from "./collection.json";

export interface TeamInfo {
  name: string;
  shortName: string;
  number: string;
  numericId: number;
  school: string;
  district: string;
  location: string;
  country: string;
  email: string;
  rookieYear: number;
  motto: string;
  logo: string;
  logoFallback: string;
  logoFull: string;
  logoFullFallback: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  code: string;
  isExternal?: boolean;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroContent {
  badge: string;
  headlineLines: string[];
  headlineFull: string;
  subtitle: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  media: string;
  mediaFallback: string;
  secondaryMedia: string;
  secondaryMediaFallback: string;
  mediaAlt: string;
  coordinates: string;
}

export interface StatItem {
  id: string;
  value: number | string;
  suffix: string;
  label: string;
  code: string;
  description: string;
  isPlaceholder?: boolean;
}

export interface TeamSectionContent {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  media: string;
  mediaFallback: string;
  fullMedia: string;
  fullMediaFallback: string;
  mediaAlt: string;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "Engineering" | "Operations";
}

export interface MissionVisionBlock {
  code: string;
  title: string;
  tagline: string;
  body: string;
}

export interface MissionVisionContent {
  id: string;
  signatureLogo: string;
  signatureLogoFallback: string;
  signatureFullLogo: string;
  signatureCaption: string;
  mission: MissionVisionBlock;
  vision: MissionVisionBlock;
}

export interface RobotSpecItem {
  id: string;
  code: string;
  label: string;
  value: string;
  unit?: string;
  detail: string;
  placeholder?: boolean;
}

export interface RobotSubsystemItem {
  id: string;
  code: string;
  name: string;
  summary: string;
  highlights: string[];
  placeholder?: boolean;
}

export interface RobotContent {
  id: string;
  code: string;
  title: string;
  tagline: string;
  precisionStatement: string;
  description: string;
  cta: CtaLink;
  seasonLabel: string;
  statusBadge: string;
  heroMedia: string;
  heroMediaFallback: string;
  items?: unknown[];
  specs: RobotSpecItem[];
  subsystems: RobotSubsystemItem[];
}

export interface OutreachStat {
  label: string;
  value: string;
  code: string;
  placeholder?: boolean;
}

export interface OutreachProjectItem {
  id: string;
  code: string;
  title: string;
  category: string;
  status: "Active" | "In Development" | "Upcoming";
  summary: string;
  impactMetric: string;
  location: string;
  placeholder?: boolean;
}

export interface OutreachContent {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  cta: CtaLink;
  stats: OutreachStat[];
  projects: OutreachProjectItem[];
}

export interface PartnerSlotItem {
  id: string;
  code: string;
  name: string;
  tier: "Founding Institution" | "Title Partner" | "Gold Partner" | "Silver Partner" | "In-Kind Supporter" | string;
  role: string;
  href?: string;
  placeholder?: boolean;
}

export interface PartnersContent {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  cta: CtaLink;
  sponsors?: unknown[];
  tiers: PartnerSlotItem[];
}

export interface CrewGalleryItem {
  id: string;
  code: string;
  src: string;
  fallbackJpg: string;
  alt: string;
  caption: string;
  departmentTag: string;
  aspect: "landscape" | "portrait" | "square";
}

export interface SocialAccount {
  id: string;
  platform: "Instagram" | "X" | "TikTok" | "YouTube";
  handle: string;
  href: string;
  code: string;
}

export interface MediaContent {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  crewGallery: CrewGalleryItem[];
  socials: SocialAccount[];
}

export interface ContactContent {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  email: string;
  locationLabel: string;
  schoolLabel: string;
  departmentOptions: string[];
}

export interface SiteCollection {
  teamInfo: TeamInfo;
  navigation: NavItem[];
  hero: HeroContent;
  stats: StatItem[];
  team: TeamSectionContent;
  departments: DepartmentItem[];
  missionVision: MissionVisionContent;
  robot: RobotContent;
  outreach: OutreachContent;
  partners: PartnersContent;
  media: MediaContent;
  contact: ContactContent;
}

export const siteCollection: SiteCollection = collectionData as unknown as SiteCollection;

export default siteCollection;

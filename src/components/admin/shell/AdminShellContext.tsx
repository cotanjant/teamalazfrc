"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface NavSectionItem {
  id: string;
  label: string;
  shortLabel: string;
  code: string;
  iconName: string;
  description: string;
}

export const ADMIN_SECTIONS: NavSectionItem[] = [
  {
    id: "home",
    label: "Genel & İstatistikler",
    shortLabel: "Genel",
    code: "01",
    iconName: "LayoutDashboard",
    description: "Ana sayfa başlıkları, temel metinler ve takım istatistikleri",
  },
  {
    id: "team",
    label: "Takım & Departmanlar",
    shortLabel: "Takım",
    code: "02",
    iconName: "Users",
    description: "Takım hikayesi, departman yapıları ve çalışma alanları",
  },
  {
    id: "mission",
    label: "Misyon & Vizyon",
    shortLabel: "Misyon",
    code: "03",
    iconName: "Compass",
    description: "ALAZ felsefesi, vizyon hedefleri ve kurumsal duruş",
  },
  {
    id: "robot",
    label: "Robotik Sistemler",
    shortLabel: "Robot",
    code: "04",
    iconName: "Cpu",
    description: "Robot teknik özellikleri, ağırlık, şasi ve alt mekanizmalar",
  },
  {
    id: "outreach",
    label: "Sosyal Sorumluluk",
    shortLabel: "Toplum",
    code: "05",
    iconName: "Globe",
    description: "STEM etkinlikleri, sosyal sorumluluk projeleri ve etki metrikleri",
  },
  {
    id: "partners",
    label: "Destekçiler & Sponsorlar",
    shortLabel: "Sponsor",
    code: "06",
    iconName: "Handshake",
    description: "Sponsorluk kademeleri, kurumsal destekçiler ve ortaklıklar",
  },
  {
    id: "contact",
    label: "İletişim",
    shortLabel: "İletişim",
    code: "07",
    iconName: "Mail",
    description: "Resmi iletişim kanalları, e-posta ve lokasyon bilgileri",
  },
];

interface AdminShellContextType {
  activeSection: string;
  setActiveSection: (id: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  systemMode: "local" | "github";
  setSystemMode: (mode: "local" | "github") => void;
  currentSectionInfo: NavSectionItem;
}

const AdminShellContext = createContext<AdminShellContextType | null>(null);

export function AdminShellProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<string>("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [systemMode, setSystemMode] = useState<"local" | "github">("github");

  // Load collapsed state preference from localStorage if available
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem("alaz_admin_sidebar_collapsed");
      if (savedCollapsed !== null) {
        setIsSidebarCollapsed(savedCollapsed === "true");
      }
    } catch {}
  }, []);

  // Listen to hash/URL changes
  useEffect(() => {
    const handleUrlSync = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ADMIN_SECTIONS.some((s) => s.id === tabParam)) {
        setActiveSectionState(tabParam);
      } else if (window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        if (ADMIN_SECTIONS.some((s) => s.id === hash)) {
          setActiveSectionState(hash);
        }
      }
    };

    handleUrlSync();
    window.addEventListener("popstate", handleUrlSync);
    return () => window.removeEventListener("popstate", handleUrlSync);
  }, []);

  const setActiveSection = (id: string) => {
    setActiveSectionState(id);
    setIsMobileSidebarOpen(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", id);
      window.history.replaceState(null, "", url.toString());
    } catch {}
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("alaz_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const currentSectionInfo =
    ADMIN_SECTIONS.find((s) => s.id === activeSection) || ADMIN_SECTIONS[0];

  return (
    <AdminShellContext.Provider
      value={{
        activeSection,
        setActiveSection,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        systemMode,
        setSystemMode,
        currentSectionInfo,
      }}
    >
      {children}
    </AdminShellContext.Provider>
  );
}

export function useAdminShell() {
  const context = useContext(AdminShellContext);
  if (!context) {
    throw new Error("useAdminShell must be used within an AdminShellProvider");
  }
  return context;
}

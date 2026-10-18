"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Compass,
  Cpu,
  Globe,
  Handshake,
  Camera,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  X,
} from "lucide-react";
import { ADMIN_SECTIONS, useAdminShell } from "./AdminShellContext";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Compass,
  Cpu,
  Globe,
  Handshake,
  Camera,
  Mail,
};

export function AdminSidebar() {
  const {
    activeSection,
    setActiveSection,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useAdminShell();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (fixed on small screens) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#000000] border-r border-[#1A1A1A] flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobil Yonetim Menusu"
      >
        <SidebarContent
          isCollapsed={false}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          showMobileClose
        />
      </aside>

      {/* Desktop Sidebar (visible on md+) */}
      <aside
        id="admin-sidebar"
        className={`hidden md:flex flex-col h-full bg-[#000000] border-r border-[#1A1A1A] transition-[width] duration-300 ease-in-out shrink-0 select-none ${
          isSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
        aria-label="Yonetim Sidebar"
      >
        <SidebarContent
          isCollapsed={isSidebarCollapsed}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onToggleCollapse={toggleSidebar}
        />
      </aside>
    </>
  );
}

interface SidebarContentProps {
  isCollapsed: boolean;
  activeSection: string;
  onSelectSection: (id: string) => void;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  showMobileClose?: boolean;
}

function SidebarContent({
  isCollapsed,
  activeSection,
  onSelectSection,
  onToggleCollapse,
  onCloseMobile,
  showMobileClose = false,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Top Controls Area */}
      <div className={`h-12 border-b border-[#1A1A1A] px-3 flex items-center shrink-0 ${showMobileClose ? "justify-between" : "justify-end"}`}>
        {onToggleCollapse && !showMobileClose && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-none text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            aria-label={isCollapsed ? "Menuyu Genislet" : "Menuyu Daralt"}
            title={isCollapsed ? "Menuyu Genislet" : "Menuyu Daralt"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        {showMobileClose && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-none text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors ml-auto"
            aria-label="Menuyu Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 scrollbar-thin">
        {!isCollapsed && (
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#666666]">
            Yonetim Bolumleri
          </div>
        )}

        <nav className="space-y-1" aria-label="Bolum Secimi">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = ICON_MAP[section.iconName] || LayoutDashboard;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                title={isCollapsed ? `${section.label} (${section.code})` : undefined}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all duration-150 relative ${
                  isActive
                    ? "bg-[#1A1A1A] text-white border-l-2 border-[#FF7800] shadow-[inset_0_0_12px_rgba(255,120,0,0.08)]"
                    : "text-[#A0A0A0] hover:text-[#E8E8E8] hover:bg-[#141414]"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-[#FF7800]" : "text-[#777777] group-hover:text-[#A0A0A0]"
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">{section.label}</span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? "text-[#FF7800] bg-[#FF7800]/10"
                          : "text-[#555555] group-hover:text-[#777777]"
                      }`}
                    >
                      {section.code}
                    </span>
                  </div>
                )}

                {/* Collapsed Active Indicator Pill */}
                {isCollapsed && isActive && (
                  <span className="absolute right-1 w-1 h-3 bg-[#FF7800] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area with Site Link & Collapse Button */}
      <div className="border-t border-[#1A1A1A] p-2 space-y-1 shrink-0 bg-[#000000]">
        {/* Visit Live Website */}
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          title={isCollapsed ? "Siteyi Gor ↗" : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono text-[#A0A0A0] hover:text-white hover:bg-[#141414] transition-colors ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-[#FF7800]" />
          {!isCollapsed && (
            <span className="flex-1 truncate uppercase tracking-wider text-[11px]">
              Siteyi Gor
            </span>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Menuyu Genislet" : "Menuyu Daralt"}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono text-[#777777] hover:text-[#E8E8E8] hover:bg-[#141414] transition-colors ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            aria-label={isCollapsed ? "Sidebari Genislet" : "Sidebari Daralt"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="text-[11px] uppercase tracking-wider">Daralt</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

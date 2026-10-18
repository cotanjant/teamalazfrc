"use client";

import React from "react";
import {
  Menu,
  Compass,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAdminShell } from "./AdminShellContext";
import { useAdminAuth } from "../AdminGuard";
import { startAdminTour } from "../tour";

export function AdminHeader() {
  const {
    currentSectionInfo,
    setIsMobileSidebarOpen,
  } = useAdminShell();

  const { logout } = useAdminAuth();

  return (
    <header className="h-16 border-b border-[#1A1A1A] bg-[#000000]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left Side: Mobile Menu Button + Breadcrumbs & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 -ml-2 rounded-none text-[#A0A0A0] hover:text-white hover:bg-[#141414] md:hidden transition-colors"
          aria-label="Menuyu Ac"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#777777] uppercase tracking-wider">
            <span className="hover:text-[#A0A0A0] transition-colors">ALAZ</span>
            <ChevronRight className="w-3 h-3 text-[#555555]" />
            <span className="hover:text-[#A0A0A0] transition-colors">Yonetim</span>
            <ChevronRight className="w-3 h-3 text-[#555555]" />
            <span className="text-[#FF7800] truncate font-semibold">
              {currentSectionInfo.label}
            </span>
          </div>

          {/* Page Title */}
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {currentSectionInfo.label}
          </h1>
        </div>
      </div>

      {/* Right Side: Guide Button + Logout */}
      <div className="flex items-center gap-3">
        {/* Guide Button */}
        <button
          id="admin-tour-restart-button"
          onClick={() => startAdminTour()}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-none text-xs font-mono font-medium text-[#CCCCCC] bg-[#000000] hover:bg-[#141414] hover:text-white border border-[#1A1A1A] transition-colors uppercase tracking-wider"
          title="Kullanim rehberini ve interaktif turu baslat"
          aria-label="Rehberi Baslat"
        >
          <Compass className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#FF7800]" />
          <span className="hidden sm:inline">Rehberi Baslat</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-none text-xs font-mono font-medium text-rose-400 hover:text-white hover:bg-rose-950/40 border border-rose-900/40 transition-colors uppercase tracking-wider"
          title="Oturumu guvenle sonlandir"
          aria-label="Cikis Yap"
        >
          <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Cikis Yap</span>
        </button>
      </div>
    </header>
  );
}

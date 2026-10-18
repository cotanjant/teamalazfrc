"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/admin/useAdminStore";
import { useAdminShell } from "@/components/admin/shell/AdminShellContext";
import { Check, AlertCircle } from "lucide-react";

// Lazy load modular section editors
const HomeStatsSection = dynamic(
  () => import("@/components/admin/sections/HomeStatsSection").then((m) => m.HomeStatsSection),
  { ssr: false }
);
const TeamSection = dynamic(
  () => import("@/components/admin/sections/TeamSection").then((m) => m.TeamSection),
  { ssr: false }
);
const MissionVisionSection = dynamic(
  () => import("@/components/admin/sections/MissionVisionSection").then((m) => m.MissionVisionSection),
  { ssr: false }
);
const RobotSection = dynamic(
  () => import("@/components/admin/sections/RobotSection").then((m) => m.RobotSection),
  { ssr: false }
);
const OutreachSection = dynamic(
  () => import("@/components/admin/sections/OutreachSection").then((m) => m.OutreachSection),
  { ssr: false }
);
const PartnersSection = dynamic(
  () => import("@/components/admin/sections/PartnersSection").then((m) => m.PartnersSection),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import("@/components/admin/sections/ContactSection").then((m) => m.ContactSection),
  { ssr: false }
);

export default function AdminPage() {
  return <AdminDashboard />;
}

function AdminDashboard() {
  const { activeSection, setActiveSection } = useAdminShell();
  const activeTab = activeSection;
  const setActiveTab = setActiveSection;

  const {
    isDirty,
    changedFieldsCount,
    isSaving,
    saveStatus,
    statusMessage,
    resetChanges,
    saveData,
  } = useAdminStore();

  return (
    <div className="space-y-6">
      {/* Top sticky banner with controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Icerik Yonetimi</h1>
            <div id="admin-dirty-badge" className="inline-flex items-center">
              {isDirty ? (
                <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-[10px] rounded-none">
                  {changedFieldsCount} Degisiklik
                </Badge>
              ) : (
                <Badge variant="outline" className="border-[#1A1A1A] text-zinc-500 font-mono text-[10px] rounded-none">
                  Kayitlar Guncel
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Canli web sitesi metinlerini, menu baglantilarini, robot bilgilerini ve sponsorlari yonetin.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {saveStatus === "success" && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-none flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{statusMessage || "Kaydedildi"}</span>
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 rounded-none flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{statusMessage || "Hata"}</span>
            </span>
          )}
          {isDirty && (
            <Button
              variant="outline"
              onClick={resetChanges}
              disabled={isSaving}
              className="border-[#262626] bg-[#000000] text-xs text-zinc-300 hover:text-white hover:bg-[#121212] h-9 px-3 rounded-none"
            >
              Geri Al
            </Button>
          )}
          <Button
            id="admin-save-button"
            onClick={() => saveData()}
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#FF7800] hover:bg-[#ff8a1e] text-black font-semibold text-xs tracking-wider uppercase h-9 px-6 transition-colors shadow-[0_0_15px_rgba(255,120,0,0.25)] rounded-none"
          >
            {isSaving ? "Kaydediliyor..." : "Degisiklikleri Kaydet"}
          </Button>
        </div>
      </div>

      {/* Main Section Content Container (Without duplicate horizontal tab bar) */}
      <Tabs id="admin-active-section" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* TAB 1: HOME & STATS + NAVIGATION */}
        <TabsContent value="home" className="mt-2 focus-visible:outline-none">
          <div id="admin-data-table">
            <HomeStatsSection />
          </div>
        </TabsContent>

        {/* TAB 2: OUR TEAM & DEPARTMENTS */}
        <TabsContent value="team" className="mt-2 focus-visible:outline-none">
          <TeamSection />
        </TabsContent>

        {/* TAB 3: MISSION & VISION */}
        <TabsContent value="mission" className="mt-2 focus-visible:outline-none">
          <MissionVisionSection />
        </TabsContent>

        {/* TAB 4: ROBOT */}
        <TabsContent value="robot" className="mt-2 focus-visible:outline-none">
          <RobotSection />
        </TabsContent>

        {/* TAB 5: OUTREACH */}
        <TabsContent value="outreach" className="mt-2 focus-visible:outline-none">
          <OutreachSection />
        </TabsContent>

        {/* TAB 6: PARTNERS */}
        <TabsContent value="partners" className="mt-2 focus-visible:outline-none">
          <PartnersSection />
        </TabsContent>

        {/* TAB 7: CONTACT */}
        <TabsContent value="contact" className="mt-2 focus-visible:outline-none">
          <ContactSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

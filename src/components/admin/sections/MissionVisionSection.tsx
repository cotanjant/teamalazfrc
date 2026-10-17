"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/lib/admin/useAdminStore";
import { useAdminTranslation } from "@/lib/i18n/useAdminTranslation";
import { Target, Eye } from "lucide-react";

export function MissionVisionSection() {
  const store = useAdminStore();
  const { t } = useAdminTranslation();
  const { data, updateMission, updateVision } = store;

  const missionCharCount = data.missionVision.mission.body.length;
  const visionCharCount = data.missionVision.vision.body.length;

  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission Card */}
        <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-xl flex flex-col justify-between">
          <CardHeader className="pb-4 border-b border-[#1A1A1A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base text-zinc-100 font-bold">
                    {t("missionVision.missionTitle")}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-0.5">
                    {t("missionVision.missionDescription")}
                  </CardDescription>
                </div>
              </div>
              <span className="font-mono text-xs text-[#FF7800] font-bold px-2 py-0.5 rounded-none bg-[#FF7800]/10 border border-[#FF7800]/30">
                01
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5 flex-1">
            <div className="space-y-1.5">
              <Label htmlFor="field-mission-tagline" className="text-xs text-zinc-400">{t("missionVision.missionTagline")}</Label>
              <Input
                id="field-mission-tagline"
                value={data.missionVision.mission.tagline}
                onChange={(e) => updateMission("tagline", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="field-mission-body" className="text-xs text-zinc-400">{t("missionVision.missionBody")}</Label>
                <span className="text-[10px] font-mono text-zinc-500">{missionCharCount} karakter</span>
              </div>
              <Textarea
                id="field-mission-body"
                rows={9}
                value={data.missionVision.mission.body}
                onChange={(e) => updateMission("body", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 leading-relaxed font-sans rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vision Card */}
        <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-xl flex flex-col justify-between">
          <CardHeader className="pb-4 border-b border-[#1A1A1A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base text-zinc-100 font-bold">
                    {t("missionVision.visionTitle")}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-0.5">
                    {t("missionVision.visionDescription")}
                  </CardDescription>
                </div>
              </div>
              <span className="font-mono text-xs text-[#FF7800] font-bold px-2 py-0.5 rounded-none bg-[#FF7800]/10 border border-[#FF7800]/30">
                02
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5 flex-1">
            <div className="space-y-1.5">
              <Label htmlFor="field-vision-tagline" className="text-xs text-zinc-400">{t("missionVision.visionTagline")}</Label>
              <Input
                id="field-vision-tagline"
                value={data.missionVision.vision.tagline}
                onChange={(e) => updateVision("tagline", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="field-vision-body" className="text-xs text-zinc-400">{t("missionVision.visionBody")}</Label>
                <span className="text-[10px] font-mono text-zinc-500">{visionCharCount} karakter</span>
              </div>
              <Textarea
                id="field-vision-body"
                rows={9}
                value={data.missionVision.vision.body}
                onChange={(e) => updateVision("body", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 leading-relaxed font-sans rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MissionVisionSection;

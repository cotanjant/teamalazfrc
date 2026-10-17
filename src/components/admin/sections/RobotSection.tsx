"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/lib/admin/useAdminStore";
import { useAdminTranslation } from "@/lib/i18n/useAdminTranslation";
import { Cpu } from "lucide-react";

export function RobotSection() {
  const store = useAdminStore();
  const { t } = useAdminTranslation();
  const { data, updateRobot } = store;

  return (
    <div className="space-y-6">
      {/* Robot Genel Bakış */}
      <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-xl">
        <CardHeader className="pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base text-zinc-100 font-bold">
                {t("robot.overviewTitle")}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-0.5">
                {t("robot.overviewDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="field-robot-title" className="text-xs text-zinc-400">Bölüm Üst Başlığı (Kategori)</Label>
              <Input
                id="field-robot-title"
                value={data.robot.title || "Robot"}
                onChange={(e) => updateRobot("title", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field-robot-tagline" className="text-xs text-zinc-400">{t("robot.tagline")}</Label>
              <Input
                id="field-robot-tagline"
                value={data.robot.tagline}
                onChange={(e) => updateRobot("tagline", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-robot-precisionStatement" className="text-xs text-zinc-400">{t("robot.precisionStatement")}</Label>
            <Input
              id="field-robot-precisionStatement"
              value={data.robot.precisionStatement}
              onChange={(e) => updateRobot("precisionStatement", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm font-semibold text-[#FF7800] h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-robot-description" className="text-xs text-zinc-400">{t("robot.description")}</Label>
            <Textarea
              id="field-robot-description"
              rows={4}
              value={data.robot.description}
              onChange={(e) => updateRobot("description", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 leading-relaxed rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RobotSection;

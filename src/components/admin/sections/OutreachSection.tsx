"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/lib/admin/useAdminStore";
import { useAdminTranslation } from "@/lib/i18n/useAdminTranslation";
import { AdminDataTable, Column } from "@/components/admin/ui/AdminDataTable";
import { OutreachProjectItem, OutreachStat } from "@/data/collection";
import { Globe, HeartHandshake, BarChart, Check } from "lucide-react";

export function OutreachSection() {
  const store = useAdminStore();
  const { t } = useAdminTranslation();
  const {
    data,
    updateOutreach,
    updateOutreachProject,
    addOutreachProject,
    removeOutreachProject,
    reorderOutreachProject,
    updateOutreachStat,
    addOutreachStat,
    removeOutreachStat,
  } = store;

  // Editing state for outreach projects
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<OutreachProjectItem>>({});

  const startEditProject = (item: OutreachProjectItem, index: number) => {
    setEditingProjectIndex(index);
    setEditingProject({ ...item });
  };

  const saveEditProject = () => {
    if (editingProjectIndex === null) return;
    if (editingProject.title !== undefined) updateOutreachProject(editingProjectIndex, "title", editingProject.title);
    if (editingProject.summary !== undefined) updateOutreachProject(editingProjectIndex, "summary", editingProject.summary);
    setEditingProjectIndex(null);
    setEditingProject({});
  };

  // Editing state for outreach stats
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  const [editingStat, setEditingStat] = useState<Partial<OutreachStat>>({});

  const startEditStat = (item: OutreachStat, index: number) => {
    setEditingStatIndex(index);
    setEditingStat({ ...item });
  };

  const saveEditStat = () => {
    if (editingStatIndex === null) return;
    if (editingStat.label !== undefined) updateOutreachStat(editingStatIndex, "label", editingStat.label);
    if (editingStat.value !== undefined) updateOutreachStat(editingStatIndex, "value", editingStat.value);
    if (editingStat.code !== undefined) updateOutreachStat(editingStatIndex, "code", editingStat.code);
    setEditingStatIndex(null);
    setEditingStat({});
  };

  // Project Columns (100% matched to live site card rendering: Title & Summary)
  const projectColumns: Column<OutreachProjectItem>[] = [
    {
      key: "title",
      title: "Girişim / Proje Adı",
      width: "280px",
      sortable: true,
      render: (item, idx) =>
        editingProjectIndex === idx ? (
          <Input
            value={editingProject.title ?? item.title}
            onChange={(e) => setEditingProject((prev) => ({ ...prev, title: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] font-semibold text-white rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="font-semibold text-zinc-100">{item.title}</span>
        ),
    },
    {
      key: "summary",
      title: "Özet ve Açıklama",
      render: (item, idx) =>
        editingProjectIndex === idx ? (
          <Input
            value={editingProject.summary ?? item.summary}
            onChange={(e) => setEditingProject((prev) => ({ ...prev, summary: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="text-zinc-400 line-clamp-1 text-xs">{item.summary}</span>
        ),
    },
  ];

  // Stat Columns
  const statColumns: Column<OutreachStat>[] = [
    {
      key: "code",
      title: "Kod",
      width: "90px",
      sortable: true,
      render: (item, idx) =>
        editingStatIndex === idx ? (
          <Input
            value={editingStat.code ?? item.code}
            onChange={(e) => setEditingStat((prev) => ({ ...prev, code: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] font-mono text-white w-20 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="font-mono text-zinc-400 text-xs px-2 py-0.5 rounded-none bg-[#000000] border border-[#1A1A1A]">
            {item.code}
          </span>
        ),
    },
    {
      key: "label",
      title: "Metrik Başlığı",
      sortable: true,
      render: (item, idx) =>
        editingStatIndex === idx ? (
          <Input
            value={editingStat.label ?? item.label}
            onChange={(e) => setEditingStat((prev) => ({ ...prev, label: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] font-medium text-white rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="font-semibold text-zinc-100">{item.label}</span>
        ),
    },
    {
      key: "value",
      title: "Değer",
      width: "120px",
      sortable: true,
      render: (item, idx) =>
        editingStatIndex === idx ? (
          <Input
            value={editingStat.value ?? item.value}
            onChange={(e) => setEditingStat((prev) => ({ ...prev, value: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] font-mono text-white rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="font-mono font-bold text-[#FF7800]">{item.value}</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Sosyal Sorumluluk Genel Bakış */}
      <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-xl">
        <CardHeader className="pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base text-zinc-100 font-bold">
                {t("outreach.overviewTitle")}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-0.5">
                {t("outreach.overviewDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-1.5">
            <Label htmlFor="field-outreach-title" className="text-xs text-zinc-400">Bölüm Üst Başlığı (Kategori)</Label>
            <Input
              id="field-outreach-title"
              value={data.outreach.title || "Outreach"}
              onChange={(e) => updateOutreach("title", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-outreach-tagline" className="text-xs text-zinc-400">{t("outreach.tagline")}</Label>
            <Input
              id="field-outreach-tagline"
              value={data.outreach.tagline}
              onChange={(e) => updateOutreach("tagline", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-outreach-description" className="text-xs text-zinc-400">{t("outreach.description")}</Label>
            <Textarea
              id="field-outreach-description"
              rows={3}
              value={data.outreach.description}
              onChange={(e) => updateOutreach("description", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 leading-relaxed rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Sosyal Sorumluluk Projeleri Tablosu */}
      <div>
        <AdminDataTable
          data={data.outreach.projects}
          columns={projectColumns}
          title={t("outreach.projectsTitle")}
          subtitle={t("outreach.projectsDescription")}
          icon={<HeartHandshake className="w-4 h-4" />}
          searchPlaceholder="Projelerde ara (başlık, özet)..."
          searchKeys={["title", "summary"]}
          addLabel="Yeni Proje Ekle"
          onAdd={() =>
            addOutreachProject({
              title: "Yeni Sosyal Sorumluluk Girişimi",
              summary: "Girişimin hedef kitlesi ve etki kapsamı...",
              code: `OUT-${String(data.outreach.projects.length + 1).padStart(2, "0")}`,
            })
          }
          onEdit={(item, originalIndex) => {
            if (editingProjectIndex === originalIndex) {
              saveEditProject();
            } else {
              startEditProject(item, originalIndex);
            }
          }}
          onDelete={(_, originalIndex) => removeOutreachProject(originalIndex)}
          deleteConfirmTitle="Projeyi Sil"
          deleteConfirmDescription={(item) =>
            `'${item.title}' projesini listeden silmek istediğinizden emin misiniz?`
          }
          onReorder={reorderOutreachProject}
          renderCustomRowActions={(_, originalIndex) =>
            editingProjectIndex === originalIndex ? (
              <Button
                type="button"
                size="sm"
                onClick={saveEditProject}
                className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1 rounded-none"
              >
                <Check className="w-3 h-3" />
                Kaydet
              </Button>
            ) : null
          }
        />
      </div>

      {/* 3. Etki Metrikleri Tablosu */}
      <div>
        <AdminDataTable
          data={data.outreach.stats}
          columns={statColumns}
          title="Toplumsal Etki Metrikleri"
          subtitle="Sosyal sorumluluk projelerinin kümülatif erişim ve etki verileri."
          icon={<BarChart className="w-4 h-4" />}
          searchPlaceholder="Etki metriklerinde ara..."
          searchKeys={["label", "value", "code"]}
          addLabel="Yeni Metrik Ekle"
          onAdd={() =>
            addOutreachStat({
              label: "Eğitim Alan Öğrenci",
              value: "250+",
              code: `STAT-${String(data.outreach.stats.length + 1).padStart(2, "0")}`,
            })
          }
          onEdit={(item, originalIndex) => {
            if (editingStatIndex === originalIndex) {
              saveEditStat();
            } else {
              startEditStat(item, originalIndex);
            }
          }}
          onDelete={(_, originalIndex) => removeOutreachStat(originalIndex)}
          deleteConfirmTitle="Etki Metriğini Sil"
          deleteConfirmDescription={(item) =>
            `'${item.label}' (${item.value}) metriğini silmek istediğinizden emin misiniz?`
          }
          renderCustomRowActions={(_, originalIndex) =>
            editingStatIndex === originalIndex ? (
              <Button
                type="button"
                size="sm"
                onClick={saveEditStat}
                className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1 rounded-none"
              >
                <Check className="w-3 h-3" />
                Kaydet
              </Button>
            ) : null
          }
        />
      </div>
    </div>
  );
}

export default OutreachSection;

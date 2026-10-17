"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminStore } from "@/lib/admin/useAdminStore";
import { useAdminTranslation } from "@/lib/i18n/useAdminTranslation";
import { AdminDataTable, Column } from "@/components/admin/ui/AdminDataTable";
import { DepartmentItem } from "@/data/collection";
import { Users, Building2, Check } from "lucide-react";

export function TeamSection() {
  const store = useAdminStore();
  const { t } = useAdminTranslation();
  const {
    data,
    updateTeamSection,
    updateDepartment,
    addDepartment,
    removeDepartment,
    reorderDepartment,
  } = store;

  // Editing state for departments table
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDept, setEditingDept] = useState<Partial<DepartmentItem>>({});

  const startEdit = (item: DepartmentItem, index: number) => {
    setEditingIndex(index);
    setEditingDept({ ...item });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    if (editingDept.name !== undefined) updateDepartment(editingIndex, "name", editingDept.name);
    if (editingDept.category !== undefined) updateDepartment(editingIndex, "category", editingDept.category);
    if (editingDept.description !== undefined) updateDepartment(editingIndex, "description", editingDept.description);
    if (editingDept.code !== undefined) updateDepartment(editingIndex, "code", editingDept.code);
    setEditingIndex(null);
    setEditingDept({});
  };

  const columns: Column<DepartmentItem>[] = [
    {
      key: "code",
      title: "Kod",
      width: "90px",
      sortable: true,
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingDept.code ?? item.code}
            onChange={(e) => setEditingDept((prev) => ({ ...prev, code: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] font-mono w-20 rounded-none text-white focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="font-mono text-zinc-400 text-xs px-2 py-0.5 rounded-none bg-[#000000] border border-[#1A1A1A]">
            #{item.code}
          </span>
        ),
    },
    {
      key: "name",
      title: "Departman Adı",
      sortable: true,
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingDept.name ?? item.name}
            onChange={(e) => setEditingDept((prev) => ({ ...prev, name: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] font-semibold rounded-none text-white focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="font-semibold text-zinc-100">{item.name}</span>
        ),
    },
    {
      key: "category",
      title: "Kategori",
      width: "150px",
      sortable: true,
      render: (item, idx) =>
        editingIndex === idx ? (
          <Select
            value={editingDept.category ?? item.category}
            onValueChange={(val: "Engineering" | "Operations") =>
              setEditingDept((prev) => ({ ...prev, category: val }))
            }
          >
            <SelectTrigger className="h-7 text-xs bg-[#000000] border-[#262626] rounded-none text-zinc-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-[#1A1A1A] text-zinc-200 rounded-none">
              <SelectItem value="Engineering">Mühendislik</SelectItem>
              <SelectItem value="Operations">Operasyon</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge
            variant="outline"
            className={
              item.category === "Engineering"
                ? "border-[#FF7800]/40 text-[#FF7800] bg-[#FF7800]/10 text-[10px] font-mono rounded-none uppercase"
                : "border-[#FFD21C]/40 text-[#FFD21C] bg-[#FFD21C]/10 text-[10px] font-mono rounded-none uppercase"
            }
          >
            {item.category === "Engineering" ? "Mühendislik" : "Operasyon"}
          </Badge>
        ),
    },
    {
      key: "description",
      title: "Görev Tanımı / Açıklama",
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingDept.description ?? item.description}
            onChange={(e) => setEditingDept((prev) => ({ ...prev, description: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] rounded-none text-white focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="text-zinc-400 line-clamp-1 text-xs">{item.description}</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Takım Felsefesi ve Başlığı */}
      <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-xl">
        <CardHeader className="pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base text-zinc-100 font-bold">{t("team.headerTitle")}</CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-0.5">
                {t("team.headerDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="field-team-title" className="text-xs text-zinc-400">Bölüm Başlığı</Label>
              <Input
                id="field-team-title"
                value={data.team.title}
                onChange={(e) => updateTeamSection("title", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field-team-tagline" className="text-xs text-zinc-400">{t("team.tagline")}</Label>
              <Input
                id="field-team-tagline"
                value={data.team.tagline}
                onChange={(e) => updateTeamSection("tagline", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-team-description" className="text-xs text-zinc-400">{t("team.description")}</Label>
            <Textarea
              id="field-team-description"
              rows={3}
              value={data.team.description}
              onChange={(e) => updateTeamSection("description", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 leading-relaxed rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Departmanlar Tablosu (DataTable with Category Filter) */}
      <div>
        <AdminDataTable
          data={data.departments}
          columns={columns}
          title={t("team.departmentsTitle")}
          subtitle={t("team.departmentsDescription")}
          icon={<Building2 className="w-4 h-4" />}
          searchPlaceholder="Departmanlarda ara (kod, isim, görev tanımı)..."
          searchKeys={["code", "name", "description", "category"]}
          filters={[
            {
              key: "category",
              label: "Kategori",
              allLabel: "Tüm Departmanlar",
              options: [
                { label: "Mühendislik (Engineering)", value: "Engineering" },
                { label: "Operasyon (Operations)", value: "Operations" },
              ],
            },
          ]}
          addLabel="Yeni Departman Ekle"
          onAdd={() =>
            addDepartment({
              name: "Yeni Departman",
              category: "Engineering",
              description: "Departman görev ve sorumlulukları...",
              code: `DEPT-${String(data.departments.length + 1).padStart(2, "0")}`,
            })
          }
          onEdit={(item, originalIndex) => {
            if (editingIndex === originalIndex) {
              saveEdit();
            } else {
              startEdit(item, originalIndex);
            }
          }}
          onDelete={(_, originalIndex) => removeDepartment(originalIndex)}
          deleteConfirmTitle="Departmanı Sil"
          deleteConfirmDescription={(item) =>
            `'${item.name}' (#${item.code}) departmanını silmek istediğinizden emin misiniz?`
          }
          onReorder={reorderDepartment}
          renderCustomRowActions={(_, originalIndex) =>
            editingIndex === originalIndex ? (
              <Button
                type="button"
                size="sm"
                onClick={saveEdit}
                className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
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

export default TeamSection;

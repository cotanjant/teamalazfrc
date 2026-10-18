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
import { PartnerSlotItem } from "@/data/collection";
import { Handshake, ExternalLink, Check, Award } from "lucide-react";

export function PartnersSection() {
  const store = useAdminStore();
  const { t } = useAdminTranslation();
  const {
    data,
    updatePartners,
    updatePartner,
    addPartner,
    removePartner,
    reorderPartner,
  } = store;

  // Editing state for partner tiers
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<PartnerSlotItem>>({});

  const startEdit = (item: PartnerSlotItem, index: number) => {
    setEditingIndex(index);
    setEditingPartner({ ...item });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    if (editingPartner.name !== undefined) updatePartner(editingIndex, "name", editingPartner.name);
    if (editingPartner.role !== undefined) updatePartner(editingIndex, "role", editingPartner.role);
    if (editingPartner.href !== undefined) updatePartner(editingIndex, "href", editingPartner.href);
    if (editingPartner.code !== undefined) updatePartner(editingIndex, "code", editingPartner.code);
    setEditingIndex(null);
    setEditingPartner({});
  };

  const columns: Column<PartnerSlotItem>[] = [
    {
      key: "name",
      title: "Destekci / Kurum Adi",
      sortable: true,
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingPartner.name ?? item.name}
            onChange={(e) => setEditingPartner((prev) => ({ ...prev, name: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] font-semibold text-white rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-100">{item.name}</span>
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-[#FF7800] transition-colors"
                title="Web sitesini ac"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ),
    },
    {
      key: "role",
      title: "Katki / Rol Tanimi",
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingPartner.role ?? item.role}
            onChange={(e) => setEditingPartner((prev) => ({ ...prev, role: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : (
          <span className="text-zinc-300 text-xs">{item.role}</span>
        ),
    },
    {
      key: "href",
      title: "Web Sitesi",
      width: "180px",
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingPartner.href ?? item.href ?? ""}
            onChange={(e) => setEditingPartner((prev) => ({ ...prev, href: e.target.value }))}
            placeholder="https://..."
            className="h-7 text-xs bg-[#000000] border-[#262626] font-mono text-white rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
          />
        ) : item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="text-[#FF7800] font-mono text-xs hover:underline truncate max-w-[160px] block"
          >
            {item.href}
          </a>
        ) : (
          <span className="text-zinc-600 font-mono text-xs">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Destekciler ve Sponsorlar Genel Bakis */}
      <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-xl">
        <CardHeader className="pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base text-zinc-100 font-bold">
                {t("partners.overviewTitle")}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-0.5">
                {t("partners.overviewDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-1.5">
            <Label htmlFor="field-partners-tagline" className="text-xs text-zinc-400">{t("partners.tagline")}</Label>
            <Input
              id="field-partners-tagline"
              value={data.partners.tagline}
              onChange={(e) => updatePartners("tagline", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-partners-description" className="text-xs text-zinc-400">{t("partners.description")}</Label>
            <Textarea
              id="field-partners-description"
              rows={3}
              value={data.partners.description}
              onChange={(e) => updatePartners("description", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 leading-relaxed rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Sponsor ve Paydaslar Tablosu */}
      <div>
        <AdminDataTable
          data={data.partners.tiers}
          columns={columns}
          title={t("partners.tiersTitle")}
          subtitle={t("partners.tiersDescription")}
          icon={<Award className="w-4 h-4" />}
          searchPlaceholder="Destekcilerde ara (isim, rol, web baglantisi)..."
          searchKeys={["name", "role", "href"]}
          addLabel="Yeni Sponsor Ekle"
          onAdd={() =>
            addPartner({
              name: "Yeni Sponsor Kurum",
              role: "Teknik ve Donanim Destegi",
              href: "https://",
              code: `PARTNER-${String(data.partners.tiers.length + 1).padStart(2, "0")}`,
            })
          }
          onEdit={(item, originalIndex) => {
            if (editingIndex === originalIndex) {
              saveEdit();
            } else {
              startEdit(item, originalIndex);
            }
          }}
          onDelete={(_, originalIndex) => removePartner(originalIndex)}
          deleteConfirmTitle="Sponsoru Sil"
          deleteConfirmDescription={(item) =>
            `'${item.name}' kaydini listeden silmek istediginizden emin misiniz?`
          }
          onReorder={reorderPartner}
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

export default PartnersSection;

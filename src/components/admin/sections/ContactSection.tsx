"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminStore } from "@/lib/admin/useAdminStore";
import { useAdminTranslation } from "@/lib/i18n/useAdminTranslation";
import { AdminDataTable, Column } from "@/components/admin/ui/AdminDataTable";
import { SocialAccount } from "@/data/collection";
import { Mail, Share2, ExternalLink, Check, MapPin, Building } from "lucide-react";

export function ContactSection() {
  const store = useAdminStore();
  const { t } = useAdminTranslation();
  const {
    data,
    updateContact,
    updateTeamInfo,
    updateSocial,
    addSocial,
    removeSocial,
    reorderSocial,
  } = store;

  // Editing state for socials table
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialAccount>>({});

  const startEdit = (item: SocialAccount, index: number) => {
    setEditingIndex(index);
    setEditingSocial({ ...item });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    if (editingSocial.platform !== undefined) updateSocial(editingIndex, "platform", editingSocial.platform);
    if (editingSocial.handle !== undefined) updateSocial(editingIndex, "handle", editingSocial.handle);
    if (editingSocial.href !== undefined) updateSocial(editingIndex, "href", editingSocial.href);
    if (editingSocial.code !== undefined) updateSocial(editingIndex, "code", editingSocial.code);
    setEditingIndex(null);
    setEditingSocial({});
  };

  const columns: Column<SocialAccount>[] = [
    {
      key: "platform",
      title: "Platform",
      width: "160px",
      sortable: true,
      render: (item, idx) =>
        editingIndex === idx ? (
          <Select
            value={editingSocial.platform ?? item.platform}
            onValueChange={(val: "Instagram" | "X" | "TikTok" | "YouTube") =>
              setEditingSocial((prev) => ({ ...prev, platform: val }))
            }
          >
            <SelectTrigger className="h-7 text-xs bg-[#000000] border-[#1A1A1A] rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#000000] border-[#1A1A1A] text-zinc-200 rounded-none">
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="X">X (Twitter)</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span className="font-semibold text-zinc-100">{item.platform}</span>
        ),
    },
    {
      key: "handle",
      title: "Kullanıcı Adı (Handle)",
      width: "220px",
      sortable: true,
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingSocial.handle ?? item.handle}
            onChange={(e) => setEditingSocial((prev) => ({ ...prev, handle: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#1A1A1A] rounded-none font-mono text-[#FF7800]"
          />
        ) : (
          <span className="font-mono text-[#FF7800] text-xs font-semibold">{item.handle}</span>
        ),
    },
    {
      key: "href",
      title: "Profil Bağlantısı (URL)",
      render: (item, idx) =>
        editingIndex === idx ? (
          <Input
            value={editingSocial.href ?? item.href}
            onChange={(e) => setEditingSocial((prev) => ({ ...prev, href: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#1A1A1A] rounded-none font-mono text-[#FF7800]"
          />
        ) : (
          <div className="flex items-center gap-2">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-[#FF7800] hover:underline font-mono text-xs truncate max-w-sm flex items-center gap-1.5"
                title="Profili aç"
              >
                <span>{item.href}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-zinc-600 text-xs font-mono">-</span>
            )}
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. İletişim Bilgileri */}
      <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-none">
        <CardHeader className="pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base text-zinc-100 font-bold">
                {t("contact.infoTitle")}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-0.5">
                {t("contact.infoDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="field-contact-email" className="text-xs text-zinc-400">{t("contact.emailLabel")}</Label>
              <Input
                id="field-contact-email"
                value={data.contact.email}
                onChange={(e) => {
                  updateContact("email", e.target.value);
                  updateTeamInfo("email", e.target.value);
                }}
                className="bg-[#000000] border-[#1A1A1A] rounded-none text-sm font-mono text-zinc-200 h-9 focus-visible:ring-[#FF7800]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="field-contact-locationLabel" className="text-xs text-zinc-400">{t("contact.locationLabel")}</Label>
              <Input
                id="field-contact-locationLabel"
                value={data.contact.locationLabel}
                onChange={(e) => updateContact("locationLabel", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] rounded-none text-sm text-zinc-200 h-9 focus-visible:ring-[#FF7800]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="field-contact-schoolLabel" className="text-xs text-zinc-400">Okul / Yerleşke Etiketi</Label>
              <Input
                id="field-contact-schoolLabel"
                value={data.contact.schoolLabel}
                onChange={(e) => updateContact("schoolLabel", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] rounded-none text-sm text-zinc-200 h-9 focus-visible:ring-[#FF7800]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="field-contact-tagline" className="text-xs text-zinc-400">{t("contact.tagline")}</Label>
              <Input
                id="field-contact-tagline"
                value={data.contact.tagline}
                onChange={(e) => updateContact("tagline", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] rounded-none text-sm text-zinc-200 h-9 focus-visible:ring-[#FF7800]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-contact-description" className="text-xs text-zinc-400">{t("contact.description")}</Label>
            <Textarea
              id="field-contact-description"
              rows={3}
              value={data.contact.description}
              onChange={(e) => updateContact("description", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] rounded-none text-sm text-zinc-200 leading-relaxed focus-visible:ring-[#FF7800]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Sosyal Medya Hesapları Tablosu (DataTable) */}
      <div>
        <AdminDataTable
          data={data.media.socials}
          columns={columns}
          title={t("contact.socialsTitle")}
          subtitle={t("contact.socialsDescription")}
          icon={<Share2 className="w-4 h-4" />}
          searchPlaceholder="Sosyal medya hesaplarında ara..."
          searchKeys={["platform", "handle", "href"]}
          addLabel="Hesap Ekle"
          onAdd={() =>
            addSocial({
              platform: "Instagram",
              handle: "@teamalaz12368",
              href: "https://instagram.com/teamalaz12368",
              code: `SOC-${String(data.media.socials.length + 1).padStart(2, "0")}`,
            })
          }
          onEdit={(item, originalIndex) => {
            if (editingIndex === originalIndex) {
              saveEdit();
            } else {
              startEdit(item, originalIndex);
            }
          }}
          onDelete={(_, originalIndex) => removeSocial(originalIndex)}
          deleteConfirmTitle="Sosyal Medya Hesabını Sil"
          deleteConfirmDescription={(item) =>
            `'${item.platform}' (${item.handle}) hesabını silmek istediğinizden emin misiniz?`
          }
          onReorder={reorderSocial}
          renderCustomRowActions={(_, originalIndex) =>
            editingIndex === originalIndex ? (
              <Button
                type="button"
                size="sm"
                onClick={saveEdit}
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

export default ContactSection;

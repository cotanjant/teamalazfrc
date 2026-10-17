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
import { StatItem, NavItem } from "@/data/collection";
import { Home, BarChart3, Menu, Check } from "lucide-react";

export function HomeStatsSection() {
  const store = useAdminStore();
  const { t } = useAdminTranslation();
  const {
    data,
    updateHero,
    updateStats,
    addStat,
    removeStat,
    reorderStat,
    updateNavigation,
    addNavigationItem,
    removeNavigationItem,
    reorderNavigationItem,
  } = store;

  // Editing state for navigation table
  const [editingNavIndex, setEditingNavIndex] = useState<number | null>(null);
  const [editingNav, setEditingNav] = useState<Partial<NavItem>>({});

  const startEditNav = (item: NavItem, index: number) => {
    setEditingNavIndex(index);
    setEditingNav({ ...item });
  };

  const saveEditingNav = () => {
    if (editingNavIndex === null) return;
    if (editingNav.label !== undefined) updateNavigation(editingNavIndex, "label", editingNav.label);
    if (editingNav.href !== undefined) updateNavigation(editingNavIndex, "href", editingNav.href);
    if (editingNav.code !== undefined) updateNavigation(editingNavIndex, "code", editingNav.code);
    setEditingNavIndex(null);
    setEditingNav({});
  };

  const navColumns: Column<NavItem>[] = [
    {
      key: "code",
      title: "Sıra No",
      width: "90px",
      sortable: true,
      render: (item, idx) =>
        editingNavIndex === idx ? (
          <Input
            value={editingNav.code ?? item.code}
            onChange={(e) => setEditingNav((prev) => ({ ...prev, code: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white font-mono w-20"
          />
        ) : (
          <span className="font-mono text-zinc-400 text-xs px-2 py-0.5 rounded-none bg-[#000000] border border-[#1A1A1A]">
            {item.code}
          </span>
        ),
    },
    {
      key: "label",
      title: "Menü Başlığı",
      sortable: true,
      render: (item, idx) =>
        editingNavIndex === idx ? (
          <Input
            value={editingNav.label ?? item.label}
            onChange={(e) => setEditingNav((prev) => ({ ...prev, label: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white font-medium"
          />
        ) : (
          <span className="font-semibold text-zinc-100">{item.label}</span>
        ),
    },
    {
      key: "href",
      title: "Hedef Bağlantı (URL / #çapa)",
      sortable: true,
      render: (item, idx) =>
        editingNavIndex === idx ? (
          <Input
            value={editingNav.href ?? item.href}
            onChange={(e) => setEditingNav((prev) => ({ ...prev, href: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-[#FF7800] font-mono"
          />
        ) : (
          <span className="font-mono text-xs text-[#FF7800]">{item.href}</span>
        ),
    },
  ];

  // Editing state for stats table
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  const [editingStat, setEditingStat] = useState<Partial<StatItem>>({});

  const startEditStat = (stat: StatItem, index: number) => {
    setEditingStatIndex(index);
    setEditingStat({ ...stat });
  };

  const saveEditingStat = () => {
    if (editingStatIndex === null) return;
    if (editingStat.label !== undefined) updateStats(editingStatIndex, "label", editingStat.label);
    if (editingStat.value !== undefined) updateStats(editingStatIndex, "value", editingStat.value);
    if (editingStat.suffix !== undefined) updateStats(editingStatIndex, "suffix", editingStat.suffix);
    if (editingStat.description !== undefined) updateStats(editingStatIndex, "description", editingStat.description);
    if (editingStat.code !== undefined) updateStats(editingStatIndex, "code", editingStat.code);
    setEditingStatIndex(null);
    setEditingStat({});
  };

  const statColumns: Column<StatItem>[] = [
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
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white font-mono w-20"
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
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white font-medium"
          />
        ) : (
          <span className="font-semibold text-zinc-100">{item.label}</span>
        ),
    },
    {
      key: "value",
      title: "Değer",
      width: "110px",
      sortable: true,
      render: (item, idx) =>
        editingStatIndex === idx ? (
          <Input
            value={String(editingStat.value ?? item.value ?? "")}
            onChange={(e) => setEditingStat((prev) => ({ ...prev, value: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white font-mono"
            placeholder="Değer"
          />
        ) : (
          <span className="font-mono font-bold text-[#FF7800]">
            {String(item.value || "-")}
          </span>
        ),
    },
    {
      key: "suffix",
      title: "Son Ek",
      width: "70px",
      render: (item, idx) =>
        editingStatIndex === idx ? (
          <Input
            value={editingStat.suffix ?? item.suffix ?? ""}
            onChange={(e) => setEditingStat((prev) => ({ ...prev, suffix: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white font-mono"
            placeholder="+"
          />
        ) : (
          <span className="font-mono text-zinc-400 text-xs">{item.suffix || "-"}</span>
        ),
    },
    {
      key: "description",
      title: "Açıklama",
      render: (item, idx) =>
        editingStatIndex === idx ? (
          <Input
            value={editingStat.description ?? item.description ?? ""}
            onChange={(e) => setEditingStat((prev) => ({ ...prev, description: e.target.value }))}
            className="h-7 text-xs bg-[#000000] border-[#262626] text-white"
          />
        ) : (
          <span className="text-zinc-400 text-xs line-clamp-1">{item.description || "-"}</span>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hero Karşılama Metinleri */}
      <Card className="bg-[#000000] border-[#1A1A1A] rounded-none shadow-xl">
        <CardHeader className="pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#FF7800]/10 text-[#FF7800] border border-[#FF7800]/20">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base text-zinc-100 font-bold">{t("homeStats.heroTitle")}</CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-0.5">
                {t("homeStats.heroDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="field-hero-badge" className="text-xs text-zinc-400">{t("homeStats.badgeLabel")}</Label>
              <Input
                id="field-hero-badge"
                value={data.hero.badge}
                onChange={(e) => updateHero("badge", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="field-hero-coordinates" className="text-xs text-zinc-400">{t("homeStats.coordinatesLabel")}</Label>
              <Input
                id="field-hero-coordinates"
                value={data.hero.coordinates}
                onChange={(e) => updateHero("coordinates", e.target.value)}
                className="bg-[#000000] border-[#1A1A1A] text-sm font-mono text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-hero-headlineFull" className="text-xs text-zinc-400">{t("homeStats.headlineFullLabel")}</Label>
            <Input
              id="field-hero-headlineFull"
              value={data.hero.headlineFull}
              onChange={(e) => updateHero("headlineFull", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 h-9 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field-hero-subtitle" className="text-xs text-zinc-400">{t("homeStats.subtitleLabel")}</Label>
            <Textarea
              id="field-hero-subtitle"
              rows={3}
              value={data.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              className="bg-[#000000] border-[#1A1A1A] text-sm text-zinc-200 leading-relaxed rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Site Menü ve Gezinti Bağlantıları (Navbar & Footer'a birebir bağlı) */}
      <div>
        <AdminDataTable
          data={data.navigation}
          columns={navColumns}
          title="Site Menü & Gezinti Bağlantıları"
          subtitle="Navbar ve Footer menüsünde canlı görünen bağlantıları düzenleyin, sıralayın veya yeni sayfa ekleyin."
          icon={<Menu className="w-4 h-4" />}
          searchPlaceholder="Menü bağlantılarında ara (başlık, url)..."
          searchKeys={["code", "label", "href"]}
          addLabel="+ Yeni Menü Bağlantısı Ekle"
          onAdd={() =>
            addNavigationItem({
              label: "Yeni Menü",
              href: "#",
              code: String(data.navigation.length + 1).padStart(2, "0"),
            })
          }
          onEdit={(item, originalIndex) => {
            if (editingNavIndex === originalIndex) {
              saveEditingNav();
            } else {
              startEditNav(item, originalIndex);
            }
          }}
          onDelete={(_, originalIndex) => removeNavigationItem(originalIndex)}
          deleteConfirmTitle="Menü Bağlantısını Sil"
          deleteConfirmDescription={(item) =>
            `'${item.label}' (${item.href}) menü bağlantısını kaldırmak istediğinizden emin misiniz?`
          }
          onReorder={reorderNavigationItem}
          renderCustomRowActions={(_, originalIndex) =>
            editingNavIndex === originalIndex ? (
              <Button
                type="button"
                size="sm"
                onClick={saveEditingNav}
                className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1 rounded-none"
              >
                <Check className="w-3 h-3" />
                Kaydet
              </Button>
            ) : null
          }
        />
      </div>

      {/* 3. İstatistikler Tablosu (DataTable) */}
      <div>
        <AdminDataTable
          data={data.stats}
          columns={statColumns}
          title={t("homeStats.statsTitle")}
          subtitle={t("homeStats.statsDescription")}
          icon={<BarChart3 className="w-4 h-4" />}
          searchPlaceholder="İstatistiklerde ara (kod, başlık, açıklama)..."
          searchKeys={["code", "label", "description", "value"]}
          addLabel="+ Yeni İstatistik Ekle"
          onAdd={() =>
            addStat({
              label: "Yeni Metrik",
              value: 0,
              suffix: "+",
              description: "Metrik açıklaması",
              code: `STAT-${String(data.stats.length + 1).padStart(2, "0")}`,
            })
          }
          onEdit={(item, originalIndex) => {
            if (editingStatIndex === originalIndex) {
              saveEditingStat();
            } else {
              startEditStat(item, originalIndex);
            }
          }}
          onDelete={(_, originalIndex) => removeStat(originalIndex)}
          deleteConfirmTitle="İstatistiği Sil"
          deleteConfirmDescription={(item) =>
            `'${item.label}' (${item.code}) metriğini tablodan silmek istediğinizden emin misiniz?`
          }
          onReorder={reorderStat}
          renderCustomRowActions={(_, originalIndex) =>
            editingStatIndex === originalIndex ? (
              <Button
                type="button"
                size="sm"
                onClick={saveEditingStat}
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

export default HomeStatsSection;

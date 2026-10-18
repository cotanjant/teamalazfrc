"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Pencil,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "./EmptyState";
import { ConfirmDialog } from "./ConfirmDialog";

/**
 * Turkish-aware string comparison function.
 * Accurately sorts letters like c, g, i, i, o, s, u with numeric handling.
 */
export function turkishCompare(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  const strA = String(a).trim();
  const strB = String(b).trim();

  return strA.localeCompare(strB, "tr-TR", {
    sensitivity: "base",
    numeric: true,
  });
}

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface TableFilter<T> {
  key: keyof T | string;
  label: string;
  options: { label: string; value: string }[];
  allLabel?: string;
}

export interface AdminDataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  filters?: TableFilter<T>[];
  onAdd?: () => void;
  addLabel?: string;
  onEdit?: (item: T, originalIndex: number) => void;
  onDelete?: (item: T, originalIndex: number) => void;
  deleteConfirmTitle?: string;
  deleteConfirmDescription?: (item: T) => string;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  keyExtractor?: (item: T, index: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  className?: string;
  headerAction?: React.ReactNode;
  renderCustomRowActions?: (item: T, originalIndex: number) => React.ReactNode;
}

export function AdminDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  title,
  subtitle,
  icon,
  searchable = true,
  searchPlaceholder = "Tabloda ara...",
  searchKeys,
  filters = [],
  onAdd,
  addLabel = "+ Yeni Ekle",
  onEdit,
  onDelete,
  deleteConfirmTitle = "Kaydi Sil",
  deleteConfirmDescription,
  onReorder,
  keyExtractor,
  emptyTitle = "Kayit bulunamadi",
  emptyDescription = "Listelenecek herhangi bir veri kaydi mevcut degil.",
  pageSize = 25,
  className = "",
  headerAction,
  renderCustomRowActions,
}: AdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Deletion confirmation state
  const [itemToDelete, setItemToDelete] = useState<{ item: T; index: number } | null>(null);

  // Filter change handler
  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === "ALL") {
        delete next[filterKey];
      } else {
        next[filterKey] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };

  // Sorting toggle handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Process data with original indices retained for mutators
  const indexedData = useMemo(() => {
    return data.map((item, originalIndex) => ({
      ...item,
      __originalIndex: originalIndex,
    }));
  }, [data]);

  // Filtered and Searched Data
  const processedData = useMemo(() => {
    return indexedData.filter((item) => {
      // 1. Dropdown Filters
      for (const [filterKey, filterVal] of Object.entries(activeFilters)) {
        if (!filterVal || filterVal === "ALL") continue;
        const itemVal = String(item[filterKey] ?? "").toLowerCase();
        if (itemVal !== filterVal.toLowerCase()) {
          return false;
        }
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const normalizedQuery = searchQuery.trim().toLocaleLowerCase("tr-TR");

      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = item[k as keyof T];
          if (val === null || val === undefined) return false;
          return String(val).toLocaleLowerCase("tr-TR").includes(normalizedQuery);
        });
      }

      // Default: search all string / number fields
      return Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "object") return false;
        return String(val).toLocaleLowerCase("tr-TR").includes(normalizedQuery);
      });
    });
  }, [indexedData, activeFilters, searchQuery, searchKeys]);

  // Sorted Data (Turkish collation aware)
  const sortedData = useMemo(() => {
    if (!sortKey) return processedData;

    return [...processedData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      const comparison = turkishCompare(valA, valB);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [processedData, sortKey, sortDirection]);

  // Paginated slices
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const hasActiveFilters = searchQuery.length > 0 || Object.keys(activeFilters).length > 0;

  return (
    <div className={`rounded-none border border-[#1A1A1A] bg-[#000000] overflow-hidden shadow-xl ${className}`}>
      {/* Table Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-[#1A1A1A] bg-[#0A0A0A] flex flex-col gap-4">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {(title || icon) && (
              <div className="flex items-center gap-2.5">
                {icon && <div className="text-[#FF7800]">{icon}</div>}
                {title && (
                  <h3 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                    {title}
                    <Badge variant="outline" className="border-[#1A1A1A] text-zinc-400 font-mono text-[10px] px-1.5 py-0 rounded-none bg-[#000000]">
                      {data.length}
                    </Badge>
                  </h3>
                )}
              </div>
            )}
            {subtitle && <p className="text-xs text-zinc-400 mt-1 leading-normal">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {headerAction}
            {onAdd && (
              <Button
                type="button"
                size="sm"
                onClick={onAdd}
                className="bg-[#FF7800] hover:bg-[#ff8a1e] text-black font-semibold text-xs tracking-wider uppercase h-8 px-3.5 transition-all shadow-[0_0_15px_rgba(255,120,0,0.2)] rounded-none"
              >
                <Plus className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
                {addLabel.replace(/^\+\s*/, "")}
              </Button>
            )}
          </div>
        </div>

        {/* Search & Filters Controls */}
        {(searchable || filters.length > 0) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            {searchable && (
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="bg-[#000000] border-[#1A1A1A] pl-8 pr-8 text-xs text-zinc-200 placeholder:text-zinc-500 h-8 rounded-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Custom Dropdown Filters */}
            {filters.map((filter) => {
              const filterKeyStr = String(filter.key);
              const currentValue = activeFilters[filterKeyStr] || "ALL";

              return (
                <div key={filterKeyStr} className="min-w-[140px]">
                  <Select
                    value={currentValue}
                    onValueChange={(val) => handleFilterChange(filterKeyStr, val)}
                  >
                    <SelectTrigger className="bg-[#000000] border-[#1A1A1A] text-xs text-zinc-300 h-8 rounded-none">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-[#1A1A1A] text-zinc-200 rounded-none">
                      <SelectItem value="ALL">{filter.allLabel || `Tumu (${filter.label})`}</SelectItem>
                      {filter.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters({});
                  setCurrentPage(1);
                }}
                className="text-xs text-zinc-400 hover:text-white h-8 px-2.5 rounded-none"
              >
                Temizle
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Table Surface */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#1A1A1A] bg-[#0A0A0A] text-zinc-400 font-mono tracking-wider text-[11px] uppercase">
              {onReorder && <th className="py-2.5 px-3 w-12 text-center">Sira</th>}
              {columns.map((col, cIdx) => (
                <th
                  key={String(col.key) || cIdx}
                  style={col.width ? { width: col.width } : undefined}
                  className={`py-2.5 px-3.5 select-none font-medium ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(String(col.key))}
                      className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] inline-flex items-center gap-1.5 hover:text-orange-400 transition-colors focus:outline-none py-1 px-1.5 -my-1 -mx-1.5 rounded"
                    >
                      <span>{col.title}</span>
                      {sortKey === String(col.key) ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-[#FF7800]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-[#FF7800]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                      )}
                    </button>
                  ) : (
                    col.title
                  )}
                </th>
              ))}
              {(onEdit || onDelete || renderCustomRowActions) && (
                <th className="py-2.5 px-3.5 text-right w-24">Islemler</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (onReorder ? 1 : 0) +
                    (onEdit || onDelete || renderCustomRowActions ? 1 : 0)
                  }
                  className="p-8"
                >
                  <EmptyState
                    title={hasActiveFilters ? "Filtrelere uygun sonuc bulunamadi" : emptyTitle}
                    description={
                      hasActiveFilters
                        ? "Arama veya filtre kriterlerini temizleyerek tekrar deneyebilirsiniz."
                        : emptyDescription
                    }
                    actionLabel={!hasActiveFilters && onAdd ? addLabel.replace(/^\+\s*/, "") : undefined}
                    onAction={!hasActiveFilters && onAdd ? onAdd : undefined}
                    secondaryActionLabel={hasActiveFilters ? "Filtreleri Sifirla" : undefined}
                    onSecondaryAction={
                      hasActiveFilters
                        ? () => {
                            setSearchQuery("");
                            setActiveFilters({});
                          }
                        : undefined
                    }
                    compact
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => {
                const originalIdx =
                  typeof (item as { __originalIndex?: number }).__originalIndex === "number"
                    ? (item as { __originalIndex: number }).__originalIndex
                    : rowIdx;
                const itemId =
                  "id" in item && (typeof item.id === "string" || typeof item.id === "number")
                    ? String(item.id)
                    : undefined;
                const itemCode =
                  "code" in item && typeof item.code === "string" ? item.code : undefined;
                const rowKey = keyExtractor
                  ? keyExtractor(item, originalIdx)
                  : itemId || itemCode || originalIdx;

                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-[#0A0A0A] transition-colors group"
                  >
                    {/* Reorder Buttons */}
                    {onReorder && (
                      <td className="py-2.5 px-2 text-center w-12">
                        <div className="flex flex-col items-center gap-1 sm:gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            disabled={originalIdx === 0}
                            onClick={() => onReorder(originalIdx, originalIdx - 1)}
                            className="flex items-center justify-center min-h-[44px] min-w-[36px] sm:min-h-[28px] sm:min-w-[28px] p-0.5 text-zinc-500 hover:text-orange-400 disabled:opacity-20 disabled:hover:text-zinc-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7800] rounded-none transition-colors"
                            title="Yukari tasi"
                            aria-label="Yukari tasi"
                          >
                            <ChevronUp className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={originalIdx === data.length - 1}
                            onClick={() => onReorder(originalIdx, originalIdx + 1)}
                            className="flex items-center justify-center min-h-[44px] min-w-[36px] sm:min-h-[28px] sm:min-w-[28px] p-0.5 text-zinc-500 hover:text-orange-400 disabled:opacity-20 disabled:hover:text-zinc-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7800] rounded-none transition-colors"
                            title="Asagi tasi"
                            aria-label="Asagi tasi"
                          >
                            <ChevronDown className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      </td>
                    )}

                    {/* Columns Render */}
                    {columns.map((col, cIdx) => (
                      <td
                        key={String(col.key) || cIdx}
                        className={`py-2.5 px-3.5 text-zinc-200 align-middle ${
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                            ? "text-center"
                            : "text-left"
                        } ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(item, originalIdx)
                          : String(item[col.key as keyof T] ?? "")}
                      </td>
                    ))}

                    {/* Row Actions */}
                    {(onEdit || onDelete || renderCustomRowActions) && (
                      <td className="py-2.5 px-3.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          {renderCustomRowActions && renderCustomRowActions(item, originalIdx)}

                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(item, originalIdx)}
                              className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] inline-flex items-center justify-center p-1 rounded-none text-zinc-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
                              title="Duzenle"
                              aria-label="Duzenle"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => setItemToDelete({ item, index: originalIdx })}
                              className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] inline-flex items-center justify-center p-1 rounded-none text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                              title="Sil"
                              aria-label="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      {sortedData.length > 0 && (
        <div className="p-3 px-4 border-t border-[#1A1A1A] bg-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
          <div>
            Toplam {sortedData.length} kayit {hasActiveFilters && `(${data.length} icinden filtrelendi)`}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="border-[#1A1A1A] bg-[#000000] text-xs text-zinc-300 hover:text-white h-7 px-2.5 rounded-none"
              >
                Onceki
              </Button>
              <span className="text-zinc-400 text-xs px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="border-[#1A1A1A] bg-[#000000] text-xs text-zinc-300 hover:text-white h-7 px-2.5 rounded-none"
              >
                Sonraki
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && onDelete && (
        <ConfirmDialog
          open={!!itemToDelete}
          onOpenChange={(open) => {
            if (!open) setItemToDelete(null);
          }}
          title={deleteConfirmTitle}
          description={
            deleteConfirmDescription
              ? deleteConfirmDescription(itemToDelete.item)
              : "Bu kaydi kalici olarak silmek istediginizden emin misiniz? Yapilan degisiklik kaydedilene kadar 'Geri Al' ile geri alinabilir."
          }
          confirmLabel="Sil"
          cancelLabel="Iptal"
          variant="danger"
          onConfirm={() => {
            onDelete(itemToDelete.item, itemToDelete.index);
            setItemToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminDataTable;

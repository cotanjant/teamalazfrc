"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect, createContext, useContext } from "react";
import initialCollectionData from "@/data/collection.json";
import { getAdminSessionToken } from "@/components/admin/AdminGuard";
import type { SiteCollection } from "@/data/collection";
import { reorderArray } from "./utils/arrayUtils";
import { computeCollectionDiff, type CollectionDiffResult } from "./diff/collectionDiff";
import { pureMutators, createAdminUpdaters } from "./mutators/pureMutators";
import { handleSaveData, type SaveDataOptions, type SaveDataResult } from "./services/adminPersistence";

export { reorderArray };
export { computeCollectionDiff, type CollectionDiffResult };
export { pureMutators };
export { handleSaveData, type SaveDataOptions, type SaveDataResult };

/**
 * Internal React Hook for Admin Dashboard state management.
 */
export function useAdminStoreInternal(initial?: SiteCollection) {
  const defaultCollection = useMemo(
    () => initial || (initialCollectionData as unknown as SiteCollection),
    [initial]
  );

  const [data, setData] = useState<SiteCollection>(defaultCollection);
  const [baseline, setBaseline] = useState<SiteCollection>(defaultCollection);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const diff = useMemo(() => computeCollectionDiff(baseline, data), [baseline, data]);
  const resetChanges = useCallback(() => setData(baseline), [baseline]);

  const saveData = useCallback(async (): Promise<boolean> => {
    if (isSavingRef.current) return false;
    isSavingRef.current = true;
    const token = getAdminSessionToken();

    setIsSaving(true);
    setSaveStatus("idle");
    setStatusMessage("");

    try {
      const result = await handleSaveData({ data, token });
      setIsSaving(false);
      setSaveStatus(result.saveStatus);
      setStatusMessage(result.statusMessage);

      if (result.success) {
        setBaseline(data);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setSaveStatus("idle");
          setStatusMessage("");
        }, 5000);
        return true;
      }
      return false;
    } finally {
      isSavingRef.current = false;
    }
  }, [data]);

  const updaters = useMemo(() => createAdminUpdaters(setData), []);

  return {
    data,
    setData,
    baseline,
    setBaseline,
    isDirty: diff.isDirty,
    hasUnsavedChanges: diff.hasUnsavedChanges,
    changedFieldsCount: diff.changedFieldsCount,
    changedSections: diff.changedSections,
    isSaving,
    saveStatus,
    statusMessage,
    resetChanges,
    saveData,
    ...updaters,
  };
}

export type AdminStoreContextType = ReturnType<typeof useAdminStoreInternal>;

export const AdminStoreContext = createContext<AdminStoreContextType | null>(null);

export interface AdminStoreProviderProps {
  children: React.ReactNode;
  initial?: SiteCollection;
}

/**
 * Single source of truth context provider for all Admin tabs and pages.
 */
export function AdminStoreProvider({ children, initial }: AdminStoreProviderProps) {
  const store = useAdminStoreInternal(initial);
  return React.createElement(AdminStoreContext.Provider, { value: store }, children);
}

/**
 * Consumes the shared AdminStoreContext.
 * Throws a clear error if invoked outside AdminStoreProvider.
 */
export function useAdminStore(_initial?: SiteCollection): AdminStoreContextType {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error("useAdminStore must be used within an AdminStoreProvider");
  }
  return context;
}

export default useAdminStore;

import type { SiteCollection } from "@/data/collection";

export interface CollectionDiffResult {
  isDirty: boolean;
  hasUnsavedChanges: boolean;
  changedSections: (keyof SiteCollection)[];
  changedFieldsCount: number;
  details: Partial<Record<keyof SiteCollection, { baseline: unknown; current: unknown }>>;
}

/**
 * Computes deep differences between baseline and current SiteCollection.
 */
export function computeCollectionDiff(
  baseline: SiteCollection,
  current: SiteCollection
): CollectionDiffResult {
  const sections = Object.keys(baseline) as (keyof SiteCollection)[];
  const changedSections: (keyof SiteCollection)[] = [];
  const details: Partial<Record<keyof SiteCollection, { baseline: unknown; current: unknown }>> = {};
  let changedFieldsCount = 0;

  for (const section of sections) {
    const baseVal = baseline[section];
    const currVal = current[section];

    const baseJson = JSON.stringify(baseVal);
    const currJson = JSON.stringify(currVal);

    if (baseJson !== currJson) {
      changedSections.push(section);
      details[section] = { baseline: baseVal, current: currVal };

      // Calculate granular sub-field changes if both are objects
      if (
        typeof baseVal === "object" &&
        baseVal !== null &&
        typeof currVal === "object" &&
        currVal !== null
      ) {
        if (Array.isArray(baseVal) && Array.isArray(currVal)) {
          // Array length delta or item level changes
          const maxLen = Math.max(baseVal.length, currVal.length);
          let arrayDiffs = 0;
          for (let i = 0; i < maxLen; i++) {
            if (JSON.stringify(baseVal[i]) !== JSON.stringify(currVal[i])) {
              arrayDiffs++;
            }
          }
          changedFieldsCount += Math.max(1, arrayDiffs);
        } else {
          // Object key comparison
          const bObj = baseVal as unknown as Record<string, unknown>;
          const cObj = currVal as unknown as Record<string, unknown>;
          const allKeys = new Set([
            ...Object.keys(bObj),
            ...Object.keys(cObj),
          ]);
          let objDiffs = 0;
          for (const k of allKeys) {
            const b = bObj[k];
            const c = cObj[k];
            if (JSON.stringify(b) !== JSON.stringify(c)) {
              objDiffs++;
            }
          }
          changedFieldsCount += Math.max(1, objDiffs);
        }
      } else {
        changedFieldsCount++;
      }
    }
  }

  const isDirty = changedSections.length > 0;

  return {
    isDirty,
    hasUnsavedChanges: isDirty,
    changedSections,
    changedFieldsCount,
    details,
  };
}

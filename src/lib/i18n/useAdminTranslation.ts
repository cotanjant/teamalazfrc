"use client";

import { useCallback } from "react";
import trLocale from "@/locales/admin/tr.json";

/**
 * Recursive type that generates dot-notated paths for all leaf string keys in an object.
 */
type Leaves<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${Leaves<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : "";

/**
 * Union of all valid dot-notated translation keys inferred directly from tr.json.
 * Also allows string literals for runtime flexibility with autocomplete retention.
 */
export type AdminTranslationKey = Leaves<typeof trLocale> | (string & {});

/**
 * Retrieves a nested value from an object using a dot-separated path.
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  if (!obj || !path) return undefined;
  const segments = path.split(".");
  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

/**
 * Replaces `{param}` and `{{param}}` interpolation tokens with provided values.
 */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params || !template) return template;
  return template.replace(/\{(\w+)\}|\{\{(\w+)\}\}/g, (_, p1, p2) => {
    const key = p1 || p2;
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

/**
 * Static translation function for use outside of React component lifecycle.
 */
export function getAdminTranslation(
  key: AdminTranslationKey,
  params?: Record<string, string | number>,
  fallback?: string
): string {
  const value = getNestedValue(trLocale as Record<string, unknown>, key);

  if (typeof value === "string") {
    return interpolate(value, params);
  }

  if (value !== undefined && value !== null) {
    return String(value);
  }

  return fallback !== undefined ? fallback : key;
}

/**
 * React Hook for type-safe Turkish translation lookups in Admin components.
 *
 * @example
 * const { t } = useAdminTranslation();
 * const title = t("homeStats.heroTitle");
 * const greeting = t("tour.welcomeTitle");
 */
export function useAdminTranslation() {
  const t = useCallback(
    (
      key: AdminTranslationKey,
      params?: Record<string, string | number>,
      fallback?: string
    ): string => {
      return getAdminTranslation(key, params, fallback);
    },
    []
  );

  return {
    t,
    locale: "tr-TR" as const,
    messages: trLocale,
  };
}

export default useAdminTranslation;

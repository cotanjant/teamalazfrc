import type { SiteCollection } from "@/data/collection";
import { getAdminTranslation } from "@/lib/i18n/useAdminTranslation";

export interface SaveDataOptions {
  data: SiteCollection;
  token?: string | null;
  fetchFn?: typeof fetch;
  targetPath?: string;
}

export interface SaveDataResult {
  success: boolean;
  saveStatus: "idle" | "success" | "error";
  statusMessage: string;
  resData?: Record<string, unknown>;
}

/**
 * Handles communication with /api/github-proxy with auth check, json packaging and translation.
 * Token is optional since authentication is primarily handled via httpOnly cookie on same-origin.
 */
export async function handleSaveData(options: SaveDataOptions): Promise<SaveDataResult> {
  const { data, token, fetchFn = fetch, targetPath = "src/data/collection.json" } = options;

  try {
    const jsonString = JSON.stringify(data, null, 2) + "\n";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetchFn("/api/github-proxy", {
      method: "POST",
      headers,
      credentials: "same-origin",
      body: JSON.stringify({
        action: "save-file",
        path: targetPath,
        content: jsonString,
        encoding: "utf-8",
        message: "Update site collection via Admin CMS",
      }),
    });

    const resData = (await res.json()) as Record<string, unknown>;

    if (!res.ok || !resData.success) {
      return {
        success: false,
        saveStatus: "error",
        statusMessage:
          (resData.error as string) ||
          getAdminTranslation("errors.saveFailed", undefined, "Failed to commit changes."),
        resData,
      };
    }

    return {
      success: true,
      saveStatus: "success",
      statusMessage:
        (resData.message as string) ||
        getAdminTranslation("common.saved", undefined, "Changes published successfully!"),
      resData,
    };
  } catch {
    return {
      success: false,
      saveStatus: "error",
      statusMessage: getAdminTranslation(
        "errors.networkError",
        undefined,
        "Network failure while contacting save API."
      ),
    };
  }
}

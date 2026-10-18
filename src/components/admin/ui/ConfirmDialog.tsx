"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, Trash2, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

/**
 * Radix UI-based confirmation modal to prevent accidental deletions, resets, or destructive actions.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Iptal",
  variant = "danger",
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = isLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Modal Content */}
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-none border border-[#1A1A1A] bg-[#000000] p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none"
        >
          <div className="flex items-start gap-4">
            {/* Visual Icon Container */}
            <div
              className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 ${
                variant === "danger"
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  : variant === "warning"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-orange-500/10 text-[#FF7800] border border-orange-500/20"
              }`}
            >
              {variant === "danger" ? (
                <Trash2 className="w-5 h-5" />
              ) : variant === "warning" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-1.5 flex-1 pr-4">
              <DialogPrimitive.Title className="text-base font-semibold text-zinc-100 tracking-tight">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-zinc-400 leading-relaxed">
                {description}
              </DialogPrimitive.Description>
            </div>

            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-none opacity-70 transition-opacity hover:opacity-100 text-zinc-400 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7800]"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[#1A1A1A]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto border-[#262626] bg-[#000000] text-xs text-zinc-300 hover:text-white hover:bg-[#141414] h-10 sm:h-9 px-4 rounded-none"
            >
              {cancelLabel}
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={loading}
              onClick={handleConfirm}
              className={`w-full sm:w-auto text-xs font-semibold h-10 sm:h-9 px-5 transition-all rounded-none ${
                variant === "danger"
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.25)]"
                  : variant === "warning"
                  ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  : "bg-[#FF7800] hover:bg-[#ff8a1e] text-black font-semibold shadow-[0_0_15px_rgba(255,120,0,0.25)]"
              }`}
            >
              {loading ? "Isleniyor..." : confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default ConfirmDialog;

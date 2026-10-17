import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
  className?: string;
}

/**
 * Reusable Empty State component with ALAZ Phoenix aesthetic.
 * Guides the user with actionable next steps when a table or collection has zero records.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  compact = false,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-none border border-dashed border-[#1A1A1A] bg-[#000000] flex flex-col items-center justify-center text-center transition-colors ${
        compact ? "py-6 px-4" : "py-12 px-6"
      } ${className}`}
    >
      <div className="w-11 h-11 rounded-none bg-[#FF7800]/10 border border-[#FF7800]/20 flex items-center justify-center text-[#FF7800] mb-3 shadow-[0_0_20px_rgba(255,120,0,0.08)]">
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs text-zinc-400 mt-1 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 mt-4">
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSecondaryAction}
              className="border-[#1A1A1A] bg-[#000000] text-xs text-zinc-300 hover:text-white hover:bg-[#141414] h-8 px-3 rounded-none"
            >
              {secondaryActionLabel}
            </Button>
          )}

          {actionLabel && onAction && (
            <Button
              type="button"
              size="sm"
              onClick={onAction}
              className="bg-[#FF7800] hover:bg-[#ff8a1e] text-black font-semibold text-xs tracking-wider uppercase h-8 px-4 transition-all shadow-[0_0_15px_rgba(255,120,0,0.2)] rounded-none"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;

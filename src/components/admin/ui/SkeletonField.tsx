import React from "react";

export interface SkeletonFieldProps {
  variant?: "text" | "input" | "card" | "table-row" | "badge" | "button";
  count?: number;
  className?: string;
}

/**
 * Skeleton loading placeholder with ALAZ Phoenix dark tech styling.
 */
export function SkeletonField({
  variant = "text",
  count = 1,
  className = "",
}: SkeletonFieldProps) {
  const items = Array.from({ length: Math.max(1, count) });

  const renderSkeleton = (key: number) => {
    switch (variant) {
      case "input":
        return (
          <div
            key={key}
            className={`h-9 w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-none animate-pulse ${className}`}
          />
        );
      case "card":
        return (
          <div
            key={key}
            className={`p-5 rounded-none border border-[#1A1A1A] bg-[#000000] space-y-4 animate-pulse ${className}`}
          >
            <div className="h-4 w-1/3 bg-[#1A1A1A] rounded-none" />
            <div className="h-3 w-3/4 bg-[#141414] rounded-none" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-8 bg-[#0A0A0A] rounded-none border border-[#1A1A1A]" />
              <div className="h-8 bg-[#0A0A0A] rounded-none border border-[#1A1A1A]" />
            </div>
          </div>
        );
      case "table-row":
        return (
          <tr key={key} className="border-b border-[#1A1A1A] animate-pulse">
            <td className="py-3 px-4 w-12">
              <div className="h-3 w-6 bg-[#1A1A1A] rounded-none" />
            </td>
            <td className="py-3 px-4">
              <div className="h-3.5 w-32 bg-[#1A1A1A] rounded-none" />
            </td>
            <td className="py-3 px-4">
              <div className="h-3 w-48 bg-[#141414] rounded-none" />
            </td>
            <td className="py-3 px-4 w-28">
              <div className="h-5 w-20 bg-[#1A1A1A] rounded-none" />
            </td>
            <td className="py-3 px-4 w-24 text-right">
              <div className="h-7 w-16 bg-[#1A1A1A] rounded-none ml-auto" />
            </td>
          </tr>
        );
      case "badge":
        return (
          <div
            key={key}
            className={`h-5 w-16 rounded-none bg-[#1A1A1A] animate-pulse ${className}`}
          />
        );
      case "button":
        return (
          <div
            key={key}
            className={`h-9 w-24 rounded-none bg-[#1A1A1A] border border-[#222222] animate-pulse ${className}`}
          />
        );
      case "text":
      default:
        return (
          <div
            key={key}
            className={`h-4 w-full bg-[#141414] rounded-none animate-pulse ${className}`}
          />
        );
    }
  };

  if (variant === "table-row") {
    return <>{items.map((_, i) => renderSkeleton(i))}</>;
  }

  return (
    <div className="space-y-2.5 w-full">
      {items.map((_, i) => renderSkeleton(i))}
    </div>
  );
}

export default SkeletonField;

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF7800] rounded-none border",
  {
    variants: {
      variant: {
        default:
          "border-[#FF7800]/40 bg-[#FF7800]/10 text-[#FF7800]",
        secondary:
          "border-[#1A1A1A] bg-[#141414] text-[#A0A0A0]",
        destructive:
          "border-[#E83A0A]/40 bg-[#E83A0A]/10 text-[#E83A0A]",
        outline:
          "border-[#1A1A1A] text-[#E8E8E8] bg-transparent",
        accent:
          "border-[#FFD21C]/40 bg-[#FFD21C]/10 text-[#FFD21C]",
        solid:
          "border-[#FF7800] bg-[#FF7800] text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

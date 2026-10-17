import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full border border-[#1A1A1A] bg-[#0A0A0A] px-3 py-2 text-sm text-[#E8E8E8] placeholder:text-[#666666] font-mono rounded-none transition-colors focus-visible:outline-none focus-visible:border-[#FF7800] focus-visible:ring-1 focus-visible:ring-[#FF7800] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

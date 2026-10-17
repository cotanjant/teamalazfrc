import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-mono font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7800] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer rounded-none border",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF7800] text-black border-[#FF7800] hover:bg-[#FFD21C] hover:border-[#FFD21C] hover:text-black",
        destructive:
          "bg-[#E83A0A] text-white border-[#E83A0A] hover:bg-[#C92A0A] hover:border-[#C92A0A]",
        outline:
          "border-[#1A1A1A] bg-transparent text-[#E8E8E8] hover:border-[#FF7800] hover:text-[#FF7800] hover:bg-[#0A0A0A]",
        secondary:
          "bg-[#141414] text-[#E8E8E8] border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#333333]",
        ghost:
          "border-transparent text-[#E8E8E8] hover:bg-[#141414] hover:text-[#FF7800]",
        link:
          "border-transparent text-[#FF7800] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

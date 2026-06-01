"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D084] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07120F] disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "btn-gradient text-white",
        destructive:
          "bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/25 hover:bg-[#F87171]/25",
        outline:
          "border border-white/12 bg-white/5 text-[#F8FAFC] hover:bg-white/10 hover:border-white/20 backdrop-blur-sm",
        secondary:
          "bg-white/8 text-[#F8FAFC] hover:bg-white/12 border border-white/10",
        ghost:
          "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/8",
        link:
          "text-[#00D084] underline-offset-4 hover:underline p-0 h-auto",
        gold:
          "gradient-gold text-[#07120F] font-bold shadow-[0_4px_24px_rgba(245,196,81,0.3)]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm:      "h-8 rounded-lg px-3 text-xs",
        lg:      "h-13 rounded-xl px-7 text-base",
        xl:      "h-14 rounded-2xl px-10 text-lg",
        icon:    "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
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

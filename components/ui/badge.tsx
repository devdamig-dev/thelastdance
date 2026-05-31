import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#00875a] text-white",
        secondary:
          "border-transparent bg-[#1a1a1a] text-gray-300",
        destructive:
          "border-transparent bg-red-600 text-white",
        outline:
          "text-gray-300 border-white/20",
        success:
          "border-transparent bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
        warning:
          "border-transparent bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
        info:
          "border-transparent bg-blue-600/20 text-blue-400 border-blue-600/30",
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

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3",
          "text-sm text-[#F8FAFC] placeholder:text-[#475569]",
          "backdrop-blur-sm",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:border-[#00D084] focus-visible:ring-3 focus-visible:ring-[#00D084]/20 focus-visible:bg-white/8",
          "hover:border-white/18 hover:bg-white/8",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

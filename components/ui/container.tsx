import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Narrower max-width for content-focused pages */
  size?: "default" | "narrow" | "wide";
}

const SIZE_MAP = {
  narrow:  "max-w-3xl",   // ~768px
  default: "max-w-[1120px]",
  wide:    "max-w-[1280px]",
};

/**
 * Global page container — premium centered layout.
 * padding-inline: 20px mobile · 32px tablet · 40px desktop
 */
export function Container({ size = "default", className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-5 sm:px-8 lg:px-10",
        SIZE_MAP[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

export function Container({ size = "default", className, children, ...props }: ContainerProps) {
  const maxW = size === "narrow" ? "768px" : size === "wide" ? "1280px" : "1120px";
  return (
    <div
      className={cn("w-full mx-auto px-5 sm:px-8 lg:px-10", className)}
      style={{ maxWidth: maxW }}
      {...props}
    >
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, { from: string; to: string }> = {
  green:  { from: "#00D084", to: "#007A4D" },
  blue:   { from: "#3B82F6", to: "#1D4ED8" },
  purple: { from: "#A855F7", to: "#7C3AED" },
  gold:   { from: "#F5C451", to: "#D4A017" },
  red:    { from: "#F87171", to: "#DC2626" },
  cyan:   { from: "#22D3EE", to: "#0891B2" },
  orange: { from: "#FB923C", to: "#EA580C" },
  pink:   { from: "#F472B6", to: "#DB2777" },
};

const SIZE_MAP = {
  xs:  "w-6 h-6 text-[10px]",
  sm:  "w-8 h-8 text-xs",
  md:  "w-10 h-10 text-sm",
  lg:  "w-12 h-12 text-base",
  xl:  "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl",
};

interface UserAvatarProps {
  name: string;
  colorId?: string | null;
  size?: keyof typeof SIZE_MAP;
  className?: string;
  showRing?: boolean;
}

export function UserAvatar({
  name,
  colorId,
  size = "md",
  className,
  showRing = false,
}: UserAvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase() ?? "?";
  const color = COLOR_MAP[colorId ?? "green"] ?? COLOR_MAP.green;

  return (
    <div
      className={cn(
        SIZE_MAP[size],
        "rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 shadow-md",
        showRing && "ring-2 ring-[#00D084]/40",
        className
      )}
      style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
    >
      {initial}
    </div>
  );
}

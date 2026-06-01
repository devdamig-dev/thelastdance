import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "green" | "blue" | "yellow" | "purple" | "red";
  trend?: { value: number; label: string };
}

const colorMap = {
  green: {
    icon:    "text-[#00D084]",
    iconBg:  "bg-[#00D084]/12",
    value:   "text-[#00D084]",
    glow:    "shadow-[0_0_20px_rgba(0,208,132,0.1)]",
    accent:  "border-t-[#00D084]",
  },
  blue: {
    icon:    "text-[#60A5FA]",
    iconBg:  "bg-[#60A5FA]/12",
    value:   "text-[#60A5FA]",
    glow:    "shadow-[0_0_20px_rgba(96,165,250,0.1)]",
    accent:  "border-t-[#60A5FA]",
  },
  yellow: {
    icon:    "text-[#F5C451]",
    iconBg:  "bg-[#F5C451]/12",
    value:   "text-[#F5C451]",
    glow:    "shadow-[0_0_20px_rgba(245,196,81,0.12)]",
    accent:  "border-t-[#F5C451]",
  },
  purple: {
    icon:    "text-[#C084FC]",
    iconBg:  "bg-[#C084FC]/12",
    value:   "text-[#C084FC]",
    glow:    "shadow-[0_0_20px_rgba(192,132,252,0.1)]",
    accent:  "border-t-[#C084FC]",
  },
  red: {
    icon:    "text-[#F87171]",
    iconBg:  "bg-[#F87171]/12",
    value:   "text-[#F87171]",
    glow:    "shadow-[0_0_20px_rgba(248,113,113,0.1)]",
    accent:  "border-t-[#F87171]",
  },
};

export function StatsCard({ title, value, subtitle, icon: Icon, color = "green", trend }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div className={cn(
      "relative rounded-2xl p-4 border border-white/8 overflow-hidden transition-all duration-200 hover:border-white/14",
      "bg-gradient-to-br from-white/7 to-white/3",
      c.glow
    )}>
      {/* Top accent line */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", c.accent)} style={{ background: `linear-gradient(90deg, transparent, currentColor 40%, currentColor 60%, transparent)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", c.iconBg)}>
          <Icon className={cn("w-4.5 h-4.5", c.icon)} />
        </div>
        {trend && (
          <span className={cn(
            "text-[11px] font-semibold px-2 py-0.5 rounded-full",
            trend.value > 0 ? "bg-[#00D084]/12 text-[#00D084]" : "bg-white/8 text-[#94A3B8]"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value} {trend.label}
          </span>
        )}
      </div>

      <div className={cn("text-2xl font-black mb-0.5 tabular-nums", c.value)}>
        {value}
      </div>
      <div className="text-sm font-semibold text-[#F8FAFC] leading-tight">{title}</div>
      {subtitle && (
        <div className="text-[11px] text-[#94A3B8] mt-0.5">{subtitle}</div>
      )}
    </div>
  );
}

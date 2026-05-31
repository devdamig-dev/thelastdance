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
    bg: "bg-emerald-400/10",
    icon: "text-emerald-400",
    value: "text-emerald-400",
  },
  blue: {
    bg: "bg-blue-400/10",
    icon: "text-blue-400",
    value: "text-blue-400",
  },
  yellow: {
    bg: "bg-yellow-400/10",
    icon: "text-yellow-400",
    value: "text-yellow-400",
  },
  purple: {
    bg: "bg-purple-400/10",
    icon: "text-purple-400",
    value: "text-purple-400",
  },
  red: {
    bg: "bg-red-400/10",
    icon: "text-red-400",
    value: "text-red-400",
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "green",
  trend,
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className="gradient-card rounded-xl border border-white/10 p-4">
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            colors.bg
          )}
        >
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.value > 0
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-gray-400/10 text-gray-400"
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value} {trend.label}
          </span>
        )}
      </div>
      <div className={cn("text-2xl font-black mb-1", colors.value)}>
        {value}
      </div>
      <div className="text-sm font-medium text-white">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
    </div>
  );
}

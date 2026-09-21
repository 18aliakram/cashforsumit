import React from "react";
import { cn, getStatusBadgeColor } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string;
  variant?: "default" | "outline" | "solid";
  size?: "sm" | "md";
}

export function Badge({ status, variant = "default", size = "md", children, className, ...props }: BadgeProps) {
  let colors = { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };
  if (status) {
    colors = getStatusBadgeColor(status);
  }

  const sizeStyles = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors font-medium",
        sizeStyles,
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {children || status}
    </span>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getStatusBadgeColor(status: string): { bg: string; text: string; border: string } {
  switch (status.toUpperCase()) {
    case "NEW":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    case "UNDER_REVIEW":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    case "CONTACTED":
      return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
    case "OFFER_MADE":
    case "NEGOTIATING":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
    case "ACCEPTED":
    case "AVAILABLE":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    case "DECLINED":
    case "CANCELLED":
    case "WITHDRAWN":
      return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" };
    case "PENDING":
      return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" };
    case "SOLD":
    case "CLOSED":
    case "ARCHIVED":
      return { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };
    default:
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" };
  }
}

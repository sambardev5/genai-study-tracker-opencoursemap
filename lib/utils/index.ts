import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatHours(hours?: number | null) {
  if (hours == null || hours <= 0) {
    return "Self-guided";
  }

  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }

  return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)} hrs`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDate(value?: string) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getDurationBucket(hours?: number | null) {
  if (hours == null || hours <= 0) {
    return null;
  }

  if (hours <= 4) {
    return "short";
  }

  if (hours <= 12) {
    return "medium";
  }

  return "long";
}

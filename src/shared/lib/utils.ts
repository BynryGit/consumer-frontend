import { clsx, type ClassValue } from "clsx";
import { isValid, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Formats a number as a percentage
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function parseDateString(input: string | Date): Date | null {
  if (input instanceof Date) return input;

  // ISO format (e.g. 2025-06-08)
  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [_, year, month, day] = isoMatch;
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }

  // US format MM/DD/YYYY
  const usMatch = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (usMatch) {
    const [_, month, day, year] = usMatch;
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }

  // EU format DD-MM-YYYY
  const euMatch = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (euMatch) {
    const [_, day, month, year] = euMatch;
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }

  // Fallback to built-in Date parsing
  const fallback = new Date(input);
  if (!isNaN(fallback.getTime())) return fallback;

  return null;
}
export function formatRelativeTime(input: string | Date): string {
  const date = parseDateString(input);
  if (!date) return "Invalid date";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
}

/**
 * Generates a random ID
 */
export function generateId(): number {
  return Math.random();
}

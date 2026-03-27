import { differenceInDays, format, isAfter, isBefore, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(d: Date | string, pattern = "dd MMM yyyy"): string {
  const date = typeof d === "string" ? parseISO(d) : d;
  return format(date, pattern, { locale: fr });
}

export function daysUntil(d: Date | string): number {
  const date = typeof d === "string" ? parseISO(d) : d;
  return differenceInDays(date, new Date());
}

export function isDeadlineSoon(deadline: Date | string, days = 14): boolean {
  const d = typeof deadline === "string" ? parseISO(deadline) : deadline;
  const diff = differenceInDays(d, new Date());
  return diff >= 0 && diff <= days;
}

export function overlapsRange(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return !isBefore(endA, startB) && !isAfter(startA, endB);
}

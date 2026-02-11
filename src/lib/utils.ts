import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function typedEntries<K extends string | number | symbol, V>(
  obj: Partial<Record<K, V>>,
): [K, V][] {
  return Object.entries(obj) as [K, V][];
}

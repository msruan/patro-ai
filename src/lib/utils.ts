import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function purgeChar(str: string, charToRemove: string) {
  return str.split(charToRemove).join("");
}

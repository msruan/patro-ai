import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function purgeChar(str: string, charToRemove: string) {
  return str.split(charToRemove).join("");
}

export function highlightWords(text: string): string {
  // Expressão regular para encontrar todas as ocorrências de **word**
  const regex = /(^|\s)\*\*(.+?)\*\*($|\s)/g;

  // Função de substituição:
  function replacer(match: string, p1: string, p2: string, p3: string) {
    return p1 + "<strong>" + p2 + "</strong>" + p3;
  }

  // Substitui as ocorrências pela tag <strong>
  return text.replace(regex, replacer);
}

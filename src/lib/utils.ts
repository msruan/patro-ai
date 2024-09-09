import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function purgeChar(str: string, charToRemove: string) {
  // Expressão regular para remover todas as ocorrências do caractere
  const regex = new RegExp(charToRemove, "g");
  // Substitui todas as ocorrências por uma string vazia
  return str.replace(regex, "");
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

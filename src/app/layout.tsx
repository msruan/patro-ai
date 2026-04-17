import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import './bg-gradient.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Patro AI",
  description: "Seu melhor pior chatbot!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("gradient-bg", inter.className)}>{children}</body>
    </html>
  );
}

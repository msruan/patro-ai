import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import "./globals.css";
import './bg-gradient.css'
import { RootProvider } from "./providers";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Patro AI",
  description: "Seu chatbot com IA personalizado!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={cn("gradient-bg", inter.className)}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

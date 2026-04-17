import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export function RootProvider({ children }: { children: ReactNode }) {
    return (
        <>
            <Toaster />
            {children}
        </>
    )
}
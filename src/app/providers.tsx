"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "backdrop-blur-xl border border-white/10 bg-popover/95 shadow-lg shadow-black/20 font-sans",
          },
        }}
      />
    </ThemeProvider>
  );
}

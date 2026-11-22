import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "SAFEX Super Admin",
  description: "Enterprise control plane for the SAFEX AI safety management platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(GeistSans.variable, GeistMono.variable)}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

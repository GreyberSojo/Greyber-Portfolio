"use client";

import { ThemeProvider } from "next-themes";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark"]}
    >
      {children}
    </ThemeProvider>
  );
}
import "@/styles/globals.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTopButton from "@/components/ScrollToTopButton";

import { Providers } from "./providers";

export const metadata = {
  title: "Greyber Sojo - Portfolio",
  description: "Portfolio de Greyber Sojo, QA Engineer, Automation, Game Developer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">
            <div className="wrapper">{children}</div>
          </main>
          <ScrollToTopButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { getMessages, Locale } from "@/i18n";

export const metadata = {
  title: "Greyber Sojo - Portfolio",
  description: "Portfolio de Greyber Sojo, QA Engineer, Automation, Game Developer",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale}>
            <Navbar />
            <main className="flex-1">
              <div className="wrapper">{children}</div>
            </main>
            <ScrollToTopButton />
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

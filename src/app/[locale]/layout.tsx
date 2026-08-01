import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono, Unbounded, Wix_Madefor_Display } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../context/ToastContext";
import { SITE_DOMAIN } from "../../lib/siteDomains";
import { routing } from "../../i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

const wixMadeforDisplay = Wix_Madefor_Display({
  variable: "--font-wix-madefor-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_DOMAIN,
  description: "The art of helping — the most modern of the arts",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${wixMadeforDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <NextTopLoader color="#FECC39" showSpinner={false} height={3} />
          <ToastProvider>
            <AuthProvider>
              {children}
              <Footer />
              <Toast />
            </AuthProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

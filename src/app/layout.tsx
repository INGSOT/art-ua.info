import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded, Wix_Madefor_Display } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

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
  title: "art-ua.info",
  description: "The art of helping — the most modern of the arts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${wixMadeforDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextTopLoader color="#FECC39" showSpinner={false} height={3} />
        <ToastProvider>
          <AuthProvider>
            {children}
            <Footer />
            <Toast />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/contexts/I18nContext";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pelita Clinic",
  icons: {
    icon: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/preload.jpeg" fetchPriority="high" />
        <link rel="preload" as="image" href="/logo/logo.png" />
      </head>
      <body className={inter.variable}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

/* ==========================================================================
   Youflix — Root Layout
   Server component. Establishes the HTML shell, fonts, metadata,
   and wraps children with the global Navbar.
   ========================================================================== */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SearchModal from "@/components/SearchModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Youflix — YouTube Shows, Reimagined",
    template: "%s | Youflix",
  },
  description:
    "Experience YouTube creators like never before. Binge-watch your favorite creators as Netflix-style shows with immersive autoplay.",
  keywords: ["Youflix", "YouTube", "shows", "streaming", "creators", "binge"],
  openGraph: {
    title: "Youflix — YouTube Shows, Reimagined",
    description:
      "Experience YouTube creators like never before. Binge-watch your favorite creators as Netflix-style shows.",
    siteName: "Youflix",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">
        <Navbar />
        <main className="flex-1">{children}</main>
        <SearchModal />
      </body>
    </html>
  );
}

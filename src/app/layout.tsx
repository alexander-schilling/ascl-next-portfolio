import type { Metadata } from "next";
import { Figtree, Raleway } from "next/font/google";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${raleway.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background">{children}</body>
    </html>
  );
}

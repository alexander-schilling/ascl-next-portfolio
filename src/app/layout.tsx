import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Alexander | Data Engineering Portfolio",
    template: "%s | Alexander",
  },
  description:
    "Portfolio de Alexander: Data Engineering Tech Lead, arquitectura de sistemas distribuidos y proyectos personales.",
  openGraph: {
    title: "Alexander | Data Engineering Portfolio",
    description:
      "Sistemas a escala, liderazgo técnico y creatividad fuera de la terminal.",
    type: "website",
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexander | Data Engineering Portfolio",
    description:
      "Sistemas a escala, liderazgo técnico y creatividad fuera de la terminal.",
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background">{children}</body>
    </html>
  );
}

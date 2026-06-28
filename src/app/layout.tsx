import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nutanix Bootcamp — Learn by Doing",
  description:
    "Interactive bootcamp for absolute beginners: networking fundamentals through Nutanix Cloud Platform operations. Lessons, labs, command sims, and diagram builders.",
  keywords: [
    "Nutanix",
    "HCI",
    "AHV",
    "Prism",
    "Flow",
    "networking",
    "OSI",
    "VLAN",
    "bootcamp",
    "learn-by-doing",
  ],
  authors: [{ name: "Nutanix Bootcamp" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

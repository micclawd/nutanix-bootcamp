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
  title: "Nutanix Study Companion — Interactive HCI Refresher",
  description:
    "Interactive study companion for the Nutanix Cloud Platform. Built for network engineers refreshing on HCI concepts: flashcards, quizzes, and a network-to-Nutanix bridge guide.",
  keywords: [
    "Nutanix",
    "HCI",
    "AHV",
    "Prism",
    "Flow",
    "DSF",
    "study",
    "refresher",
    "networking",
    "NC2",
  ],
  authors: [{ name: "Nutanix Study Companion" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Nutanix Study Companion",
    description:
      "Interactive refresher on Nutanix Cloud Platform concepts for network engineers.",
    siteName: "Nutanix Study Companion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutanix Study Companion",
    description:
      "Interactive refresher on Nutanix Cloud Platform concepts for network engineers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardShell } from "@/components/layout/DashboardShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neural Core — Persistent Intelligence Layer",
  description:
    "Neural Core is an AI-native operating layer that provides persistent memory, contextual knowledge, autonomous agents, and intelligent tooling for next-generation workflows.",
  keywords: ["AI", "agents", "memory", "knowledge", "Neural Core"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`}>
      <body className="h-full antialiased">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}

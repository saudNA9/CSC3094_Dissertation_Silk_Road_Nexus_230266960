/*
 * app/layout.tsx
 * Root layout for the Silk Road Nexus application.
 * It will:
 * - Load and configure Inter (body) and JetBrains Mono (code) from Google Fonts
 * - Wrap every page in the dark/light ThemeProvider
 * - Export the site-wide metadata and viewport theme-color for SEO and PWA support
 */

import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Silk Road Nexus",
  description:
    "Design and Implementation of an Integrated Data-Driven System for Spatial, Temporal, and Semantic Exploration of Silk Roads Cultural Heritage",
  generator: "v0.app",
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1729" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

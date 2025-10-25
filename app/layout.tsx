import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Connect & Thrive",
  description: "Created by Shubh",
  generator: "shubh",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Suspense fallback={null}>
              {children}
              <Analytics />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

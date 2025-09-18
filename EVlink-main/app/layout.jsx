import React, { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AppProviders } from "@/components/AppProviders"
import "./globals.css"

export const metadata = {
  title: "ChargeConnect - EV Charging Marketplace",
  description: "Connect with EV chargers near you",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <AppProviders>
            {children}
          </AppProviders>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

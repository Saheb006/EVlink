'use client';

import { ThemeProvider } from "@/components/theme-provider"
import { VehicleProvider } from "@/lib/vehicle-context"

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <VehicleProvider>
        {children}
      </VehicleProvider>
    </ThemeProvider>
  )
}

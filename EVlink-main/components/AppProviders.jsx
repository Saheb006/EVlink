'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from "@/components/theme-provider"
import { VehicleProvider } from "@/lib/vehicle-context"

// Simple loading component
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export function AppProviders({ children }) {
  const [isClient, setIsClient] = useState(false);

  // This ensures we're on the client before rendering providers
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <VehicleProvider>
        {children}
      </VehicleProvider>
    </ThemeProvider>
  )
}

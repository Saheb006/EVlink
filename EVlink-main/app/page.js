"use client"

import { AuthProvider, useAuth } from "../lib/auth-context"
import { AuthPage } from "../components/auth/auth-page"
import { EVOwnerDashboard } from "../components/dashboards/ev-owner-dashboard"
import { ChargerOwnerDashboard } from "../components/dashboards/charger-owner-dashboard"
import { VehicleRegistration } from "../components/onboarding/vehicle-registration"
import { ChargingFlow } from "../components/charging/charging-flow"
import { PaymentDashboard } from "../components/charging/payment-dashboard"
import { ActiveCharging } from "../components/charging/active-charging"
import { AnalyticsDashboard } from "../components/analytics/analytics-dashboard"
import { NavigationProvider, useNavigation } from "../lib/navigation-context"
import { useEffect, useMemo } from "react"
import ChargingMapDashboard from "../components/charging/charging-map-dashboard"

function AppContent() {
  const { user, loading } = useAuth()
  const { currentPage } = useNavigation()
  const pendingRole = typeof window !== 'undefined' ? (() => { try { return localStorage.getItem('pending-user-type') } catch { return null } })() : null
  const hashRole = typeof window !== 'undefined' ? (window.location.hash === '#evownerdashbaord' ? 'ev-owner' : (window.location.hash === '#chargerownerdashbaord' ? 'charger-owner' : null)) : null
  const effectiveUserType = hashRole || user?.userType || pendingRole || null

  // Do not force #login if a redirect target is present
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const redirectedFrom = params.get('redirectedFrom')
    if (!window.location.hash && !redirectedFrom) {
      window.location.hash = '#login'
    }
  }, [])

  const isLoginHash = typeof window !== 'undefined' && window.location.hash === '#login'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ChargeConnect...</p>
        </div>
      </div>
    )
  }

  if (!user || isLoginHash) {
    return <AuthPage />
  }

  if (user.userType === "ev-owner" && !user.hasVehicle) {
    return <VehicleRegistration />
  }

  if (currentPage === "charging-flow") {
    return <ChargingFlow />
  }

  if (currentPage === "charging-payment") {
    return <PaymentDashboard />
  }

  if (currentPage === "charging-map") {
    return <ChargingMapDashboard />
  }

  if (currentPage === "charging-active") {
    return <ActiveCharging />
  }

  if (currentPage === "analytics") {
    return (
      <div className="min-h-screen bg-background">
        <AnalyticsDashboard />
      </div>
    )
  }

  // If role unresolved yet, show a brief loader to prevent flicker
  if (!effectiveUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return effectiveUserType === "ev-owner" ? <EVOwnerDashboard /> : <ChargerOwnerDashboard />
}

export default function Home() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  )
}

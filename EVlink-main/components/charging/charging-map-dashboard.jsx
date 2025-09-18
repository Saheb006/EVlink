"use client"

import { useState, useEffect } from "react"
import { DirectionsModal } from "../map/directions-modal"
import { Button } from "../ui/button"
import { Header } from "../ui/header"
import { useNavigation } from "@/lib/navigation-context"
import { BackButton } from "../ui/back-button"

export default function ChargingMapDashboard() {
  const { chargingFlow, navigateTo } = useNavigation()
  const { selectedCharger } = chargingFlow

  const [userLocation, setUserLocation] = useState(null)
  const [reached, setReached] = useState(false)
  const [showDirections, setShowDirections] = useState(true)

  // get browser geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.error("Geolocation error:", err)
      )
    }
  }, [])

  if (!selectedCharger) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No charger selected.</p>
      </div>
    )
  }

  // show directions first
  if (!reached) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="On the Way to Charger" />
        <div className="container mx-auto p-4">
          <DirectionsModal
            isOpen={showDirections}
            onClose={() => setShowDirections(false)}
            charger={selectedCharger}
            userLocation={userLocation}
            onArrived={() => {
              setReached(true)
              setShowDirections(false)
            }}
          />
        </div>
      </div>
    )
  }

  // once arrived, show start charging
  return (
    <div className="min-h-screen bg-background">
      <Header title="Ready to Charge" />
      <div className="container mx-auto p-6 text-center space-y-4">
        <p className="text-lg">Your vehicle has arrived at {selectedCharger.name}.</p>
        <Button
          size="lg"
          onClick={() =>
            navigateTo("charging-active", { step: "charging" })
          }
        >
          Start Charging
        </Button>
      </div>
    </div>
  )
}
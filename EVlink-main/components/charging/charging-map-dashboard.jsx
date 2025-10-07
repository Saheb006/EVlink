"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DirectionsModal } from "../map/directions-modal"
import { Button } from "../ui/button"
import { Header } from "../ui/header"
import { useNavigation } from "@/lib/navigation-context"
import { BackButton } from "../ui/back-button"

export default function ChargingMapDashboard() {
  const { chargingFlow, navigateTo } = useNavigation()
  const router = useRouter()
  const { selectedCharger: contextSelectedCharger } = chargingFlow
  const selectedCharger = contextSelectedCharger || {
    id: "mock-charger-1",
    name: "Mock Charging Station",
    address: "123 Mock Street, Mockville",
    location: {
      lat: 34.052235,
      lng: -118.243683,
    },
  }

  const [userLocation, setUserLocation] = useState(null)
  const [reached, setReached] = useState(false)
  const [showDirections, setShowDirections] = useState(true)


  // get browser geolocation
  useEffect(() => {
    // Use mock data for userLocation
    setUserLocation({
      lat: 34.052235, // Example latitude
      lng: -118.243683, // Example longitude
    })
  }, [])


  // show directions first
  if (!reached) {
    return (
      <div className="min-h-screen bg-background relative">
        <Header title="On the Way to Charger" />
        {!showDirections && <BackButton className="absolute left-4 top-4" />}
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
          onClick={() => {
            router.push('/charginginprogress')
          }}
        >
          Start Charging
        </Button>
      </div>
    </div>
  )
}
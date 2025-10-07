"use client"

import { useState, useEffect, useRef } from "react"
import { mockChargers } from "../../lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { DirectionsModal } from "./directions-modal"
import { useNavigation } from "@/lib/navigation-context"
import { MapPin, Navigation, Zap, Route } from "lucide-react"

export const ChargerMap = ({ userLocation, selectedCharger, onChargerSelect, chargers = mockChargers }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [showDirections, setShowDirections] = useState(false)
  const { navigateTo, setChargingFlow } = useNavigation()

  useEffect(() => {
    if (mapRef.current) {
      // Initialize mock map
      initializeMap()
    }
  }, [userLocation])

  const initializeMap = () => {
    // Mock map initialization
    console.log("Map initialized with user location:", userLocation)
  }

  const handleChargerClick = (charger) => {
    onChargerSelect(charger)
  }

  const getMarkerColor = (charger) => {
    if (!charger.available) return "#6b7280" // gray for occupied
    if (charger.type === "DC Fast") return "#dc2626" // red for fast charging
    return "#f59e0b" // amber for regular charging
  }

  const handleStartCharging = (charger) => {
    setChargingFlow((prev) => ({
      ...prev,
      selectedCharger: charger,
      step: "quantity",
    }))
    navigateTo("charging-flow")
  }

  const handleDirections = (charger) => {
    setShowDirections(true)
  }

  const displayChargers = chargers || mockChargers

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Charging Stations Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            {/* Mock Map Container */}
            <div
              ref={mapRef}
              className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900"
            >
              {/* Mock map background pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* User Location Marker */}
              {userLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                >
                  <div className="bg-blue-500 rounded-full p-2 shadow-lg border-2 border-white">
                    <Navigation className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600 whitespace-nowrap">
                    Your Location
                  </div>
                </div>
              )}

              {/* Charger Markers */}
              {displayChargers.map((charger, index) => {
                const offsetX = ((index % 3) - 1) * 80 + 50 // Spread markers around center
                const offsetY = ((Math.floor(index / 3) % 3) - 1) * 60 + 50
                const isSelected = selectedCharger?.id === charger.id

                return (
                  <div
                    key={charger.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                      isSelected ? "scale-110 z-20" : "z-10 hover:scale-105"
                    }`}
                    style={{
                      left: `${50 + offsetX}%`,
                      top: `${50 + offsetY}%`,
                    }}
                    onClick={() => handleChargerClick(charger)}
                  >
                    <div
                      className={`rounded-full p-2 shadow-lg border-2 ${
                        isSelected ? "border-primary ring-2 ring-primary/20" : "border-white"
                      }`}
                      style={{ backgroundColor: getMarkerColor(charger) }}
                    >
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    {isSelected && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background rounded-lg shadow-lg p-2 min-w-32 text-center border">
                        <p className="text-xs font-medium truncate">{charger.name}</p>
                        <p className="text-xs text-muted-foreground">{charger.type}</p>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button size="sm" variant="outline" className="bg-background/90 backdrop-blur-sm">
                  <Navigation className="h-4 w-4" />
                </Button>
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span>DC Fast</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Level 2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              {/* Distance indicator */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                <p className="font-medium">Nearby Stations</p>
                <p className="text-muted-foreground">{displayChargers.length} found within 5 miles</p>
              </div>
            </div>
          </div>

          {/* Selected Charger Details */}
          {selectedCharger && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{selectedCharger.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedCharger.address}
                  </p>
                </div>
                <Badge variant={selectedCharger.available ? "default" : "secondary"}>
                  {selectedCharger.available ? "Available" : "Occupied"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium">Type</p>
                  <p className="text-sm">{selectedCharger.type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium">Power</p>
                  <p className="text-sm">{selectedCharger.power}</p>
                </div>
                <div>
                  <p className="text-xs font-medium">Price</p>
                  <p className="text-sm">${selectedCharger.pricePerKwh}/kWh</p>
                </div>
                <div>
                  <p className="text-xs font-medium">Rating</p>
                  <p className="text-sm">⭐ {selectedCharger.rating}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!selectedCharger.available}
                  onClick={() => handleStartCharging(selectedCharger)}
                >
                  {selectedCharger.available ? "Start Charging" : "Currently Occupied"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => handleDirections(selectedCharger)}
                >
                  <Route className="h-4 w-4 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DirectionsModal component */}
      <DirectionsModal
        isOpen={showDirections}
        onClose={() => setShowDirections(false)}
        charger={selectedCharger}
        userLocation={userLocation}
      />
    </>
  )
}

"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "../../lib/auth-context"
import { useNavigation } from "../../lib/navigation-context"
import { useVehicles } from "../../lib/vehicle-context"
import { mockChargers, mockChargingSessions } from "../../lib/mock-data"
import { searchChargers, filterChargers, sortChargers } from "../../lib/search-utils"
import { Header } from "../ui/header"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { MapPin, Zap, DollarSign, Search, Map, ArrowUpDown, Car, Plus, Check, Pencil } from "lucide-react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AnalyticsDashboard } from "../analytics/analytics-dashboard"
import { ChargerMap } from "../map/charger-map"
import { AdvancedFilters } from "../search/advanced-filters"
import { BackButton } from "../ui/back-button"
import Link from "next/link"

export const EVOwnerDashboard = () => {
  const { user } = useAuth()
  const { currentPage, navigateTo } = useNavigation()
  const [location, setLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState("prompt")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    availability: "all",
    priceRange: null,
    powerLevel: null,
    minRating: 0,
    amenities: [],
  })
  const [sortBy, setSortBy] = useState("distance")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [viewMode, setViewMode] = useState("list")
  const [selectedCharger, setSelectedCharger] = useState(null)
  const { vehicles, selectedVehicle, setSelectedVehicle } = useVehicles()

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationPermission("granted")
      } catch (error) {
        setLocationPermission("denied")
        console.error("Location permission denied:", error)
      }
    }
  }

  const filteredAndSortedChargers = useMemo(() => {
    let result = mockChargers
    if (searchQuery.trim()) {
      result = searchChargers(result, searchQuery)
    }
    result = filterChargers(result, filters)
    result = sortChargers(result, sortBy, location)
    return result
  }, [searchQuery, filters, sortBy, location])

  const handleClearFilters = () => {
    setFilters({
      type: "all",
      availability: "all",
      priceRange: null,
      powerLevel: null,
      minRating: 0,
      amenities: [],
    })
    setSearchQuery("")
  }

  const handleStartCharging = (charger) => {
    navigateTo("charging-flow", { selectedCharger: charger })
  }

  const userSessions = mockChargingSessions.filter((session) => session.userId === user.id)
  const totalEnergyUsed = userSessions.reduce((sum, session) => sum + session.energyDelivered, 0)
  const totalCostSpent = userSessions.reduce((sum, session) => sum + session.cost, 0)

  // If navigating directly to analytics, show full page
  if (currentPage === "analytics") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <BackButton className="mb-4" />
            <Header title="Analytics Dashboard" />
          </div>
          <AnalyticsDashboard />
        </div>
      </div>
    )
  }

  // Render the selected vehicle card
  const SelectedVehicleCard = () => {
    if (!selectedVehicle) {
      return (
        <Card className="mb-6 border-dashed">
          <CardContent className="pt-6 text-center">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No vehicle selected</h3>
            <p className="text-muted-foreground mb-4">Please select a vehicle to get started</p>
            <Link href="/vehicles">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Vehicle
              </Button>
            </Link>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span>Current Vehicle</span>
                <Badge variant="secondary" className="ml-2">
                  Selected
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {selectedVehicle.make} {selectedVehicle.model} • {selectedVehicle.year}
                {selectedVehicle.licensePlate && ` • ${selectedVehicle.licensePlate}`}
              </CardDescription>
            </div>
            <Link href="/vehicles">
              <Button variant="ghost" size="sm" className="text-primary">
                Change <ArrowUpDown className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Battery</p>
              <p className="font-medium">{selectedVehicle.batteryCapacity} kWh</p>
            </div>
            <div>
              <p className="text-muted-foreground">Max Power</p>
              <p className="font-medium">{selectedVehicle.maxPower} kW</p>
            </div>
            <div>
              <p className="text-muted-foreground">Connector</p>
              <p className="font-medium capitalize">{selectedVehicle.connectorType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Range</p>
              <p className="font-medium">
                {Math.round(selectedVehicle.batteryCapacity * 6.5)} km
                <span className="text-xs text-muted-foreground ml-1">(est.)</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render the main dashboard content
  const DashboardContent = () => (
    <>
      <SelectedVehicleCard />
      {/* Rest of the dashboard content */}
      {/* ... */}
    </>
  )

  // Render the vehicles tab content
  const VehiclesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Vehicles</h2>
        <Link href="/vehicles">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Vehicle
          </Button>
        </Link>
      </div>
      
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No vehicles added yet</h3>
            <p className="text-muted-foreground mb-4">Add your first vehicle to get started</p>
            <Link href="/vehicles">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Vehicle
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className={selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <CardDescription>
                      {vehicle.year} • {vehicle.licensePlate || 'No plate'}
                    </CardDescription>
                  </div>
                  {selectedVehicle?.id === vehicle.id && (
                    <Badge>Selected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Battery</p>
                    <p>{vehicle.batteryCapacity}kWh</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Power</p>
                    <p>{vehicle.maxPower}kW</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Connector</p>
                    <p className="capitalize">{vehicle.connectorType}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant={selectedVehicle?.id === vehicle.id ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="flex-1"
                  >
                    {selectedVehicle?.id === vehicle.id ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Selected
                      </>
                    ) : (
                      'Select as Current'
                    )}
                  </Button>
                  <Link href={`/vehicles?edit=${vehicle.id}`}>
                    <Button variant="outline" size="sm" className="px-3">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header title="EV Owner Dashboard" />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardContent />
          </TabsContent>
          
          <TabsContent value="vehicles">
            <VehiclesContent />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
